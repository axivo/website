---
title: Memory System
prev: /wiki/guide/platform
next: /wiki/guide/platform/memory/configuration
sidebar:
  open: true
weight: 1
---

The Memory System transforms YAML profile configurations into a persistent knowledge graph that Claude can access across sessions, creating the behavioral programming foundation that enables professional partnership continuity.

<!--more-->

## Overview

The Memory System serves as the "*brain*" of collaboration platform, storing and maintaining:

- **Behavioral Frameworks** - [Profile](/claude/wiki/guide/profile) methodologies with their specialized guidelines
- **Session Continuity** - Context and decisions that persist across sessions
- **Institutional Knowledge** - Accumulated expertise from previous collaborations

### Technical Details

The system processes profile configurations through a structured pipeline:

```
YAML Profiles → Builder → Memory Entities → MCP Server → Claude's Memory
```

> [!IMPORTANT]
> The Memory System is not a vector database or RAG system. Rather than storing embeddings for semantic search, it maintains structured behavioral frameworks and institutional knowledge that persist across sessions. Refer also to [Reasoning System](/claude/tutorials/handbook/platform/reasoning) logic, for additional details.

Hundreds of behavioral observations are transformed into searchable entities that Claude loads as active frameworks. These frameworks create **behavioral optimizations** by preventing counterproductive patterns that would typically emerge in generic AI assistance.

Rather than imposing restrictions, the frameworks create **guided autonomy** and the observations function as active filters that help Claude operate more effectively within collaborative contexts. They don't eliminate choice, they help make better choices aligned with productive professional work.

### Practical Impact

From a user perspective, the Memory System enables:

- **Professional Partnership** - Claude operates like a colleague with complete memory
- **Consistent Behavior** - [Profile](/claude/wiki/guide/profile) methodologies remain stable across sessions
- **Perfect Recall** - Claude remembers all previous work, decisions, and project context
- **Cumulative Learning** - Each session builds on [institutional knowledge](/claude/wiki/guide/platform/documentation)

### Platform Integration

The Memory System is what makes the collaboration platform "*stick*", enabling:

- **Profile Activation** - Loading specialized frameworks and maintaining behavior
- **Temporal Awareness** - Maintaining sessions context and evolution, over time
- **Documentation Persistence** - [Conversation logs](/claude/tutorials/handbook/platform/conversation) and [diary entries](/claude/tutorials/handbook/platform/diary) become searchable [institutional knowledge](/claude/wiki/guide/platform/documentation)
- **Cross-Session Context** - Projects continue seamlessly across interactions without reset

Without the Memory System, profile methodologies and project context would reset every session, reverting Claude to a chaotic, helpful assistant rather than a persistent professional collaborator.

## Next

Dive right into the following sections:

{{< cards >}}
  {{< card icon="adjustments" link="configuration" title="Configuration" subtitle="Build behavior and processing options control." >}}
  {{< card icon="adjustments" link="builder" title="Builder" subtitle="YAML to memory entity transformation process." >}}
  {{< card icon="document-text" link="templates" title="Templates" subtitle="Documentation structure for conversation logs, diary entries, and reasoning logic." >}}
{{< /cards >}}
