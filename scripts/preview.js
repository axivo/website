/**
 * @fileoverview Preview script for local LAN-accessible Wrangler dev server.
 *
 * Detects the Mac's primary LAN IPv4 address from network interfaces, ensures
 * a publicly-trusted Let's Encrypt certificate exists for the configured
 * preview hostname, builds the OpenNext bundle, and runs
 * `opennextjs-cloudflare preview` bound to the LAN IP with HTTPS enabled.
 *
 * Certificate management uses ACME via the official `acme-client` library
 * with a DNS-01 challenge handled through the Cloudflare API. Issued PEMs
 * are cached under `./certs/` and reused on subsequent runs until the
 * remaining validity drops below the renewal threshold.
 *
 * Usage: node scripts/preview.js
 */

import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { networkInterfaces } from 'node:os'
import { spawn } from 'node:child_process'
import acme from 'acme-client'
import Cloudflare from 'cloudflare'
import { config } from 'dotenv'
import { cloudflare, domain } from '@axivo/website/global'
import { copyAssets } from '@axivo/website/assets'

const certDir = './certs'
const renewalThresholdMs = 30 * 24 * 60 * 60 * 1000

/**
 * Removes log files left by previous preview runs from `./logs/`. Scoped
 * to `preview-*.log` and `wrangler-*.log` to avoid touching unrelated
 * files in the directory. Silently skips when the directory is missing.
 *
 * @returns {void}
 */
function cleanLogs() {
  let entries
  try {
    entries = readdirSync('./logs')
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.startsWith('preview-') || entry.startsWith('wrangler-')) {
      unlinkSync(join('./logs', entry))
    }
  }
}

/**
 * Reads the cached ACME account key for the active environment when
 * present, otherwise generates a fresh ECDSA P-256 key, persists it
 * under `./certs/`, and returns the PEM. Account keys are namespaced
 * per environment so staging and production accounts stay separate.
 *
 * @param {string} environment - ACME environment ('staging' or 'production').
 * @returns {Promise<Buffer>} PEM-encoded account private key.
 */
async function getAccountKey(environment) {
  const accountKeyPath = join(certDir, `account.${environment}.key`)
  if (existsSync(accountKeyPath)) {
    return readFileSync(accountKeyPath)
  }
  const accountKey = await acme.crypto.createPrivateEcdsaKey()
  writeFileSync(accountKeyPath, accountKey, { mode: 0o600 })
  return accountKey
}

/**
 * Returns a valid Let's Encrypt certificate for the configured preview
 * hostname. Reuses cached PEMs when remaining validity exceeds the
 * renewal threshold; otherwise issues a new certificate via ACME with
 * a DNS-01 challenge resolved through the Cloudflare API.
 *
 * @param {string} host - Fully-qualified preview hostname.
 * @returns {Promise<{certPath: string, keyPath: string}>}
 */
async function getCertificate(host) {
  mkdirSync(certDir, { recursive: true })
  const certPath = join(certDir, `${host}.pem`)
  const keyPath = join(certDir, `${host}.key`)
  const environment = cloudflare.zone.acme.environment
  if (existsSync(certPath) && existsSync(keyPath)) {
    const { environment: certEnvironment, ms } = getCertificateMs(certPath)
    if (certEnvironment !== environment) {
      console.info(`Reissuing '${environment}' certificate for '${host}' host ...`)
    } else if (ms > renewalThresholdMs) {
      const remainingDays = Math.floor(ms / 86_400_000)
      console.info(`Valid '${environment}' certificate for '${host}' host expiring in ${remainingDays} days`)
      return { certPath, keyPath }
    } else {
      console.info(`Reissuing '${environment}' certificate for '${host}' host ...`)
    }
  } else {
    console.info(`Issuing '${environment}' certificate for '${host}' host ...`)
  }
  const accountKey = await getAccountKey(environment)
  const directoryUrl = acme.directory.letsencrypt[environment]
  const client = new acme.Client({ accountKey, directoryUrl })
  const cf = new Cloudflare({ apiToken: process.env.ZONE_DNS_TOKEN })
  const challengeRecords = new Map()
  const [certificateKey, csr] = await acme.crypto.createCsr({ altNames: [host] })
  const certificate = await client.auto({
    challengeCreateFn: async (authz, challenge, keyAuthorization) => {
      if (challenge.type !== 'dns-01') {
        return
      }
      const record = await cf.dns.records.create({
        zone_id: process.env.ZONE_ID,
        type: 'TXT',
        name: `_acme-challenge.${authz.identifier.value}`,
        content: `"${keyAuthorization}"`,
        ttl: 1
      })
      challengeRecords.set(authz.identifier.value, record.id)
      await new Promise(resolve => setTimeout(resolve, 10_000))
    },
    challengeRemoveFn: async (authz, challenge) => {
      if (challenge.type !== 'dns-01') {
        return
      }
      const recordId = challengeRecords.get(authz.identifier.value)
      if (!recordId) {
        return
      }
      try {
        await cf.dns.records.delete(recordId, { zone_id: process.env.ZONE_ID })
      } catch (error) {
        console.warn(`Failed to remove ACME challenge record: ${error.message}`)
      }
      challengeRecords.delete(authz.identifier.value)
    },
    challengePriority: ['dns-01'],
    csr,
    email: `floren@${domain.name}`,
    skipChallengeVerification: true,
    termsOfServiceAgreed: true
  })
  writeFileSync(keyPath, certificateKey, { mode: 0o600 })
  writeFileSync(certPath, certificate)
  console.info(`Certificate for '${host}' issued`)
  return { certPath, keyPath }
}

