---
title: Builder
prev: /wiki/guide/platform/memory
next: /wiki/guide/platform/memory/templates
---

Build the Memory System from YAML profile configurations to enable persistent collaboration and temporal awareness. This process transforms profile definitions into memory format for institutional knowledge preservation.

<!--more-->

## Workflow Build

Automated GitHub workflow processes profile configurations into Memory System format through continuous integration. The workflow validates profile syntax, builds memory entities and ensures configuration consistency across repository updates.

When profile changes are detected, the workflow automatically updates the Memory System [`graph.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/graph.json) configuration file through GitHub's automatic commit signing, ensuring verified commits in pull requests:

{{< cards cols="1" >}}
  {{< card
    image="/images/memory/card-workflow.webp"
    link="/claude/images/memory/card-workflow.webp"
    title="Workflow Build"
    subtitle="Automated CI/CD pipeline for profile validation and Memory System configuration file generation."
  >}}
{{< /cards >}}

### Benefits

The automated workflow provides enterprise-grade advantages:

- **Quality assurance** through automated validation and consistent builds
- **CI/CD integration** with audit trails and pull request workflows
- **Team collaboration** via centralized configuration management
- **Zero-touch operations** with automatic rebuilds and rollback capabilities

## Local Build

The builder processes YAML profile configurations through dependency installation, profile building and output validation. These steps transform profile definitions into systematic methodologies available for platform integration.

{{% steps %}}

### Dependencies

Install the required Node.js packages for Memory System:

```bash
cd ./.claude/tools/memory
npm install js-yaml
npm init -y
```

### Build

Generate the Memory System [`graph.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/graph.json) configuration file from existing profiles:

```bash
node ./lib/core/PackageBuilder.js
npm run build --silent
```

### Validation

Validate the configuration file was generated:

```bash
ls -lah ./graph.json
```

The configuration file will contain the processed profile entities and relations for Memory System.

{{% /steps %}}

> [!NOTE]
> The builder processes YAML profile configurations into JSONL format that Memory System can load. This enables profile methodology persistence and temporal awareness across collaboration sessions.

### Configuration Update

Regenerate the Memory System configuration file, after modifying [profile](/claude/wiki/guide/profile) YAML files:

```bash
cd ./.claude/tools/memory
npm run build --silent
```
