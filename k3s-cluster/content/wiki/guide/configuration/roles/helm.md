---
title: Helm
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/k3s
weight: 2
---

[Helm](https://helm.sh/docs) is a package manager for Kubernetes. It has the ability to provide, share, and use software built for Kubernetes.

The `helm` role performs various tasks related to OS configuration, reset and validation. It installs the [Balto](https://helm.baltorepo.com/stable/debian/packages/helm) stable Debian based repository needed for `helm` package, as well the related [`diff`](https://github.com/databus23/helm-diff/releases) Helm plugin.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts


Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/tasks/main.yaml) for details.

### Plugins

Plugins related tasks, see [`plugins.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/tasks/plugins.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=helm upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=helm validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Service

Service template used to periodically clean the cache, see [`service.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/templates/service.j2) for details.

### Timer

Service timer template, see [`timer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/templates/timer.j2) for details.

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/helm/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/helm/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/helm) file, for additional details.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
