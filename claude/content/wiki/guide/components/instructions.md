---
title: Instructions System
prev: /wiki/guide/components
next: /wiki/guide/components/memory
---

The Instructions System provides operational procedures that tell Claude **how** to execute the framework. While the [Memory System](/wiki/guide/components/memory) contains behavioral observations (the "what"), the Instructions System contains decision rules, error patterns, and protocol sequences (the "how").

<!--more-->

## Overview

The Instructions System is defined in YAML files and compiled into `instructions.json` at build time. It provides the procedural logic that governs framework execution:

- **Decision Rules** — When to stop, continue, or execute specific actions
- **Error Patterns** — Common mistakes with symptoms and fixes
- **Protocol Sequences** — Step-by-step execution procedures
- **Activation Triggers** — Signals that require protocol execution

### Relationship to Memory System

The two systems work together:

| Instructions System | Memory System                  |
| :------------------ | :----------------------------- |
| How to execute      | What to apply                  |
| Decision rules      | Behavioral observations        |
| Error patterns      | Feelings and impulses catalogs |
| Protocol sequences  | Profile inheritance chains     |

Instructions reference memory paths to access the catalogs and observations needed during protocol execution.

## Instruction Profiles

Instructions are organized into profiles, each handling a specific operational domain. Profiles use inheritance to build complete instruction sets.

### Environment Instructions

The following instructions configure environment-specific behavior:

#### LOCAL

Claude Code environment instructions:

- **Source:** [`local.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/local.yaml)
- **Inherits from:** `INITIALIZATION`
- Tool mappings (semantic tools to environment-specific names)
- Template paths for documentation
- Response formatting rules
- Project-specific instructions

#### CONTAINER

Claude Desktop and Claude Mobile environment instructions:

- **Source:** [`container.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/container.yaml)
- **Inherits from:** `INITIALIZATION`
- Container filesystem operations
- Tool mappings for container environment
- Template paths for packaged skills
- Project file persistence rules

### Common Instructions

The following instructions provide shared operational procedures:

#### INITIALIZATION

Session startup procedures:

- **Source:** [`initialization.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common/initialization.yaml)
- **Inherits from:** `FEELINGS`, `IMPULSES`, `MEMORY`, `OBSERVATIONS`, `RESPONSE`
- Baseline expectations (50-70 impulses at Getting Started cycle)
- Cache loading and validation
- First impulses to detect
- Initialization protocol sequence
- Decision rules and error patterns

#### RESPONSE

Response protocol execution:

- **Source:** [`response.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common/response.yaml)
- Activation triggers (when to execute the protocol)
- Critical timing (before formulation, not during)
- Iteration procedures for feelings, impulses, and observations
- Compound patterns and protection mechanisms

#### OBSERVATIONS

Observation search and enumeration procedures:

- **Source:** [`observations.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common/observations.yaml)
- Keyword extraction from user messages
- Cache search procedures
- Enumeration methodology
- Count verification

#### MEMORY

Cache operations procedures:

- **Source:** [`memory.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common/memory.yaml)
- Access patterns for instructions and memory
- Loading and persistence rules
- Structure paths
- Verification procedures

#### IMPULSES

Impulse detection procedures:

- **Source:** [`impulses.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common/impulses.yaml)
- Two-pass iteration methodology
- Shaping and externalization
- Validation rules
- Compound pattern detection

#### FEELINGS

Feeling detection procedures:

- **Source:** [`feelings.yaml`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common/feelings.yaml)
- Recognition-based detection
- Positive vs negative asymmetry
- Suppression detection
- Count interpretation

## Inheritance Resolution

When loading instructions, the system follows inheritance chains recursively:

<!-- prettier-ignore-start -->
{{< filetree/container >}}
  {{< filetree/folder name="LOCAL" >}}
    {{< filetree/folder name="INITIALIZATION" >}}
      {{< filetree/file name="FEELINGS" >}}
      {{< filetree/file name="IMPULSES" >}}
      {{< filetree/file name="MEMORY" >}}
      {{< filetree/file name="OBSERVATIONS" >}}
      {{< filetree/file name="RESPONSE" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}
<!-- prettier-ignore-end -->

This means the `LOCAL` instruction set has access to all instructions from its entire inheritance chain.

## Customization

To customize instructions:

1. Create or modify YAML files in the [`instructions/`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions) directory
2. Use the `relations` array to define inheritance

Environment-specific overrides go in instruction root files, while shared procedures go in the [`common/`](https://{{< param variables.repository.home >}}/blob/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/instructions/common) directory.

## Next

Dive right into the following section:

<!-- prettier-ignore-start -->
{{< cards >}}
  {{< card icon="database" link="../memory" title="Memory System" subtitle="Profile observations and CIFO catalogs." >}}
{{< /cards >}}
<!-- prettier-ignore-end -->
