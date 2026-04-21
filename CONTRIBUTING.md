# Contributing

First off, thank you for considering contributing to the AXIVO website! This document outlines the ways you can contribute and the processes we follow.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to foster an open, welcoming, and respectful environment.

## How Can I Contribute?

There are several ways you can contribute to the project:

### Asking Questions

If you have questions about the website or general inquiries about the project, please use [GitHub Discussions](https://github.com/axivo/website/discussions). This is the best place for community support and Q&A.

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

This project is built with [Next.js](https://nextjs.org/) and uses the [Nextra](https://nextra.site/) docs theme. The repository is structured as follows:

- `packages/website/`: Local `@axivo/website` package with subpath exports
- `public/`: Static assets organized by section
- `src/app/`: Next.js app routes with section layouts
- `src/components/`: Shared React components
- `src/config/`: Site configuration and section variables
- `src/content/`: MDX content organized by section

## Development Workflow

If you'd like to contribute code or documentation changes, please follow this workflow:

### Development Environment Setup

#### Prerequisites

- [Node.js](https://nodejs.org/) (version 22 or later)

#### Installation

1. **Fork the Repository:** Create your own fork of the `website` repository.

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/website.git
   cd website
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Create a Branch:** Create a new branch in your fork for your changes (e.g., `git checkout -b feature/my-new-feature` or `git checkout -b fix/issue-123`). Base your branch on the `main` branch.

5. **Launch the Development Server:**
   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000` in your browser to see the website.

### Making Changes

1. **Make Changes:** Implement your code or documentation changes.

2. **Follow Guidelines:**
   * Adhere to the project's coding standards documented in `CLAUDE.md`.
   * Perform a self-review of your changes.
   * Test your changes locally using the development server.
   * Build the static site to verify no errors: `npm run build`

3. **Submit a Pull Request:**
   * Push your changes to your fork (`git push origin feature/my-new-feature`).
   * Open a Pull Request against the `main` branch of the `axivo/website` repository.
   * Fill out the Pull Request template, ensuring you check the relevant boxes in the checklist.
   * Ensure your changes generate no new issues or warnings.

4. **Code Review:** Project maintainers will review your PR. Please address any feedback provided. Once approved, your changes will be merged.

## Coding Standards

- Include JSDoc `@fileoverview` on every file and `@param`/`@returns` on all functions.
- Place exports at the bottom of each file.
- Use alphabetical ordering for imports, exports, and configuration arrays.
- Write clear, descriptive commit messages.

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
including VictoriaMetrics and VictoriaLogs configurations.

Fixes #123
```

## Dependency Management

This project uses [Renovate Bot](https://github.com/renovatebot) to automate dependency updates. Renovate creates pull requests when new major or minor versions are available.

Please avoid including unrelated dependency version bumps in your Pull Requests unless the update is directly related to the feature or fix you are contributing.

## License

By contributing to this project, you agree that your contributions will be licensed under the license that covers the project.
