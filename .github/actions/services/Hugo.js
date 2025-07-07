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
   * @returns {Promise<void>}
   */
  async buildSites(options = {}) {
    const { gc = true, minify = true } = options;
    return this.execute('build documentation sites', async () => {
      const logLevel = this.config.get('workflow.hugo.logLevel');
      const environment = this.config.get('workflow.hugo.environment');
      if (logLevel === 'debug') environment.ACTIONS_STEP_DEBUG = 'true';
      Object.assign(process.env, this.config.get('workflow.hugo.environment'));
      const sites = this.config.get('workflow.hugo.sites');
      this.logger.info(`Building ${sites.length} documentation sites...`);
      const args = ['--logLevel', logLevel];
      if (gc) args.push('--gc');
      if (minify) args.push('--minify');
      await Promise.all(sites.map(site => {
        this.logger.info(`Building '${site}' documentation site...`);
        return this.shellService.execute('hugo', [...args, '-s', site], {
          output: true,
          silent: false
        });
      }));
      this.logger.info(`Successfully built ${sites.length} documentation sites`);
    });
  }

  /**
   * Updates Hugo modules and commits changes
   * 
   * @returns {Promise<Object>} Update operation result
   */
  async updateModuleChecksums() {
    return this.execute('update module checksums', async () => {
      this.logger.info('Updating module checksums...');
      Object.assign(process.env, this.config.get('workflow.hugo.environment'));
      const args = ['--logLevel', this.config.get('workflow.hugo.logLevel')];
      await this.shellService.execute('hugo', ['mod', 'clean', '--all', ...args], {
        output: true,
        silent: false
      });
      const modules = this.config.get('workflow.hugo.modules');
      const sites = this.config.get('workflow.hugo.sites');
      const allDirs = [...modules, ...sites];
      await Promise.all(allDirs.map(dir =>
        this.shellService.execute('hugo', ['mod', 'get', '-u', ...args, '-s', dir], {
          output: true,
          silent: false
        })
      ));
      await Promise.all(allDirs.map(dir =>
        this.shellService.execute('hugo', ['mod', 'tidy', ...args, '-s', dir], {
          output: true,
          silent: false
        })
      ));
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
      this.logger.info('Successfully updated module checksums');
      return result;
    });
  }
}

module.exports = HugoService;