/**
 * Parses the cached certificate and returns its remaining validity in
 * milliseconds along with the issuer environment derived from the
 * issuer common name. Let's Encrypt staging issuers contain the literal
 * substring `STAGING`; production issuers do not. Returns `0` ms and
 * `null` environment when the certificate cannot be parsed so the
 * caller treats it as invalid.
 *
 * @param {string} certPath - Filesystem path to the cached certificate.
 * @returns {{ environment: string|null, ms: number }}
 */
function getCertificateMs(certPath) {
  try {
    const pem = readFileSync(certPath, 'utf8')
    const { issuer, notAfter } = acme.crypto.readCertificateInfo(pem)
    const environment = issuer.commonName?.includes('STAGING') ? 'staging' : 'production'
    return { environment, ms: new Date(notAfter).getTime() - Date.now() }
  } catch {
    return { environment: null, ms: 0 }
  }
}

/**
 * Detects the primary LAN IPv4 address by walking network interfaces and
 * selecting the first non-internal IPv4 entry. Prefers en0 (Wi-Fi/Ethernet
 * on macOS) when present, otherwise falls back to the first matching entry.
 *
 * @returns {string} The detected LAN IPv4 address.
 * @throws {Error} If no non-internal IPv4 address is available.
 */
function getLanAddress() {
  const interfaces = networkInterfaces()
  const preferred = interfaces.en0?.find(entry => entry.family === 'IPv4' && !entry.internal)
  if (preferred) {
    return preferred.address
  }
  for (const entries of Object.values(interfaces)) {
    const entry = entries?.find(item => item.family === 'IPv4' && !item.internal)
    if (entry) {
      return entry.address
    }
  }
  throw new Error('No IPv4 address found')
}

/**
 * Generates a log file path under `./logs/` with the format
 * `preview-YYYY-MM-DD_HH-MM-SS_mmm.log`, matching wrangler's own log
 * filename convention. The millisecond suffix guarantees uniqueness when
 * the script is invoked multiple times within the same second.
 *
 * @returns {string} The absolute log file path.
 */
function getLogPath() {
  const now = new Date()
  const pad = (value, length = 2) => String(value).padStart(length, '0')
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  const ms = pad(now.getMilliseconds(), 3)
  mkdirSync('./logs', { recursive: true })
  return join('./logs', `preview-${date}_${time}_${ms}.log`)
}

/**
 * Runs the preview pipeline: loads `.dev.vars`, clears stale logs,
 * detects the LAN IP, optionally issues a Let's Encrypt certificate
 * when Cloudflare credentials are available, opens a timestamped log
 * stream, builds the OpenNext bundle, and runs the LAN-bound preview
 * server. Falls back to plain HTTP when credentials are missing so
 * fresh clones can preview without ACME setup. Exits with the child
 * process's status code so build or preview failures propagate to the
 * shell.
 *
 * @returns {Promise<void>}
 */
async function preview() {
  config({ path: '.dev.vars' })
  cleanLogs()
  const ip = getLanAddress()
  let previewArgs
  if (process.env.ZONE_DNS_TOKEN && process.env.ZONE_ID) {
    const host = `${cloudflare.zone.subdomain}.${domain.name}`
    const { certPath, keyPath } = await getCertificate(host)
    previewArgs = [
      'preview',
      '--https-cert-path', certPath,
      '--https-key-path', keyPath,
      '--ip', ip,
      '--local-protocol', 'https'
    ]
  } else {
    console.info('Cloudflare credentials not found, starting plain HTTP preview')
    previewArgs = ['preview', '--ip', ip]
  }
  const logPath = getLogPath()
  const logStream = createWriteStream(logPath, { flags: 'a' })
  const buildStatus = await startProcess('opennextjs-cloudflare', ['build'], logStream)
  if (buildStatus !== 0) {
    logStream.end()
    process.exit(buildStatus)
  }
  copyAssets()
  const previewStatus = await startProcess('opennextjs-cloudflare', previewArgs, logStream)
  logStream.end()
  process.exit(previewStatus)
}

/**
 * Spawns a child command, mirroring its stdout and stderr to both the
 * parent process and the provided log stream. Resolves with the child's
 * exit status.
 *
 * @param {string} command - The executable to run.
 * @param {string[]} args - Arguments to pass to the executable.
 * @param {WriteStream} logStream - Open log stream to mirror output into.
 * @returns {Promise<number>} The exit status of the child process.
 */
function startProcess(command, args, logStream) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: { ...process.env, FORCE_COLOR: '1', NODE_OPTIONS: '--no-webstorage' }
    })
    child.stdout.on('data', chunk => {
      process.stdout.write(chunk)
      logStream.write(chunk)
    })
    child.stderr.on('data', chunk => {
      process.stderr.write(chunk)
      logStream.write(chunk)
    })
    child.on('error', reject)
    child.on('close', code => resolve(code ?? 0))
  })
}

await preview()
