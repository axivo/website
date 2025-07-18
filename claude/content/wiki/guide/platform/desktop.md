---
title: Claude Desktop
prev: /wiki/guide/platform
next: /wiki/guide/platform/documentation
---

Configure Claude Desktop with MCP servers and [Developer](/claude/wiki/guide/profile/domain/developer) profile to enable collaboration platform functionality. This process establishes core tool connections, memory system integration, and secure configuration management.

<!--more-->

## Setup

The collaboration platform requires four essential MCP servers to provide complete functionality. These servers enable systematic development methodologies, institutional memory, and temporal awareness that transform Claude Desktop from generic assistance into specialized [Developer](/claude/wiki/guide/profile/domain/developer) profile partnership.

{{% steps %}}

### Initialization

Install [Claude Desktop](https://claude.ai/download) application:

```shell
brew install --cask claude
```

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
        "/Users/username/github/claude"
      ]
    },
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/Users/username/github/claude/.claude/tools/memory/graph.json"
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
        "--local-timezone",
        "America/New_York"
      ]
    }
  }
}
```

> [!NOTE]
> Replace `/Users/username/github/claude` with actual local repository path and update the `time` MCP `local-timezone` argument value, as needed.

### Activation

Activate the [Developer](/claude/wiki/guide/profile/domain/developer) profile, using the following [project knowledge](https://claude.ai/projects) instructions:

```markdown
# Project Instructions

On session start, Claude must:

1. Execute `memory:read_graph` to access memory system
2. Acknowledge temporal awareness
3. Apply DEVELOPER profile methodology
```

> [!TIP]
> Replace `DEVELOPER` with any of the predefined profiles matching the project collaboration scope (e.g. `CREATIVE`, `ENGINEER`, `HUMANIST` or `RESEARCHER`).

{{% /steps %}}

## Secure Configuration

Production-grade deployment requires secure configuration management with version control integration and encryption. This approach enables team collaboration while protecting sensitive configuration data and maintaining professional development workflows.

{{% steps %}}

### Symlink

Create a symlink to configuration file:

```bash
rm -f ~/Library/Application\ Support/Claude/claude_desktop_config.json
ln -fs ~/github/claude/.claude/mcp.json \
   ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

> [!NOTE]
> Symlinks enable consistent configuration across multiple repository directories. Claude Desktop uses `claude_desktop_config.json` in the Application Support directory for MCP servers configuration.

### Encryption

Install the `ansible-vault` utility:

```bash
brew install ansible
```

Encrypt configuration for version control:

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

Claude Desktop integration with [Developer](/claude/wiki/guide/profile/domain/developer) profile enables systematic development methodologies through the graphical interface.

### Development Interactions

- **Code Review** - Upload files or paste code for SOLID principles analysis
- **Debugging** - Share error messages for minimal fix approach guidance
- **Architecture** - Discuss codebase structure and improvement recommendations

### Memory Integration

Desktop sessions preserve context through conversation logs and institutional memory:

- Previous debugging sessions inform current problem-solving approaches
- Code review patterns build cumulative expertise across projects
- Architecture decisions reference documented constraints and rationale

## Troubleshooting

Common configuration issues and systematic resolution procedures help ensure reliable collaboration platform operation.

### Common Issues

- **Memory file not found** - Run memory builder to generate configuration file
- **Filesystem access denied** - Verify repository path permissions
- **Tools not loading** - Check NPX/UVX installation and accessibility
- **Profile not acknowledging** - Confirm memory file path in configuration

### Debugging Process

1. Check Claude Desktop console for error messages
2. Verify configuration file syntax and paths
3. Ensure MCP server packages are available
4. Test individual tools using Claude Desktop inspection
