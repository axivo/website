# Contributing

First off, thank you for considering contributing to the AXIVO website! This document outlines the ways you can contribute and the processes we follow.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to foster an open, welcoming, and respectful environment.

## How Can I Contribute?

There are several ways you can contribute to the project:

### Asking Questions

If you have questions about the website, Hugo configuration, or general inquiries about the project, please use [GitHub Discussions](https://github.com/axivo/website/discussions). This is the best place for community support and Q&A.

### Reporting Bugs

If you encounter a bug, please follow these steps:

1. **Search Existing Issues:** Before creating a new issue, please search the [existing bug reports](https://github.com/axivo/website/issues?q=is%3Aissue+label%3Abug) to see if the issue has already been reported.
2. **Create a New Issue:** If the bug hasn't been reported, please open a new issue with the bug label. Provide as much detail as possible, including:
   * A clear description of the bug and expected behavior.
   * Your browser and operating system.
   * Steps to reproduce the issue.
   * Screenshots if applicable.
   * Any other context that might help diagnose the issue.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one:

1. **Search Existing Issues:** Check the [existing enhancement requests](https://github.com/axivo/website/issues?q=is%3Aissue+label%3Aenhancement) to see if your idea has already been suggested.
2. **Create a New Issue:** If your idea is new, please open an issue with the enhancement label. Describe:
   * The problem your enhancement solves.
   * Your proposed solution.
   * Any alternative solutions you've considered.

## Project Structure

This project is built with [Hugo](https://gohugo.io/) and uses the [Hextra](https://github.com/imfing/hextra) theme. The repository is structured as follows:

- `docs/`: Main documentation website content
- `k3s-cluster/`: K3s cluster specific content
- `.github/workflows/`: GitHub Actions workflows for CI/CD
- `global/`: Shared resources across the site

Each module (`docs`, `k3s-cluster`, etc.) has its own `go.mod` and `go.sum` files for managing dependencies.

## Development Workflow

If you'd like to contribute code or documentation changes, please follow this workflow:

### Development Environment Setup

#### Prerequisites

- [Go](https://golang.org/) (version 1.21 or later recommended)
- [Hugo](https://gohugo.io/) (extended version 0.145.0 or later)

#### Installation

1. **Fork the Repository:** Create your own fork of the `website` repository.

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/website.git
   cd website
   ```

3. **Install Dependencies (macOS):**
   ```bash
   brew install hugo golang
   ```

4. **Create a Branch:** Create a new branch in your fork for your changes (e.g., `git checkout -b feature/my-new-feature` or `git checkout -b fix/issue-123`). Base your branch on the `main` branch.

5. **Launch the Development Server:**
   ```bash
   hugo server --disableFastRender -Ds ./docs
   ```

6. Visit `http://localhost:1313` in your browser to see the website.

### Making Changes

1. **Make Changes:** Implement your code or documentation changes.

2. **Follow Guidelines:**
   * Adhere to the project's coding style, aim for clarity and consistency with existing code.
   * Perform a self-review of your changes.
   * Test your changes locally using the development server.

3. **Submit a Pull Request:**
   * Push your changes to your fork (`git push origin feature/my-new-feature`).
   * Open a Pull Request against the `main` branch of the `axivo/website` repository.
   * Fill out the Pull Request template, ensuring you check the relevant boxes in the checklist.
   * Ensure your changes generate no new issues or warnings.

4. **Code Review:** Project maintainers will review your PR. Please address any feedback provided. Once approved, your changes will be merged.

## Coding Standards

- Follow the existing code style in the project.
- Write clear, descriptive commit messages.
- Include comments in your code where necessary.
- Ensure your changes don't introduce linting errors or warnings.

## Commit Messages

We follow a standard format for commit messages to make the project history clear and generate accurate changelogs:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

Example commit message:
```
feat: Add K3s monitoring documentation

This adds detailed instructions for setting up monitoring for K3s clusters,
including Prometheus and Grafana configurations.

Fixes #123
```

## Dependency Management

This project uses [Renovate Bot](https://github.com/renovatebot) to automate dependency updates. Renovate will automatically create pull requests when new versions of dependencies are available.

### How Renovate Works in This Repository

1. **Automated Scanning**: Renovate regularly scans the repository for dependencies defined in `go.mod` files and other configuration files.

2. **Pull Request Creation**: When updates are available, Renovate creates pull requests with the necessary changes.

3. **Module Checksums**: Our GitHub workflow automatically updates Go module checksums when Renovate PRs are created or updated.

4. **PR Review Process**: Each Renovate PR undergoes the same review process as regular contributions. CI tests will run to verify the updates don't break anything.

Please avoid including unrelated dependency version bumps in your Pull Requests unless the update is directly related to the feature or fix you are contributing.

Note: Manual updates of dependencies are no longer necessary as Renovate handles this process automatically.

## License

By contributing to this project, you agree that your contributions will be licensed under the license that covers the project.
