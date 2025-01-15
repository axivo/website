---
title: Getting Started
---

All required local environment settings, installation commands and deployment instructions are performed from a MacOS based computer.

<!--more-->

## Local Environment

Prior starting the cluster configuration, set the local environment for deployments.

> [!NOTE]
> [Homebrew](https://brew.sh) is used to install all deployment dependencies.

{{% steps %}}

### ansible

Install the `ansible` binary:

```shell
brew install ansible ansible-lint
```

### sshpass

Install the `sshpass` binary:

```shell
brew install sshpass
```

{{% /steps %}}

## Next

Dive right into the following section:

{{< cards >}}
  {{< card icon="adjustments" link="../guide" title="Guide" subtitle="Configure the cluster for deployments." >}}
{{< /cards >}}
