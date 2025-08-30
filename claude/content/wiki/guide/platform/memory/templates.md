---
title: Templates
prev: /wiki/guide/platform/memory
next: /wiki/guide/platform/code
---

Documentation templates provide standardized formats for conversation logs, diary entries, and reasoning entities, supporting both content structure and system-specific metadata for comprehensive institutional memory and diagnostic transparency.

<!--more-->

## Guidelines

Templates define entity creation and content formatting for multiple systems. Each template file contains the JSON entity format for searchable metadata and either Markdown templates for documentation content or diagnostic entity structures for troubleshooting. Entities are JSON objects that contain structured metadata enabling system-specific functionality across documentation, reflection, and reasoning transparency.

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

### Reasoning Logic

Diagnostic entities for framework observation tracking that capture which behavioral guidelines influenced Claude's decision-making process. These entities enable systematic validation of collaborative frameworks and identification of optimization opportunities through reasoning transparency.

#### Entity Format

Contains structured metadata with input name, logic entity type, and framework observations that guided response reasoning for troubleshooting analysis.

### Implementation

Claude reads the current template files prior documentation operations or reasoning troubleshooting to ensure up-to-date formatting:

- [`conversation.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/memory/templates/conversation.md) - Contains entity format for [Documentation System](/claude/wiki/guide/platform/documentation) and template for creating new conversation log files
- [`diary.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/memory/templates/diary.md) - Contains entity format for [Documentation System](/claude/wiki/guide/platform/documentation) and templates for creating new diary files or appending entries to existing files
- [`logic.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/memory/templates/logic.md) - Contains entity format for [Reasoning System](/claude/tutorials/handbook/platform/reasoning) diagnostic tracking
