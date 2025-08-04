---
title: Getting Started
prev: /wiki
next: /wiki/guide
---

Set up the local environment and dependencies required for the collaboration platform. This guide covers installing essential tools and configuring the repository for profile system development and memory system integration.

<!--more-->

## Local Environment

Before using the platform, set up the local environment with the required dependencies.

{{< tabs items="Mac,Linux,Windows" >}}
  {{< tab >}}
    Use [Homebrew](https://brew.sh) package manager to install the Node.js and `uv` dependencies:

    ```shell
    brew install node uv
    ```
  {{< /tab >}}

  {{< tab >}}
    For Debian distros, use `apt` package manager to install the Node.js dependency:

    ```shell
    sudo apt update
    sudo apt install -y nodejs npm
    ```

    Use the official standalone installer to install the `uv` dependency:

    ```shell
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```
  {{< /tab >}}

  {{< tab >}}
    Use the official Windows Installer (`.msi`) from [nodejs.org](https://nodejs.org/en/download) to install the Node.js dependency, this includes the `npm` binary.

    Use the official standalone installer to install the `uv` dependency:

    ```shell
    powershell -c 'irm https://astral.sh/uv/install.ps1 | iex'
    ```
  {{< /tab >}}
{{< /tabs >}}

{{% steps %}}

### Repository

[Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the [`claude`](https://{{< param variables.repository.home >}}) GitHub repository and clone it locally:

```shell
git clone https://github.com/USERNAME/claude.git ~/github/claude
cd ~/github/claude
```

### Memory Configuration

Review the Memory System [configuration settings](/claude/wiki/guide/platform/memory/configuration) to understand how profiles and paths are configured. The default settings work for most users.

### Memory Builder

> [!NOTE]
> The [builder](/claude/wiki/guide/platform/memory/builder) step is optional, useful if future profile enhancements are required.

Build the Memory System from profile configurations:

```shell
cd ~/github/claude/tools/memory
npm install js-yaml
npm init -y
node ./lib/core/Package.js
npm run build --silent
```

### Application Configuration

Choose your preferred application, [Claude Code](/claude/wiki/guide/platform/code) or [Claude Desktop](/claude/wiki/guide/platform/desktop), and follow the setup instructions.

{{% /steps %}}

> [!IMPORTANT]
> The above steps provide a quick setup path. For detailed understanding of platform usage, configuration options, and advanced features, explore the comprehensive guide sections below.

## Next

Dive right into the following section:

{{< cards >}}
  {{< card icon="adjustments" link="../guide" title="Guide" subtitle="Configure the collaboration platform." >}}
{{< /cards >}}
