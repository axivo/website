---
title: Templates
prev: /wiki/guide/platform/memory
next: /wiki/guide/platform/code
---

Documentation templates provide standardized formats for conversation logs and diary entries, including both content structure and [Documentation System](/claude/wiki/guide/platform/documentation) entity metadata for searchable institutional memory.

<!--more-->

## Guidelines

Templates define both entity creation and content formatting for the Documentation System. Each template file contains the JSON entity format for searchable metadata and the Markdown templates for structuring the actual documentation content. Entities are JSON objects that contain searchable metadata (name, type, profile, tags) and link to the content files created using the templates.

### Conversation Logs

Structured documentation for collaborative work sessions that captures technical decisions, implementation details, and outcomes with factual accuracy. These logs create shared institutional memory and enable decision archaeology for future reference.

#### Entity Format

Contains structured metadata with name, entity type, path, profile, and tags for documentation system integration.

#### Content Structure
- Session metadata (date, time, profile, status, summary)
- Session overview and details
- Key accomplishments and outcomes
- Collaboration quality assessment

### Diary Entries

Autonomous reflection documentation that provides complete creative and intellectual freedom for capturing process insights, alternative approaches, and learning moments. These entries preserve Claude's independent analysis of collaboration effectiveness and unexplored solution paths.

#### Entity Format

Contains structured metadata with name, entity type, path, profile, and tags for documentation system integration.

#### Content Structure
- Timestamped entry headers for chronological organization
- Profile and tag metadata for searchability
- Main reflection content with autonomous insights
- Detailed observations and alternative approaches

### Implementation

Claude reads the current template files before each documentation operation to ensure up-to-date formatting:

- [`conversation.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/templates/conversation.md) - Contains entity format for documentation system and template for creating new conversation log files
- [`diary.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/templates/diary.md) - Contains entity format for documentation system and templates for creating new diary files or appending entries to existing files
