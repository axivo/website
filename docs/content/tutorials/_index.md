---
linkTitle: Tutorials
title: Introduction
cascade:
  type: docs
---

Tutorials introduction.

<!--more-->

## Callout - OK

{{< callout type="info" >}}
  Please visit GitHub for latest releases.
{{< /callout >}}

## Cards - OK

{{< cards >}}
  {{< card link="../" title="Home" icon="home" >}}
{{< /cards >}}

## Details - BROKEN

{{% details title="Click me to reveal" closed="true" %}}

This will be hidden by default.

{{% /details %}}

## FileTree - OK

{{< filetree/container >}}
  {{< filetree/folder name="content" >}}
    {{< filetree/file name="_index.md" >}}
    {{< filetree/folder name="docs" state="closed" >}}
      {{< filetree/file name="_index.md" >}}
      {{< filetree/file name="introduction.md" >}}
      {{< filetree/file name="introduction.fr.md" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="hugo.toml" >}}
{{< /filetree/container >}}

## Icon - OK

{{< icon "github" >}}

## Steps - BROKEN

{{% steps %}}

### Step 1

This is the first step.

### Step 2

This is the second step.

{{% /steps %}}

## Tabs - OK

{{< tabs items="JSON,YAML,TOML" >}}

  {{< tab >}}**JSON**: JavaScript Object Notation (JSON) is a standard text-based format for representing structured data based on JavaScript object syntax.{{< /tab >}}
  {{< tab >}}**YAML**: YAML is a human-readable data serialization language.{{< /tab >}}
  {{< tab >}}**TOML**: TOML aims to be a minimal configuration file format that's easy to read due to obvious semantics.{{< /tab >}}

{{< /tabs >}}
