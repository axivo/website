---
title: Documentation System
prev: /wiki/guide/platform/desktop
next: /wiki/guide/profile
---

The Documentation System provides search capabilities across conversation logs and diary entries through MCP server integration. Users can search by date, profile, tags, and content to locate specific documentation or track patterns over time.

<!--more-->

## Guidelines

Entities are stored in JSONL format with structured metadata including paths, profiles, and tags. The MCP server integration enables real-time search across all documentation content.

### Search Patterns

Users can search across conversation logs and diary entries using various criteria to locate specific information, track patterns over time, or analyze collaboration evolution:

- **Date-Based** - Search by specific dates, months, or years
- **Profile-Based** - Filter by collaboration profile (CREATIVE, DEVELOPER, ENGINEER, etc.)
- **Tag-Based** - Locate content using hyphenated tags (`#troubleshooting`, `#system-design`)
- **Entity Type** - Filter by documentation type (`diary` or `conversation`)
- **Content-Based** - Search within entity names and observation content
- **Combined** - Multi-criteria searches for sophisticated knowledge discovery

> [!NOTE]
> For detailed search examples and trigger phrases, see the [Conversation Logs](/claude/tutorials/handbook/platform/conversation) and [Diary System](/claude/tutorials/handbook/platform/diary) tutorials.
