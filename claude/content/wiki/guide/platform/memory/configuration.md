---
title: Configuration
prev: /wiki/guide/platform/memory
next: /wiki/guide/platform/memory/builder
weight: 1
---

Technical reference for the Memory Builder configuration system that processes YAML profiles into JSONL entities for Anthropic's [`memory`](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) MCP server. Configure build behavior, validation rules, and output generation.

<!--more-->

## Settings

The [`builder.yaml`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/config/builder.yaml) file contains the settings required to [build](/claude/wiki/guide/platform/memory/builder) the Memory System configuration file used by Anthropic's `memory` MCP server.

### Build

Controls profile processing order, file inclusion, error handling behavior, and output generation.

```yaml
build:
  process:
    additionalProfiles: false
    commonProfilesFirst: true
    stopOnCriticalError: true
  outputPath: ./graph.json
  profiles:
    - creative.yaml
    - developer.yaml
    - engineer.yaml
    - humanist.yaml
    - researcher.yaml
  profilesPath:
    common: ./profiles/common
    domain: ./profiles
  relations:
    - extends
    - inherits
    - overrides
```

#### Options

- **`process.additionalProfiles`** - When `true`, processes additional profile files beyond the main profile list
- **`process.commonProfilesFirst`** - When `true`, processes common infrastructure files before individual profiles
- **`process.stopOnCriticalError`** - When `true`, halts build on any file processing error
- **`outputPath`** - Relative path to generated memory system graph file, resolved from tool directory
- **`profiles`** - Explicit list of [profile](/claude/wiki/guide/profile) files to process, see related [tutorial](/claude/tutorials/handbook/profile/design)
- **`profilesPath.common`** - Relative path to shared infrastructure profiles directory
- **`profilesPath.domain`** - Relative path to individual profile files directory
- **`relations`** - Array of valid relation types for validation

#### File Processing Order

1. Common infrastructure files (if `process.commonProfilesFirst: true`)
2. Explicit profile files in `profiles` list order
3. Additional discovered profile files (if `process.additionalProfiles: true`)

#### Error Handling Strategy

The `stopOnCriticalError` setting determines build behavior:

- `true`: Stop immediately on file processing errors
- `false`: Continue processing remaining files, skip failed ones

### Logging

Controls console output verbosity and progress reporting.

```yaml
logging:
  showFileDetails: true
  showProgress: true
```

#### Options

- **`showFileDetails`** - Shows individual file processing status
- **`showProgress`** - Displays build progress messages

### Path

Defines directory locations for external dependencies and tool integration using absolute paths required for Anthropic's [`filesystem`](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) MCP server.

```yaml
path:
  conversations: /Users/username/github/claude/.claude/data/conversations
  diary: /Users/username/github/claude/.claude/data/diary
  tool: /Users/username/github/claude/.claude/tools/memory
```

> [!NOTE]
> Replace `/Users/username/github/claude` with your actual local repository path.

#### Options

- **`conversations`** - Absolute path to conversation logs storage directory
- **`diary`** - Absolute path to diary entries storage directory
- **`tool`** - Absolute path to builder tool directory containing [templates](/claude/wiki/guide/platform/memory/templates) and configuration

> [!NOTE]
> The `conversations` and `diary` directory paths support flexible location configuration including network shares, NAS servers accessed through SMB/NFS mounts, or cloud storage mount points.

Profile YAML files can reference these paths using `{path.conversations}`, `{path.diary}` and `{path.tool}` placeholders.
