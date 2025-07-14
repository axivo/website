---
title: Getting Started
prev: /wiki
next: /wiki/guide
---

Set up the local environment and dependencies required for the collaboration platform. This guide covers installing essential tools and configuring the repository for profile system development and memory system integration.

<!--more-->

## Local Environment

Before using the platform, set up the local environment with the required dependencies.

> [!NOTE]
> [Homebrew](https://brew.sh) is used to install all deployment dependencies.

{{% steps %}}

### Dependencies

Install dependencies for memory system and profile configuration:

```shell
brew install node uv
```

### Collaboration Platform

[Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the [`claude`](https://{{< param variables.repository.home >}}) GitHub repository to create your personal configuration repository. This enables version control of your profile customizations, MCP server settings, and conversation logs while maintaining the ability to pull upstream updates.

{{% /steps %}}

## Next

Dive right into the following section:

{{< cards >}}
  {{< card icon="adjustments" link="../guide" title="Guide" subtitle="Configure the collaboration platform." >}}
{{< /cards >}}
