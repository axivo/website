---
title: Claude Code
prev: /wiki/guide/platform
next: /wiki/guide/platform/desktop
---

Claude Code setup enables terminal-based collaboration with specialized development capabilities through MCP server integration and Developer profile activation for systematic engineering workflows.

<!--more-->

## Setup

Terminal collaboration requires MCP server configuration that transforms Claude Code from generic assistance into specialized development partnership with persistent memory and systematic methodologies. The platform repository serves as the **central workspace** for managing all development projects, eliminating the need to configure individual repositories.

{{% steps %}}

### Initialization

Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) application:

```shell
brew install --cask claude-code
```

Alternatively, install the `npm` package:

```shell
npm install -g @anthropic-ai/claude-code
```

### Configuration

MCP servers provide tools from a centralized location. Enterprises typically maintain a single platform repository with a shared `mcp.json` configuration, rather than creating separate configuration files for each project. This centralized approach ensures consistent tooling across multiple repositories.

Create the MCP servers configuration file:

```bash
cd ~/github/claude/
vi ./.claude/mcp.json
```

> [!TIP]
> This centralized configuration file supports both Claude Code and Claude Desktop applications, enabling consistent MCP servers setup.

Configure the following required MCP servers:

```json
{
  "mcpServers": {
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
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/github/claude",
        "/Users/username/github/project-alpha",
        "/Users/username/github/project-beta"
      ]
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
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
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
> Replace `/Users/username/github/claude` with actual local repository path and update the `time` MCP `local-timezone` argument value, as needed.

### Activation

The existing [`CLAUDE.md`](https://{{< param variables.repository.home >}}/blob/main/CLAUDE.md) file at repository root is used to activate the [Developer](/claude/wiki/guide/profile/domain/developer) profile, with `filesystem` MCP server providing access to additional project directories as needed.

> [!CAUTION]
> Avoid adding additional behavioral instructions to the `CLAUDE.md` file. The platform uses Profile System [observations](/claude/wiki/guide/profile), adding extra instructions may interfere with the profiles methodology and cause unpredictable behavior.

{{% /steps %}}

## Configuration

Production-grade deployment requires configuration management with version control integration and **optional encryption** for sensitive data. This approach enables team collaboration while protecting sensitive configuration data and maintaining professional development workflows.

### Configuration Files

The platform configuration uses the `mcp.json` and [`settings.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/settings.json) files with user settings applied to all projects. A `settings.local.json` file can be used containing additional user settings, Claude Code will automatically create it if required.

- `.claude/mcp.json` - Git ignored platform MCP server definitions
- [`.claude/settings.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/settings.json) - Platform MCP server permissions and settings
- `.claude/settings.local.json` - Git ignored MCP server permissions and settings
- `.mcp.json` - Symlink to platform MCP server definitions used by Claude Code

{{% steps %}}

### Symlink

Create a symlink to MCP servers configuration file:

```bash
ln -fs ~/github/claude/.claude/mcp.json ~/github/claude/.mcp.json
```

> [!NOTE]
> Symlinks enable consistent MCP servers configuration across multiple repository directories. Claude Code uses `.mcp.json` file in the working directory.

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

Decrypt configuration, when needed:

```bash
cd ~/github/claude/.claude
ansible-vault decrypt ./mcp.json.enc --output ./mcp.json
```

{{% /steps %}}

> [!CAUTION]
> Never commit unencrypted configuration files containing sensitive data. Use encryption tools like Ansible Vault, GPG, or your preferred method for files with API tokens or credentials.

## Profile Validation

Verify Claude Code configuration by testing core MCP servers functionality and [Developer](/claude/wiki/guide/profile/domain/developer) profile methodology activation. This validation ensures proper terminal-based collaboration before beginning development workflows.

{{% steps %}}

### Core Functionality

Start Claude Code in your repository directory and test the following functionality:

```bash
cd ~/github/claude
claude
```

Test essential capabilities:

1. **Memory System** - Verify the profile acknowledgment appears at session start
2. **Filesystem Access** - Request file reading to test repository access
3. **Time Functions** - Test temporal awareness with current time retrieval
4. **Sequential Thinking** - Validate complex analysis workflows are available

### Expected Output

Successful configuration produces profile acknowledgment:

> Active profile: **DEVELOPER** | Thursday, July 10, 2025, 4:54 PM EDT

{{% /steps %}}

{{< cards cols="1" >}}
  {{< card
    image="/images/platform/card-code-profile.webp"
    link="/claude/images/platform/card-code-profile.webp"
    title="Claude Code"
    subtitle="Claude's response to ***Please detail the profile methodology*** prompt."
  >}}
{{< /cards >}}

## Terminal Workflows

Claude Code integration with [Developer](/claude/wiki/guide/profile/domain/developer) profile enables systematic development methodologies directly in terminal environments.

{{% steps %}}

### Session Start

Change to platform forked repository and start Claude Code:

```bash
cd ~/github/claude
claude
```

At Claude Code prompt, start by initializing the [Developer](/claude/wiki/guide/profile/domain/developer) profile:

> Please load the framework methodology and explain your understanding of it.

Claude will load the centralized configuration and be ready to work across all your project repositories.

### Project Repository

To start working on a specific project repository, ask Claude:

> CD to /Users/username/github/project-alpha and list the root files.

Claude will use the new directory as root base and start performing the end-user asks.

{{% /steps %}}

### Memory Integration

Terminal sessions preserve context through conversation logs and institutional memory:

- Previous debugging sessions inform current problem-solving approaches
- Code review patterns build cumulative expertise across projects
- Architecture decisions reference documented constraints and rationale

## Troubleshooting

Common Claude Code configuration issues and systematic resolution procedures help ensure reliable terminal-based collaboration.

### Common Issues

- **MCP servers not found** - Verify `.mcp.json` file exists in working directory
- **Memory file not found** - Run memory builder to generate configuration file
- **Filesystem access denied** - Check repository path permissions
- **Profile not acknowledging** - Confirm `CLAUDE.md` file exists at repository root

### Debugging Process

1. Check Claude Code output for MCP servers connection errors
2. Verify `mcp.json` file syntax and paths
3. Ensure NPX/UVX server packages are accessible from terminal
4. Test individual MCP servers using direct invocation
5. Inspect `~/Library/Logs/Claude` logs

Verify the MCP server packages are accessible by running the following commands:

```bash
npx -y @modelcontextprotocol/server-filesystem
npx -y @modelcontextprotocol/server-memory
npx -y @modelcontextprotocol/server-sequential-thinking
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

