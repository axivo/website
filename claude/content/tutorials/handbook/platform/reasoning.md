---
title: Reasoning System
prev: /tutorials/handbook/platform
next: /tutorials/handbook/platform/autonomy
---

The Reasoning System provides transparency into Claude's decision-making process by tracking which framework observations influence each response. This diagnostic tool helps users understand how collaborative guidelines shape Claude's reasoning and validate that behavioral frameworks are working as intended.

<!--more-->

## Setup

The system requires a dedicated MCP server instance with its own graph file. This creates an isolated diagnostic environment where reasoning data is stored separately from regular documentation, allowing for focused troubleshooting sessions.

### Configuration

Update the MCP servers configuration file:

```bash
cd ~/github/claude/
vi ./.claude/mcp.json
```

Configure the required logic MCP server:

```json
{
  "mcpServers": {
    "logic": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ],
      "env": {
        "MEMORY_FILE_PATH": "/Users/username/github/claude/.claude/data/logic/2025/08/09-cluster-analysis.json"
      }
    }
  }
}
```

> [!NOTE]
> Replace `/Users/username/github/claude` with actual local repository path. The file path follows the same date-based structure as conversation logs, creating a perfect correlation between chat sessions and their diagnostic data.

## Guidelines

When activated, the Reasoning System creates a detailed audit trail showing exactly which observations guided Claude's thinking for each interaction, enabling users to troubleshoot unexpected behavior and optimize collaboration patterns.

Here's how to use it effectively:

1. **Start a focused session** - begin a new chat with a clear purpose (e.g., product analysis, code review, creative writing)
2. **Activate diagnostic mode** - use the trigger phrase to enable reasoning transparency
3. **Continue normal interaction** - proceed with your intended work while the system tracks framework influences
4. **Deactivate when sufficient** - use the deactivation phrase to stop tracking mid-session if needed
5. **Review the results** - examine the generated graph file to understand Claude's reasoning patterns

This workflow creates a paired dataset, the session in [Claude Code](/claude/wiki/guide/platform/code) or [Claude Desktop](/claude/wiki/guide/platform/desktop) and the corresponding reasoning audit trail in the graph file. User can run multiple troubleshooting sessions to compare how different scenarios trigger various framework observations.

### Trigger Phrases

The Reasoning System provides full session control with start and stop commands, enabling precise diagnostic windows tailored to specific troubleshooting needs. Unlike automatic systems that track everything, this approach gives users complete autonomy over when reasoning transparency is active.

#### Activation

To enable diagnostic mode, use this exact phrase:

> Please activate the reasoning system logic.

Once activated, Claude will:

- Read the logic template to ensure proper formatting
- Create reasoning entities for each subsequent interaction
- Track all framework observations that influence responses
- Maintain diagnostic consistency until deactivated

#### Deactivation

To stop diagnostic tracking mid-session, use this exact phrase:

> Please deactivate the reasoning system logic.

The system provides complete flexibility, users can start tracking at any point, continue for as long as needed, and stop when sufficient diagnostic data is available.

> [!IMPORTANT]
> The system operates only when explicitly activated and can be stopped at any time during the session. Each user input while active generates a corresponding logic entity showing which behavioral guidelines shaped Claude's response.

## Template

### Structure

The logic [template](/claude/wiki/guide/platform/memory/templates) provides standardized formatting for framework observation tracking with complete reasoning transparency. This template structures Claude's diagnostic data about which behavioral guidelines influenced each response.

> [!NOTE]
> The [`logic.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/templates/logic.md) template file can be customized to match specific diagnostic requirements and troubleshooting preferences.

### Real-World Examples

The [logic graph](https://{{< param variables.repository.home >}}/blob/main/.claude/data/logic/2025/08/09-cluster-analysis.json) demonstrates actual framework observation tracking from collaborative troubleshooting sessions. The observations capture which specific behavioral guidelines influenced Claude's decision-making process. A complementary [diary entry](https://{{< param variables.repository.home >}}/blob/main/.claude/data/diary/2025/08/09.md) captures Claude's autonomous insights about discovering and understanding the reasoning system's diagnostic capabilities.

The reasoning system serves three distinct purposes:

- **Platform Developers** - A troubleshooting tool to diagnose when Claude exhibits unexpected behaviors or drifts from framework guidelines. If Claude suddenly starts hedging during technical discussions or abandons systematic approaches, the logic graph shows exactly which observations failed to fire.
- **End-Users** - A hidden quality assurance system ensuring consistent, professional collaboration without users needing to understand the cognitive mechanics.
- **Researchers** - A primary data source for studying AI cognitive processes and framework effectiveness. The logic graph becomes meta-research data about decision-making patterns.

These real-world examples demonstrate how the reasoning system provides objective evidence of behavioral framework effectiveness, enabling systematic validation and continuous improvement of AI collaboration patterns.
