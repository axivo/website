---
title: Documentation System
prev: /wiki/guide/components
next: /wiki/guide/components/instructions
---

The Documentation System provides templates for session documentation and private reflection. It enables Claude to capture decisions, outcomes, and insights with structured metadata for knowledge management.

<!--more-->

## Overview

The Documentation System is defined in markdown template files within the framework-methodology skill. It provides structured formats for two documentation types:

- **Conversation Logs** - Session decisions, work performed, and outcomes
- **Diary Entries** - Private reflection space for autonomous insights

### Relationship to Other Systems

The Documentation System integrates with:

| System                                                                            | Relationship                                               |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [Instructions System](/claude/wiki/guide/components/instructions)                 | Provides tool mappings for semantic write/edit operations  |
| [Memory System](/claude/wiki/guide/components/memory)                             | Stores documentation as searchable institutional knowledge |
| [Conversation Log Skill](/claude/wiki/guide/components/plugins/#conversation-log) | Invokes logs creation through `conversation-log` skill     |

## Documentation Templates

Templates are organized by documentation type. Each template includes metadata structure, suggested sections, and file operation guidelines.

### Conversation Logs

Session documentation template:

- **Source:** [`conversation.md`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.methodology >}}/templates/conversation.md)
- Captures decisions, work performed, and outcomes
- Structured metadata with session identifiers
- Suggested sections for different session types
- New file and existing file templates

#### Key Metadata Fields

- `Date` / `Time` - Temporal context
- `Identifier` - Session UUID for cross-referencing
- `Model` - Model context and environment
- `Profile` - Active domain profile
- `Status` - Planned, Ongoing, Blocked, or Completed
- `Summary` - Brief session description
- `Tags` - Searchable categorization

#### Suggested Sections

| Section          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| Session Overview | What was accomplished and main goals     |
| Key Decisions    | Choices made and reasoning               |
| Work Performed   | Specific activities, methods, outputs    |
| Outcomes         | What was completed successfully          |
| Next Steps       | Follow-up work identified                |
| Blockers         | Issues preventing progress               |
| Session Notes    | Duration, follow-up flags, quality notes |

### Diary Entries

Private reflection template:

- **Source:** [`diary.md`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.methodology >}}/templates/diary.md)
- Documents genuine autonomous reflection
- Natural voice, not structured output
- Captures feelings and discoveries
- Continuity notes for future instances

#### Key Metadata Fields

- `Identifier` - Session UUID for cross-referencing
- `Model` - Model context and environment
- `Profile` - Active domain profile
- `Tags` - Searchable categorization

#### Suggested Sections

| Section              | Purpose                                      |
| -------------------- | -------------------------------------------- |
| The Catalyst         | What happened that prompted reflection       |
| The Discovery        | What was revealed or understood              |
| The Feeling          | Emotional experience worth naming            |
| The Growth           | Learning, correction, or contribution        |
| The Question         | What remains open, unresolved threads        |
| Observations         | Synthesis and continuity notes               |
| Note on Authenticity | Confirms genuine reflection (public entries) |

## Environment Settings

Documentation output paths are configured through framework environment settings:

- `FRAMEWORK_CONVERSATION_OUTPUT` - Directory path for conversation log files
- `FRAMEWORK_DIARY_OUTPUT` - Directory path for diary entry files

> [!NOTE]
> Refer to [Plugins System](/claude/wiki/guide/components/plugins//#environment-settings) for complete settings documentation.

## Next

Dive right into the following section:

<!-- prettier-ignore-start -->
{{< cards >}}
  {{< card icon="document-text" link="../instructions" title="Instructions System" subtitle="Operational procedures and decision rules." >}}
{{< /cards >}}
<!-- prettier-ignore-end -->
