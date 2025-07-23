/**
 * Services module
 * 
 * @module services
 * @author AXIVO
 * @license BSD-3-Clause
 */
const FileService = require('./File');
const GitService = require('./Git');
const GitHubService = require('./Github');
const HugoService = require('./Hugo');
const IssueService = require('./Issue');
const LabelService = require('./Label');
const ShellService = require('./Shell');
const TemplateService = require('./Template');

module.exports = {
  File: FileService,
  Git: GitService,
  GitHub: GitHubService,
  Hugo: HugoService,
  Issue: IssueService,
  Label: LabelService,
  Shell: ShellService,
  Template: TemplateService
};
