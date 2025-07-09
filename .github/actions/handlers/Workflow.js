/**
 * Workflow handler for common workflow operations
 * 
 * @module handlers/Workflow
 * @author AXIVO
 * @license BSD-3-Clause
 */
const Action = require('../core/Action');
const config = require('../config');
const FileService = require('../services/File');
const GitService = require('../services/Git');
const GitHubService = require('../services/Github');
const HugoService = require('../services/Hugo');
const IssueService = require('../services/Issue');
const LabelService = require('../services/Label');
const TemplateService = require('../services/Template');

/**
 * Workflow handler for Hugo site generation operations
 * 
 * Provides orchestration for repository configuration, Hugo module management,
 * site generation, and issue reporting for Hugo workflows.
 * 
 * @class WorkflowHandler
 */
class WorkflowHandler extends Action {
  /**
   * Creates a new WorkflowHandler instance
   * 
   * @param {Object} params - Handler parameters
   */
  constructor(params) {
    params.config = config;
    super(params);
    this.fileService = new FileService(params);
    this.gitService = new GitService(params);
    this.gitHubService = new GitHubService(params);
    this.hugoService = new HugoService(params);
    this.issueService = new IssueService(params);
    this.labelService = new LabelService(params);
    this.templateService = new TemplateService(params);
  }

  /**
   * Build Hugo documentation
   * 
   * @returns {Promise<void>}
   */
  async buildDocumentation() {
    return this.execute('build documentation', async () => {
      if (this.config.get('issue.createLabels')) {
        this.logger.info('Updating repository labels...');
        await this.labelService.update();
      }
      this.logger.info('Building documentation sites...');
      await this.hugoService.buildSites();
      this.logger.info('Documentation build complete');
    });
  }

  /**
   * Configure repository
   * 
   * @returns {Promise<void>}
   */
  async configureRepository() {
    return this.execute('configure repository', async () => {
      this.logger.info('Configuring repository for workflow operations...');
      await this.gitService.configure();
      this.logger.info('Repository configuration complete');
    });
  }

  /**
   * Report workflow issues
   * 
   * @returns {Promise<void>}
   */
  async reportIssue() {
    return this.execute('report workflow issue', async () => {
      this.logger.info('Checking for workflow issues...');
      if (this.config.get('issue.createLabels')) {
        const message = 'Set "createLabels: false" after initial setup';
        await this.gitHubService.createAnnotation(message);
        this.logger.warning(message);
      }
      const templatePath = this.config.get('workflow.template');
      const templateContent = await this.fileService.read(templatePath);
      const issue = await this.issueService.report(
        this.context,
        {
          content: templateContent,
          service: this.templateService
        }
      );
      let message = 'No workflow issues to report';
      if (issue) message = 'Successfully reported workflow issue';
      this.logger.info(`${message}`);
    }, false);
  }

  /**
   * Update Hugo modules
   * 
   * @returns {Promise<void>}
   */
  async updateModules() {
    return this.execute('update modules', async () => {
      this.logger.info('Updating modules...');
      await this.hugoService.updateModules();
      this.logger.info('Modules update complete');
    });
  }
}

module.exports = WorkflowHandler;
