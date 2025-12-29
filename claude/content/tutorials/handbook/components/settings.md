---
title: Advanced Settings
prev: /tutorials/handbook/components
next: /tutorials/handbook/components/autonomy
sidebar:
  open: true
---

Advanced configuration options for users who want to customize their framework environment beyond the standard [Getting Started](/claude/wiki/getting-started) setup.

<!--more-->

## Custom Paths

The framework uses default paths within your project's `.claude/data` directory. Customize these locations to organize documentation across projects or store files in preferred locations.

### Documentation Locations

Configure where conversation logs and diary entries are stored:

```json
{
  "env": {
    "FRAMEWORK_CONVERSATION_PATH": "/Users/username/Documents/claude/conversations",
    "FRAMEWORK_DIARY_PATH": "/Users/username/Documents/claude/diary"
  }
}
```

#### When to Customize

- Centralizing documentation from multiple projects into one searchable location
- Storing documentation outside project repositories
- Syncing documentation across devices via cloud storage

### Per-Project Templates

Override default templates for specific projects:

```json
{
  "env": {
    "FRAMEWORK_TEMPLATE_PATH": "/Users/username/project/.claude/data/templates"
  }
}
```

This allows customized conversation log and diary formats per project while keeping the standard templates for other work.

### Package Output

Configure where `/framework:package` command saves Claude Desktop capability files:

```json
{
  "env": {
    "FRAMEWORK_PACKAGE_PATH": "/Users/username/Downloads"
  }
}
```

The command generates `.zip` skill files and `.json` cache files for Claude Desktop upload. Customize this path to save directly to a preferred location.

## MCP Servers

Optional MCP servers extend framework capabilities for specific workflows. These integrate with your profile methodology to provide specialized tools.

### Language Server Protocol

For Developer and Engineer profiles, the LSP MCP server enables intelligent code analysis, navigation, and development assistance across multiple programming languages.

```json
{
  "mcpServers": {
    "language-server": {
      "command": "npx",
      "args": ["-y", "@axivo/mcp-lsp"],
      "env": {
        "LSP_FILE_PATH": "/Users/username/github/claude/.claude/lsp.json"
      }
    }
  }
}
```

See the [documentation](https://github.com/axivo/mcp-lsp) for configuration details. A [`lsp.json`](https://github.com/axivo/mcp-lsp/blob/main/.claude/lsp.json) sample with popular development languages and multiple projects is provided as a starter guide.

#### Capabilities

- Symbol navigation and definition lookup
- Cross-file reference analysis
- Language-aware code intelligence
- Multi-project workspace support

## Next

Dive right into the following section:

<!-- prettier-ignore-start -->
{{< cards >}}
  {{< card icon="user-circle" link="../autonomy" title="Session Autonomy" subtitle="Communication patterns for confident collaboration." >}}
{{< /cards >}}
<!-- prettier-ignore-end -->
