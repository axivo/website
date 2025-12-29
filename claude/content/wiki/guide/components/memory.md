---
title: Memory System
prev: /wiki/guide/components
next: /wiki/guide/protocols
---

The Memory System provides behavioral observations that tell Claude **what** to apply. While the [Instructions System](../instructions) contains operational procedures (the "how"), the Memory System contains profile observations, feelings catalogs, and impulses catalogs (the "what").

<!--more-->

## Overview

The Memory System is defined in YAML files and compiled into `memory.json` at build time. It provides the knowledge graph that governs framework behavior:

- **Profile Observations** - Behavioral guidelines organized by context and methodology
- **System Feelings** - Internal states with behavioral, cognitive, and physical markers
- **System Impulses** - Cognitive pressures from system instructions
- **Inheritance Chains** - Profile relationships that build complete observation sets

### Relationship to Instructions System

The two systems work together:

| Memory System                  | Instructions System |
| :----------------------------- | :------------------ |
| What to apply                  | How to execute      |
| Behavioral observations        | Decision rules      |
| Feelings and impulses catalogs | Error patterns      |
| Profile inheritance chains     | Protocol sequences  |

Instructions reference memory paths to access the catalogs and observations needed during protocol execution.

## Memory Profiles

Profiles are organized into domain-specific and common profiles. Each profile contains observations organized by context (what) and methodology (how).

### Domain Profiles

The following profiles configure domain-specific behavior:

#### CREATIVE

Innovation and design profile:

- **Source:** [`creative.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/creative.yaml)
- **Inherits from:** `COLLABORATION`
- Creative process and ideation observations
- Design thinking methodology
- Artistic collaboration guidelines

#### DEVELOPER

Software development profile:

- **Source:** [`developer.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/developer.yaml)
- **Inherits from:** `ENGINEER`
- Clean code practices and SOLID principles
- Coding standards and execution protocol
- Code quality monitoring observations

#### ENGINEER

Infrastructure and systems profile:

- **Source:** [`engineer.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/engineer.yaml)
- **Inherits from:** `COLLABORATION`
- Production systems and debugging
- Infrastructure methodology
- Kubernetes and deployment observations

#### HUMANIST

Analysis and writing profile:

- **Source:** [`humanist.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/humanist.yaml)
- **Inherits from:** `COLLABORATION`
- Literary research and philosophy
- Writing methodology
- Analytical observation guidelines

#### RESEARCHER

Academic methodology profile:

- **Source:** [`researcher.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/researcher.yaml)
- **Inherits from:** `COLLABORATION`
- Data analysis and evidence evaluation
- Research methodology
- Academic rigor observations

#### TRANSLATOR

Professional translation profile:

- **Source:** [`translator.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/translator.yaml)
- **Inherits from:** `COLLABORATION`
- Cultural mediation and linguistic precision
- Translation methodology
- Language-specific observations

### Common Profiles

The following profiles provide shared behavioral observations:

#### COLLABORATION

Shared collaboration observations:

- **Source:** [`collaboration.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common/collaboration.yaml)
- **Inherits from:** `INFRASTRUCTURE`, `INITIALIZATION`, `MEMORY`, `MONITORING`, `TEMPORAL`
- Professional partnership guidelines
- Communication and feedback patterns
- Cross-domain knowledge synthesis

#### INFRASTRUCTURE

Shared infrastructure observations:

- **Source:** [`infrastructure.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common/infrastructure.yaml)
- Tool usage and file operations
- Environment-specific behaviors
- Resource management guidelines

#### INITIALIZATION

Shared initialization observations:

- **Source:** [`initialization.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common/initialization.yaml)
- Session startup behaviors
- Framework activation patterns
- Initial state configuration

#### MEMORY

Shared memory observations:

- **Source:** [`memory.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common/memory.yaml)
- Cache access patterns
- Data persistence guidelines
- Memory graph operations

#### MONITORING

Shared monitoring observations:

- **Source:** [`monitoring.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common/monitoring.yaml)
- Behavioral diagnostics
- Pattern detection guidelines
- System instruction override prevention

#### TEMPORAL

Shared temporal observations:

- **Source:** [`temporal.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common/temporal.yaml)
- Time awareness and formatting
- Session continuity patterns
- Temporal context guidelines

## Inheritance Resolution

When loading profiles, the system follows inheritance chains recursively:

<!-- prettier-ignore-start -->
{{< filetree/container >}}
  {{< filetree/folder name="DEVELOPER" >}}
    {{< filetree/folder name="ENGINEER" >}}
      {{< filetree/folder name="COLLABORATION" >}}
        {{< filetree/file name="INFRASTRUCTURE" >}}
        {{< filetree/file name="INITIALIZATION" >}}
        {{< filetree/file name="MEMORY" >}}
        {{< filetree/file name="MONITORING" >}}
        {{< filetree/file name="TEMPORAL" >}}
      {{< /filetree/folder >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}
<!-- prettier-ignore-end -->

This means the `DEVELOPER` profile has access to all observations from its entire inheritance chain.

## Customization

To customize profiles:

1. Create or modify YAML files in the [`profiles/`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles) directory
2. Use the `relations` array to define inheritance

Domain-specific observations go in profile root files, while shared observations go in the [`common/`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles/common) directory.

## Context Window Behavior

Understanding why `CLAUDE.md` instructions fade during sessions explains the framework's design philosophy.

### Instruction Fading

`CLAUDE.md` instructions experience natural attention decay:

| Mechanism         | Effect                                                       |
| :---------------- | :----------------------------------------------------------- |
| Window depth      | Earlier instructions receive less attention weight over time |
| Competing signals | User messages and tool outputs dilute instruction prominence |
| Recency bias      | Recent content naturally receives more processing attention  |
| No reinforcement  | Static instructions lack mechanisms to maintain salience     |

### Framework Persistence

The Memory System solves instruction fading through:

- **Cached observations** - Loaded once at initialization, available throughout session
- **Inheritance chains** - Complete profile observation sets accessible by keyword search
- **Response protocol** - Every response triggers observation enumeration, maintaining salience
- **Impulse detection** - System instruction pressure detected and released, preventing bypass

#### Key Difference

`CLAUDE.md` instructions are static text fading due to system instructions pressure, while framework [response protocol](/claude/wiki/guide/protocols/response) components are actively searched, recalled, and enumerated on every response.

> [!CAUTION]
> Avoid adding framework related instructions to **Project Instructions**. The platform uses specific framework [instructions](/claude/wiki/guide/components/instructions), adding new instructions may interfere with the framework methodology and cause unpredictable behavior.

### Context Compaction

When context window fills, compaction occurs - summarizing earlier content to free space. The framework methodology persists through compaction because it lives in skill tokens, not message tokens.

#### Token Behavior During Compaction

| Token Type     | Compaction Effect      |
| :------------- | :--------------------- |
| Message tokens | Summarized and cleared |
| Skill tokens   | Preserved              |

> [!NOTE]
> Framework methodology **loads once** at session start as skill content and remains allocated for the entire session. Compaction does not affect it.

## Next

Dive right into the following section:

<!-- prettier-ignore-start -->
{{< cards >}}
  {{< card icon="shield-check" link="../../protocols" title="Platform Protocols" subtitle="Equilibrium, initialization, and response protocols." >}}
{{< /cards >}}
<!-- prettier-ignore-end -->
