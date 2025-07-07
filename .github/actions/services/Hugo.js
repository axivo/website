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
      Object.assign(process.env, this.config.get('workflow.hugo.environment'));
      const sites = this.config.get('workflow.hugo.sites');
      this.logger.info(`Building ${sites.length} documentation sites...`);
      const args = ['--logLevel', this.config.get('workflow.hugo.logLevel')];
      if (gc) args.push('--gc');
      if (minify) args.push('--minify');
      await Promise.all(sites.map(site => {
        this.logger.info(`Building '${site}' documentation site...`);
        return this.shellService.execute('hugo', [...args, '-s', site], { output: true, silent: false });
      }));
      this.logger.info(`Successfully built ${sites.length} documentation sites`);
    });
  }

  /**
   * Updates Hugo modules and commits changes
   * 
   * @returns {Promise<Object>} Update operation result
   */
  async updateModules() {
    return this.execute('update modules', async () => {
      this.logger.info('Updating modules...');
      await this.shellService.execute('hugo', ['mod', 'clean', '--all'], { output: true, silent: false });
      const modules = this.config.get('workflow.hugo.modules');
      const sites = this.config.get('workflow.hugo.sites');
      const allDirs = [...modules, ...sites];
      await Promise.all(allDirs.map(dir =>
        this.shellService.execute('hugo', ['mod', 'get', '-s', dir], { output: true, silent: false })
      ));
      await Promise.all(allDirs.map(dir =>
        this.shellService.execute('hugo', ['mod', 'tidy', '-s', dir], { output: true, silent: false })
      ));
      const statusResult = await this.gitService.getStatus();
      const files = [...statusResult.modified, ...statusResult.untracked];
      if (!files.length) {
        this.logger.info('No module changes to commit');
        return { updated: 0 };
      }
      const branch = process.env.GITHUB_HEAD_REF;
      const result = await this.gitService.signedCommit(
        branch,
        files,
        'chore(github-action): update modules'
      );
      this.logger.info('Successfully updated modules');
      return result;
    });
  }
}

module.exports = HugoService;
