---
title: CoreDNS
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/externaldns
---

[CoreDNS](https://coredns.io/manual/toc) is a fast DNS server used in a multitude of environments because of its flexibility. If some functionality is not provided out of the box, it can be added with [plugins](https://coredns.io/explugins).

The `coredns` role performs various tasks related to Helm chart deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=coredns upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=coredns,validation validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

> [!TIP]
> Perform a role validation, to visualize all rendered templates and variables.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/templates/values.j2) for details.

### Servers Configuration

Zones configuration template, see [`config_servers.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/templates/config_servers.j2) for details.

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/coredns/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/coredns) file, for additional details.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
