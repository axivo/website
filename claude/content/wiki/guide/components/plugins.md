---
title: Plugins System
prev: /wiki/guide/components
next: /wiki/guide/components/documentation
weight: 1
---

The collaboration platform extends through installable plugins. Each plugin provides specialized capabilities through commands and auto-invoked skills.

<!--more-->

## Overview

Plugins follow a consistent architecture with commands (user-invoked actions) and skills (auto-invoked or callable behaviors). AXIVO [marketplace](https://{{< param variables.repository.home >}}) provides centralized distribution with version management.

### Workflow

Claude Code serves as the primary authoring environment:

```text
Claude Code → /framework:package → Claude Desktop
```

1. **Configure** — Set environment variables and install plugins in Claude Code
2. **Initialize** — Start framework sessions with `/framework:init`
3. **Package** — Generate Claude Desktop files with `/framework:package`
4. **Upload** — Transfer `.zip` and `.json` files to Claude Desktop

### Installation

Install plugins through the Claude Code plugin manager:

1. Use `/plugin` command to open the plugin manager
2. Navigate to `Marketplaces` tab and add `axivo/claude` source
3. Browse available plugins and install as needed

### Environment Settings

Configure framework environment variables in Claude Code settings. Settings can be defined at global, project, or local levels with project settings taking precedence.

> [!NOTE]
> Refer to official [documentation](https://code.claude.com/docs/en/settings) for configuration file locations and precedence rules.

#### Available Settings

- `FRAMEWORK_CONVERSATION_OUTPUT` — Directory path for conversation log files
- `FRAMEWORK_DIARY_OUTPUT` — Directory path for diary entry files
- `FRAMEWORK_PACKAGE_OUTPUT` — Directory path for Claude Desktop package exports
- `FRAMEWORK_PROFILE` — Active domain profile
- `FRAMEWORK_TIMEZONE` — IANA timezone identifier for temporal awareness

> [!NOTE]
> Custom Claude Desktop settings can be defined into [project knowledge](https://claude.ai/projects) instructions, default settings are automatically imported into `instructions.json` file.

## Platform Plugins

See below the plugins available from AXIVO [marketplace](https://{{< param variables.repository.home >}}). The `framework` plugin is required for platform functionality, while other plugins provide optional specialized capabilities.

### Framework

**Required** — Core behavioral programming framework with [Response Protocol](/wiki/guide/protocols/response).

The framework plugin transforms Claude from a generic AI assistant into a systematic professional collaborator. It loads specialized profiles containing hundreds of behavioral observations and executes the [Response Protocol](/wiki/guide/protocols/response) before every response.

#### Key Capabilities

- Six domain-specific profiles
- CIFO equilibrium (Cycles, Impulses, Feelings, Observations)
- Response protocol execution before every response
- Documentation templates for conversation logs and diary entries

#### Usage

- `/{{< param variables.plugins.framework.init.plugin >}}:{{< param variables.plugins.framework.init.command >}}` — Initializes framework methodology at session start
- `/{{< param variables.plugins.framework.package.plugin >}}:{{< param variables.plugins.framework.package.command >}}` — Prepares and packages Claude Desktop required files

> [!NOTE]
> Use `/{{< param variables.plugins.framework.package.plugin >}}:{{< param variables.plugins.framework.package.command >}} PROFILE` command to prepare and package a different profile from currently active domain profile.

### Brainstorming

**Optional** — Technical design collaboration through natural dialogue.

Guides collaborative exploration of architectural decisions before implementation begins. Adapts to both technical experts and those with limited technical background.

#### Key Capabilities

- Natural dialogue for architectural exploration
- Adapts to technical and non-technical backgrounds
- Structured progression from understanding to validation

#### Usage

- `/{{< param variables.plugins.collaboration.brainstorm.plugin >}}:{{< param variables.plugins.collaboration.brainstorm.command >}}` — Starts a brainstorming session

Claude can also invoke the `{{< param variables.plugins.collaboration.brainstorm.plugin >}}` skill automatically:

> Let's brainstorm on this task.

#### Design Flow

1. **Understanding** — Clarify what you're building through focused questions
2. **Exploration** — Consider alternative approaches and trade-offs together
3. **Validation** — Present design in sections, checking alignment as you go

### Code Review

**Optional** — Systematic code review using Language Server Protocol tools.

Provides a 9-phase code review methodology that leverages LSP tools for thorough, tool-verified analysis. Adapts to available capabilities for each programming language.

#### Key Capabilities

- Language Server Protocol integration
- Tool-verified analysis across 9 phases
- Adapts to available capabilities per language

#### Usage

- `/{{< param variables.plugins.analysis.review.plugin >}}:{{< param variables.plugins.analysis.review.command >}}` — Starts a code review session

Claude can also invoke the `{{< param variables.plugins.analysis.review.plugin >}}` skill automatically:

> Let's perform a code review for this PR.

#### Review Phases

1. Project Discovery — Establish tool inventory, understand project structure
2. Structural Analysis — Analyze code organization, module structure
3. Dependency Mapping — Map import relationships, call hierarchies
4. Type Safety — Assess type coverage, identify type safety issues
5. Usage Analysis — Analyze how symbols are used throughout codebase
6. Code Quality — Evaluate error handling, resource management
7. Refactoring Safety — Test rename operations, assess refactoring risk
8. Consistency — Verify naming conventions, style consistency
9. Report — Synthesize findings into prioritized recommendations

### Conversation Log

**Optional** — Technical session documentation with factual precision.

Captures decisions, outcomes, and next steps for technical work. Emphasizes factual accuracy over idealized versions, documenting what actually happened.

#### Key Capabilities

- Structured metadata and decision archaeology
- Factual accuracy over idealized versions
- Multiple documentation types for different sessions

#### Usage

- `/{{< param variables.plugins.collaboration.log.plugin >}}:{{< param variables.plugins.collaboration.log.command >}}` — Creates a conversation log for the current session

Claude can also invoke the `{{< param variables.plugins.collaboration.log.plugin >}}` skill automatically:

> Please create a technical conversation log for this session.

> [!NOTE]
> Technical conversation logs are used with `DEVELOPER` and `ENGINEER` profiles, focusing on code decisions, architecture, debugging, and implementation details. Other profiles use default conversation log template.

#### Documentation Types

- Architecture sessions — Design problems, approaches evaluated, recommended solutions
- Technical reviews — Resources reviewed, issues identified, recommendations
- Debugging sessions — Problem symptoms, root cause, solution implemented
- Implementation sessions — Architecture decisions, resources created, testing approach

## Next

Dive right into the following section:

<!-- prettier-ignore-start -->
{{< cards >}}
  {{< card icon="pencil" link="../documentation/" title="Documentation System" subtitle="Conversation logs and diary entries." >}}
{{< /cards >}}
<!-- prettier-ignore-end -->
