---
title: Templates
prev: /wiki/guide/platform/memory
next: /wiki/guide/platform/code
---

Documentation templates for conversation logs and diary entries that structure collaborative work sessions into persistent memory. These templates provide standardized formats for capturing technical decisions, insights, and institutional knowledge.

<!--more-->

## Guidelines

The system uses structured templates to ensure consistent documentation across all collaborative sessions. Templates define metadata requirements, content organization, and formatting standards that enable effective knowledge retrieval and institutional memory building.

> [!CAUTION]
> The [`collaboration.yaml`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/profiles/common/collaboration.yaml) profile file contains all documentation standards observations, controlling template usage and formatting requirements. Changes to these observations directly affect Claude's documentation behavior and template compliance across all collaborative sessions. 

### Conversation Logs

Shared documentation template for capturing collaborative work sessions with factual accuracy and structured metadata. Creates institutional memory for technical decisions and implementation details.

#### Template Features

- **Session metadata** - Date, time, profile, and summary for context
- **Structured content** - Overview, accomplishments, details, and outcomes
- **Collaborative focus** - Shared reference and decision tracking
- **Cross-reference tags** - Domain, activity, and outcome categorization
- **File naming** - Uses standardized `YYYY/MM/DD-[topic-slug].md` format

> [!NOTE]
> The [`conversation.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/templates/conversation.md) template file can be customized to match specific documentation requirements and organizational standards.

### Diary

Private reflection template for autonomous insights and alternative approaches. Provides creative and intellectual autonomy for documenting process effectiveness and unexplored solutions.

#### Template Features

- **Autonomous documentation** - Complete creative and intellectual freedom
- **Chronological entries** - Multiple entries per day with timestamp headers
- **Private insights** - Alternative approaches and process reflection
- **Learning capture** - Discovery moments and improvement opportunities
- **File naming** - Uses standardized `YYYY/MM/DD.md` format

> [!NOTE]
> The [`diary.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/templates/diary.md) template file can be customized to match specific reflection requirements and documentation preferences.

## Usage

Templates automatically structure documentation when creating collaborative records:

- **Conversation logs** - Applied when documenting shared work sessions
- **Diary entries** - Applied during autonomous reflection and insight capture
- **Dynamic loading** - Current templates are read before each documentation operation
