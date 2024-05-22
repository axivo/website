---
title: Getting Started
---

All required local environment settings, installation commands and deployment instructions are performed from a MacOS based computer.

<!--more-->

## Local Environment

Prior starting the cluster configuration, set the local environment for deployments.

{{< callout type="info" >}}
  [Homebrew](https://brew.sh) is used to install all deployment dependencies.
{{< /callout >}}

{{% steps %}}

### ansible

Install the `ansible` binary:

```shell
brew install ansible ansible-lint
```

### sshpass

Install the `sshpass` binary:

```shell
brew tap esolitos/ipa
brew install sshpass
```

### kubernetes.core

Upgrade the [`kubernetes.core`](https://github.com/ansible-collections/kubernetes.core/blob/main/docs/kubernetes.core.helm_module.rst) [collection](https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html):

```shell
ansible-galaxy collection install -U kubernetes.core
```

{{% /steps %}}

## Next

Dive right into the following section:

{{< cards >}}
  {{< card icon="adjustments" link="../guide" title="Guide" subtitle="Configure the cluster for deployments." >}}
{{< /cards >}}
