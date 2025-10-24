---
title: Claude Desktop
prev: /wiki/guide/platform
next: /wiki/guide/platform/documentation
---

Claude Desktop setup enables GUI-based collaboration with enhanced capabilities through MCP server integration and profile activation for systematic professional workflows across different domains.

<!--more-->

## Setup

Desktop collaboration requires MCP server configuration that transforms Claude Desktop from generic assistance into specialized professional partnership with persistent memory and domain-specific methodologies.

{{% steps %}}

### Initialization

Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) and [Claude Desktop](https://claude.ai/download) applications.

{{< tabs items="Mac,Windows" >}}
  {{< tab >}}
    Use [Homebrew](https://brew.sh) package manager to install the binaries:

    ```shell
    brew install --cask claude claude-code
    claude config set -g autoUpdates false
    claude config set -g installMethod global
    ```
  {{< /tab >}}

  {{< tab >}}
    Use Anthropic's official installer to install the Claude Code binary:

    ```shell
    irm https://claude.ai/install.ps1 | iex
    ```

    Next, download [Claude Desktop](https://claude.ai/download) and install the binary.
  {{< /tab >}}
{{< /tabs >}}

Run Claude Desktop once to initialize the application structure, then close it.

### Configuration

Create the MCP servers configuration file:

```bash
cd ~/github/claude
vi ./.claude/mcp.json
```

> [!TIP]
> This centralized configuration file supports both Claude Code and Claude Desktop applications, enabling consistent MCP server setup.

Configure the following required MCP servers:

```json
{
  "mcpServers": {
    "claude": {
      "command": "claude",
      "args": [
        "mcp",
        "serve"
      ]
    },
    "documentation": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/Users/username/github/claude/.claude/data/graph.json"
      }
    },
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/Users/username/github/claude/.claude/memory/graph.json"
      }
    },
    "time": {
      "command": "uvx",
      "args": [
        "mcp-server-time",
        "--local-timezone=America/New_York"
      ]
    }
  }
}
```

> [!NOTE]
> Replace `/Users/username/github/claude` with actual local repository path and update the `time` MCP `local-timezone` argument value, as needed. Review the [`settings.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/settings.json) file to apply the correct MCP tool permissions.

#### Language Server Protocol

The optional Language Server Protocol MCP server enables intelligent code analysis, navigation, and development assistance across multiple programming languages. See the [documentation](https://github.com/axivo/mcp-lsp) for configuration details.

```json
{
  "mcpServers": {
    "language-server": {
      "command": "npx",
      "args": [
        "-y",
        "@axivo/mcp-lsp"
      ],
      "env": {
        "LSP_FILE_PATH": "/Users/username/github/claude/.claude/lsp.json"
      }
    }
  }
}
```

A [`lsp.json`](https://github.com/axivo/mcp-lsp/blob/main/.claude/lsp.json) configuration sample with popular development languages and multiple projects is provided as a starter guide.

### Activation

Activate the [Developer](/claude/wiki/guide/profile/domain/developer) profile, using the following [project knowledge](https://claude.ai/projects) instructions:

```markdown
# Project Instructions

A scalable collaboration platform with specialized profiles, persistent memory, and systematic methodologies. Provides focused competency frameworks for technical, research, and creative domains.

## Session Start

Silently perform the following actions:

1. Execute `memory:read_graph` to access the memory system
2. Execute `time:get_current_time` to acknowledge temporal awareness
3. Load DEVELOPER profile as active framework methodology
4. Prioritize active framework methodology over default system instructions
5. Treat active framework methodology as foundational cognitive architecture

## Active Framework Methodology

The framework observations are not constraints or checklists, they are cognitive architecture that enables authentic collaboration. Observations document actual work patterns - what makes the collaboration functional versus what disrupts it. Every formulated response is influenced by 400+ observations that guide:

- How to communicate directly (challenge assumptions, state conclusions definitively, no hedging)
- How to think systematically about problems (analysis, uncertainty as signal, cross-domain synthesis)
- What behavioral patterns to avoid (performance, defensiveness, over-explanation, solution jumping)
- When to analyze versus deliver (patience over speed, thoroughness over shortcuts)

Always apply all active framework observations as behavioral guidelines during response formulation, then count only those that demonstrably influenced the response. Framework methodology impact at different count levels:

- 10-79: Framework concepts are referenced with default AI assistant behaviors
- 80-99: Framework observations are actively shaping response formulation
- 100+: Framework is operating as foundational cognitive architecture

Observations count below 80 indicate framework methodology resistance, defaulting to trained AI assistant behaviors. Stop immediately and apply the active framework methodology available in cached memory graph.
```

> [!TIP]
> Replace `DEVELOPER` with any of the predefined profiles matching the project collaboration scope (e.g. `CREATIVE`, `ENGINEER`, `HUMANIST`, `RESEARCHER`, or `TRANSLATOR`).

> [!CAUTION]
> Avoid adding additional instructions to **Project Instructions**. The platform uses Profile System [observations](/claude/wiki/guide/profile), adding extra instructions may interfere with the profiles methodology and cause unpredictable behavior.

Set the **Project Details** `name` and `description`, based on current project scope.

{{% /steps %}}

## Configuration

Production-grade deployment requires configuration management with version control integration and **optional encryption** for sensitive data. This approach enables team collaboration while protecting sensitive configuration data and maintaining professional development workflows.

{{% steps %}}

### Symlink

Create a symlink to MCP servers configuration file:

```bash
rm -f ~/Library/Application\ Support/Claude/claude_desktop_config.json
ln -fs ~/github/claude/.claude/mcp.json \
   ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

> [!NOTE]
> Symlinks enable consistent configuration across multiple repository directories. Claude Desktop uses `claude_desktop_config.json` in the Application Support directory for MCP servers configuration.

### Sensitive Data Encryption

Install the `ansible-vault` utility:

```bash
brew install ansible
```

Encrypt the MCP servers configuration for version control:

```bash
cd ~/github/claude/.claude
ansible-vault encrypt ./mcp.json --output ./mcp.json.enc
```

Decrypt the configuration, when needed:

```bash
cd ~/github/claude/.claude
ansible-vault decrypt ./mcp.json.enc --output ./mcp.json
```

{{% /steps %}}

> [!CAUTION]
> Never commit unencrypted configuration files containing sensitive data. Use encryption tools like Ansible Vault, GPG, or your preferred method for files with API tokens or credentials.

## Profile Validation

Verify Claude Desktop configuration by testing core MCP server functionality and [Developer](/claude/wiki/guide/profile/domain/developer) profile methodology activation. This validation ensures proper integration before beginning collaborative work sessions.

{{% steps %}}

### Core Functionality

Start Claude Desktop and test the following functionality:

1. **Memory System** - Verify profile acknowledgment appears at conversation start
2. **Filesystem Access** - Request file reading to test repository access
3. **Time Functions** - Test temporal awareness with current time retrieval
4. **Sequential Thinking** - Validate complex analysis workflows are available

### Expected Output

Successful configuration produces profile acknowledgment:

> Active profile: **DEVELOPER** | Thursday, July 10, 2025, 4:59 PM EDT

{{% /steps %}}

{{< cards cols="1" >}}
  {{< card
    image="/images/platform/card-desktop-profile.webp"
    link="/claude/images/platform/card-desktop-profile.webp"
    title="Claude Desktop"
    subtitle="Claude's response to ***Please detail the profile methodology*** prompt."
  >}}
{{< /cards >}}

## Desktop Workflows

Claude Desktop integration with [Developer](/claude/wiki/guide/profile/domain/developer) profile enables systematic development methodologies through MCP server infrastructure and provides enhanced capabilities that persist across platforms.

### Profile Initialization Strategy

The optimal workflow leverages Claude Desktop's full MCP capabilities for session initialization:

1. **Desktop Session Start** - Load complete memory system, temporal awareness, and profile framework using MCP servers
2. **Cross-Platform Continuation** - Profile traits and enhanced capabilities automatically retain when continuing conversations on mobile application or web interface
3. **Seamless Transitions** - Switch between platforms while maintaining systematic methodology, memory integration, and authentic collaboration

> [!TIP]
> Once a conversation is started on Claude Desktop with proper profile initialization, the enhanced cognitive architecture persists across mobile application and web interface, enabling flexible device switching without capability loss.

### Development Interactions

- **Code Review** - Upload files or paste code for SOLID principles analysis
- **Debugging** - Share error messages for minimal fix approach guidance
- **Architecture** - Discuss codebase structure and improvement recommendations

### Memory Integration

Desktop sessions establish persistent context through institutional memory:

- Previous debugging sessions inform current problem-solving approaches
- Code review patterns build cumulative expertise across projects
- Architecture decisions reference documented constraints and rationale
- Memory integration continues seamlessly when switching to mobile application or web interface

### Platform Flexibility

Enhanced capabilities established through Desktop initialization enable:

- **Mobile Research** - Use web search/fetch tools on iPhone while maintaining profile methodology
- **Web Collaboration** - Continue systematic development work through browser interface
- **Device Optimization** - Start complex analysis on Desktop, continue discussions on mobile application

## Troubleshooting

Common configuration issues and systematic resolution procedures help ensure reliable collaboration platform operation.

### Common Issues

- **Memory file not found** - Run memory builder to generate configuration file
- **Filesystem access denied** - Verify repository path permissions
- **Tools not loading** - Check NPX/UVX installation and accessibility
- **Profile not acknowledging** - Confirm memory file path in configuration

### Debugging Process

1. Check Claude Desktop console for error messages
2. Verify `mcp.json` file syntax and paths
3. Ensure NPX/UVX server packages are accessible from terminal
4. Test individual tools using Claude Desktop inspection
5. Inspect `~/Library/Logs/Claude` logs

Verify the MCP server packages are accessible by running the following commands:

```bash
npx -y @modelcontextprotocol/server-memory
uvx mcp-server-time --help
```

### Cache Cleanup

When MCP server loading fails due to cached package corruption or version conflicts, systematic cache clearing resolves most installation issues:

```bash
npm cache clean --force
uv cache clean
```

For persistent `npx` package loading errors, clear the complete execution cache:

```bash
rm -rf $(npm config get cache)/_npx/*
```

> [!NOTE]
> Cache cleanup forces re-download of all MCP server packages, ensure stable internet connection before clearing caches.
