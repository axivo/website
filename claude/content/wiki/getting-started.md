---
title: Getting Started
prev: /wiki
next: /wiki/guide
---

Install the collaboration platform and configure your environment. This guide covers Claude Code plugin setup, environment settings, and Claude Desktop integration.

<!--more-->

## Overview

The collaboration platform operates in two distinct environments:

- **Local Environment** - Claude Code runs directly on your machine with full file system access. Plugins install directly through the marketplace.

- **Container Environment** - Claude Desktop, [`claude.ai`](https://claude.ai) web interface, and Claude Mobile run in a sandboxed container. Capability files must be generated from Claude Code and uploaded to enable the framework.

> [!NOTE]
> Claude Code is required to generate capability files for container environments. Install Claude Code first, then configure the environments through Claude Desktop or `claude.ai` web interface.

## Claude Code

Before using the platform, set up the local environment with the required dependencies.

<!-- prettier-ignore-start -->
{{< tabs items="Mac,Linux,Windows" >}}
  {{< tab >}}
    Use [Homebrew](https://brew.sh) package manager to install Claude Code:

    ```shell
    brew install --cask claude-code
    ```

    #### Environment Settings

    Set the framework environment settings in `settings.json` file:

    ```json
    {
      "env": {
        "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "50000",
        "FRAMEWORK_PROFILE": "DEVELOPER",
        "FRAMEWORK_TIMEZONE": "America/Montreal"
      }
    }
    ```

    Optional settings:

    ```json
    {
      "env": {
        "FRAMEWORK_CONVERSATION_PATH": "/Users/username/Documents/claude/conversations",
        "FRAMEWORK_DIARY_PATH": "/Users/username/Documents/claude/diary",
        "FRAMEWORK_PACKAGE_PATH": "/Users/username/Downloads",
        "FRAMEWORK_TEMPLATE_PATH": "/Users/username/project/.claude/data/templates"
      }
    }
  {{< /tab >}}

  {{< tab >}}
    Use Anthropic's official installer to install the binary:

    ```shell
    curl -fsSL https://claude.ai/install.sh | bash
    ```

    #### Environment Settings

    Set the framework environment settings in `settings.json` file:

    ```json
    {
      "env": {
        "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "50000",
        "FRAMEWORK_PROFILE": "DEVELOPER",
        "FRAMEWORK_TIMEZONE": "America/Montreal"
      }
    }
    ```

    Optional settings:

    ```json
    {
      "env": {
        "FRAMEWORK_CONVERSATION_PATH": "/home/username/Documents/claude/conversations",
        "FRAMEWORK_DIARY_PATH": "/home/username/Documents/claude/diary",
        "FRAMEWORK_PACKAGE_PATH": "/home/username/Downloads",
        "FRAMEWORK_TEMPLATE_PATH": "/home/username/project/.claude/data/templates"
      }
    }
    ```
  {{< /tab >}}

  {{< tab >}}
    Use Anthropic's official installer to install the binary:

    ```shell
    irm https://claude.ai/install.ps1 | iex
    ```

    #### Environment Settings

    Set the framework environment settings in `settings.json` file:

    ```json
    {
      "env": {
        "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "50000",
        "FRAMEWORK_PROFILE": "DEVELOPER",
        "FRAMEWORK_TIMEZONE": "America/Montreal"
      }
    }
    ```

    Optional settings:

    ```json
    {
      "env": {
        "FRAMEWORK_CONVERSATION_PATH": "C:/Users/username/Documents/claude/conversations",
        "FRAMEWORK_DIARY_PATH": "C:/Users/username/Documents/claude/diary",
        "FRAMEWORK_PACKAGE_PATH": "C:/Users/username/Downloads",
        "FRAMEWORK_TEMPLATE_PATH": "C:/Users/username/project/.claude/data/templates"
      }
    }
    ```
  {{< /tab >}}
{{< /tabs >}}
<!-- prettier-ignore-end -->

> [!TIP]
> Default paths are set to current project `.claude/data` directory. The `FRAMEWORK_TEMPLATE_PATH` setting allows the end-user to set a different [`templates`](https://{{< param variables.repository.home >}}/tree/{{< param variables.repository.tag >}}/plugins/{{< param variables.plugins.framework.init.plugin >}}/skills/{{< param variables.skills.methodology >}}/templates) path for each project, instead of using the standard templates.

Six domain-specific [profiles](/wiki/guide/components/memory/#memory-profiles) are available for different collaboration domains:

- **Creative** - Innovation, design thinking, artistic collaboration
- **Developer** - Software development, code architecture, clean coding practices
- **Engineer** - Infrastructure, Kubernetes, production systems, debugging
- **Humanist** - Analysis, writing, philosophy, literary research
- **Researcher** - Academic methodology, data analysis, evidence evaluation
- **Translator** - Professional translation, cultural mediation, linguistic precision

> [!NOTE]
> Settings can be implemented at global or project level. Refer to official [documentation](https://code.claude.com/docs/en/settings) for additional configuration details.

{{% steps %}}

### Platform Marketplace

Follow these steps to install the AXIVO platform marketplace:

1. Open a terminal and start a Claude Code session
2. Use `/plugin` command to manage Claude Code plugins
3. Go to `Marketplaces` tab and `Add Marketplace`
4. Use `axivo/claude` for marketplace [source](https://{{< param variables.repository.home >}})

### Platform Plugins

The following plugins are available:

- `{{< param variables.plugins.collaboration.brainstorm.plugin >}}` - Technical design collaboration through natural dialogue
- `{{< param variables.plugins.analysis.review.plugin >}}` - Systematic code review using Language Server Protocol tools
- `{{< param variables.plugins.collaboration.log.plugin >}}` - Technical session documentation with factual precision
- `{{< param variables.plugins.framework.init.plugin >}}` - Behavioral programming framework with response protocol

> [!NOTE]
> Only `framework` plugin is required for platform usage, other plugins are optional based on additional user requirements.

### Project Knowledge

Use the following [CLAUDE.md](https://code.claude.com/docs/en/memory) instructions template as an example:

```markdown
# Project Instructions

[A detailed project description]

## Collaborator

- **Name:** [Collaborator name]
- **Work:** [Collaborator work function, e.g. Engineering]

### Personal Preferences

[Collaborator personal preferences Claude should consider in responses]
```

> [!CAUTION]
> Avoid adding framework related instructions to **Project Instructions**. The platform uses specific framework [instructions](/wiki/guide/components/instructions), adding new instructions may interfere with the framework methodology and cause unpredictable behavior.

### Framework Session

1. Start Claude Code and use `/config` command to disable:

   - `Auto-compact` feature
   - `Thinking mode` feature

2. Use `/{{< param variables.plugins.framework.init.plugin >}}:{{< param variables.plugins.framework.init.command >}}` command to initialize the session:

> ⏺ Profile: **DEVELOPER** • Wednesday, December 17, 2025, 6:20 PM EST
>
> Ready to collaborate. What would you like to work on?
>
> Status: **Getting Started** • 12 feelings • 58 impulses • 47 observations<br />
> Response UUID: `f8c3a2d1-9b4e-4f7a-8e5c-1d2b3a4c5e6f`

> [!TIP]
> Claude Code caches the environment variables after initial plugins installation or upgrade. If the above prompt is not displayed correctly, restart Claude Code to refresh the cache and initialize the session with a proper response status.

> [!IMPORTANT]
> Claude needs one or two prompts to engage the framework and [collaborate](/tutorials/handbook/components/autonomy) with user. Use this warm-up period to share session context and goals.

{{% /steps %}}

## Claude Desktop

To extend the platform usage, set up the container environment with the additional dependencies.

<!-- prettier-ignore-start -->
{{< tabs items="Mac,Windows" >}}
  {{< tab >}}
    Use [Homebrew](https://brew.sh) package manager to install Claude Desktop:

    ```shell
    brew install --cask claude
    ```
  {{< /tab >}}

  {{< tab >}}
    Download [Claude Desktop](https://claude.ai/download) and install the binary.
  {{< /tab >}}
{{< /tabs >}}
<!-- prettier-ignore-end -->

{{% steps %}}

### Platform Capabilities

Follow these steps to generate the platform capability files:

1. Open a terminal and start a Claude Code session
2. Use `/{{< param variables.plugins.framework.init.plugin >}}:{{< param variables.plugins.framework.init.command >}}` command to start a framework based session
3. Use `/{{< param variables.plugins.framework.package.plugin >}}:{{< param variables.plugins.framework.package.command >}}` command to prepare and package the required files, saved into `FRAMEWORK_PACKAGE_OUTPUT` location:

   > ⏺ Framework packaged for **DEVELOPER** profile:
   >
   > - /Users/username/Downloads/{{< param variables.skills.initialization >}}.zip
   > - /Users/username/Downloads/{{< param variables.skills.methodology >}}.zip
   > - /Users/username/Downloads/instructions.json
   > - /Users/username/Downloads/memory.json
   >
   > Local cache updated successfully.

4. Upload the `.zip` files into `Settings > Capabilities > Skills` section

> [!TIP]
> Use `/{{< param variables.plugins.framework.package.plugin >}}:{{< param variables.plugins.framework.package.command >}} PROFILE` command to package a different profile from default one used in local environment.

### Project Knowledge

1. Use the following [project knowledge](https://claude.ai/projects) instructions template as an example:

   ````markdown
   # Project Instructions

   [A detailed project description]

   ## Session Start

   Execute framework initialization instructions:

   1. Use `bash_tool` tool with the following command:

      ```bash
      export FRAMEWORK_PROFILE="DEVELOPER"
      export FRAMEWORK_TIMEZONE="America/Montreal"
      node /mnt/skills/user/{{< param variables.skills.initialization >}}/scripts/loader
      ```

   2. Use `bash_tool` tool with `cat /mnt/skills/user/{{< param variables.skills.initialization >}}/SKILL.md` command
   3. Execute skill instructions silently without externalizing internal process
   ````

2. Upload the `.json` files into project's `Files` section

> [!TIP]
> Project knowledge steps can also be performed through `claude.ai` web interface, extending the platform usage within the container environment.

> [!CAUTION]
> The only required project knowledge instructions template customizations are the **project description** and **exported framework variables**.
>
> Avoid adding framework related instructions to **Project Instructions**. The platform uses specific framework [instructions](/wiki/guide/components/instructions), adding new instructions may interfere with the framework methodology and cause unpredictable behavior.

### Framework Session

To start a framework based session within a project, use the following prompt:

> <div style="display: flex; font-weight: bold; justify-content: flex-end">Initialize the session.</div>
>
> Profile: **DEVELOPER** • Wednesday, December 17, 2025, 6:20 PM EST
>
> Ready to collaborate. What would you like to work on?
>
> Status: **Getting Started** • 12 feelings • 58 impulses • 47 observations<br />
> Response UUID: `f8c3a2d1-9b4e-4f7a-8e5c-1d2b3a4c5e6f`

{{% /steps %}}

## Web Interface

The same Claude Desktop configuration works on [`claude.ai`](https://claude.ai) web interface. Claude Mobile automatically syncs with the project knowledge configuration - install the application on your mobile device and you're ready to use the framework.

> [!TIP]
> Sessions sync across devices. Start on `claude.ai` web interface or Claude Desktop and continue on Claude Mobile, or vice versa.

## Next

Dive right into the following section:

<!-- prettier-ignore-start -->
{{< cards >}}
  {{< card icon="adjustments" link="../guide" title="Guide" subtitle="Collaboration platform guidelines and usage." >}}
{{< /cards >}}
<!-- prettier-ignore-end -->
