/**
 * Hugo service for Hugo operations
 * 
 * @module services/Hugo
 * @author AXIVO
 * @license BSD-3-Clause
 */
const Action = require('../core/Action');
const GitService = require('./Git');
const ShellService = require('./Shell');

/**
 * Hugo service for Hugo operations
 * 
 * Provides Hugo integration including module management,
 * site building, and Git commit integration.
 * 
 * @class HugoService
 */
class HugoService extends Action {
  /**
   * Creates a new HugoService instance
   * 
   * @param {Object} params - Service parameters
   */
  constructor(params) {
    super(params);
    this.gitService = new GitService(params);
    this.shellService = new ShellService(params);
  }

  /**
   * Builds Hugo sites from configuration
   * 
   * @param {Object} [options={}] - Build options
   * @param {boolean} [options.gc=true] - Run garbage collection
   * @param {boolean} [options.minify=true] - Minify output
   * @param {string} [options.env='production'] - Hugo environment
   * @returns {Promise<void>}
   */
  async buildSites(options = {}) {
    const { gc = true, minify = true, env = 'production' } = options;
    return this.execute('build Hugo sites', async () => {
      const sites = this.config.get('workflow.hugo.websites');
      this.logger.info(`Building ${sites.length} Hugo sites...`);
      const buildArgs = [];
      if (gc) buildArgs.push('--gc');
      if (minify) buildArgs.push('--minify');
      for (const site of sites) {
        this.logger.info(`Building site: ${site}`);
        await this.shellService.execute('hugo', [...buildArgs, '-s', site], {
          output: true,
          env: { ...process.env, HUGO_ENV: env }
        });
      }
      this.logger.info(`Successfully built ${sites.length} Hugo sites`);
    });
  }

  /**
   * Cleans all Hugo modules
   * 
   * @returns {Promise<void>}
   */
  async cleanModules() {
    return this.execute('clean Hugo modules', async () => {
      this.logger.info('Cleaning Hugo modules...');
      await this.shellService.execute('hugo', ['mod', 'clean', '--all'], { output: true });
      this.logger.info('Successfully cleaned Hugo modules');
    });
  }

  /**
   * Tidies Hugo modules for configured sites
   * 
   * @returns {Promise<void>}
   */
  async tidyModules() {
    return this.execute('tidy Hugo modules', async () => {
      const sites = this.config.get('workflow.hugo.websites');
      this.logger.info(`Tidying Hugo modules for ${sites.length} sites...`);
      await Promise.all(sites.map(site =>
        this.shellService.execute('hugo', ['mod', 'tidy', '-s', site], { output: true })
      ));
      this.logger.info(`Successfully tidied Hugo modules for ${sites.length} sites`);
    });
  }

  /**
   * Updates Hugo modules and commits changes
   * 
   * @returns {Promise<Object>} Update operation result
   */
  async updateModuleChecksums() {
    return this.execute('update Hugo module checksums', async () => {
      this.logger.info('Updating Hugo module checksums...');
      await this.cleanModules();
      await this.shellService.execute('hugo', ['mod', 'get', '-u', './...'], { output: true });
      await this.tidyModules();
      const statusResult = await this.gitService.getStatus();
      const files = [...statusResult.modified, ...statusResult.untracked];
      if (!files.length) {
        this.logger.info('No module checksum changes to commit');
        return { updated: 0 };
      }
      const branch = process.env.GITHUB_HEAD_REF;
      const result = await this.gitService.signedCommit(
        branch,
        files,
        'chore(github-action): update module checksums'
      );
      this.logger.info('Successfully updated Hugo module checksums');
      return result;
    });
  }
}

module.exports = HugoService;
