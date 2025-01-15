---
title: K3s
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/argocd
weight: 2
---

[K3s](https://k3s.io) is a highly available, certified Kubernetes distribution designed for production workloads, packaged as a single binary that reduces the dependencies and steps needed to install.

The `k3s` role performs various tasks related to OS configuration, K3s cluster deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Configuration

Configuration related facts, see [`configuration.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/configuration.yaml) for details.

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/facts.yaml) for details.

### Load Balancer

Load balancer related tasks, see [`loadbalancer.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/loadbalancer.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=k3s upgrade.yaml
```

The upgrade will trigger the [Kured](/k3s-cluster/wiki/guide/configuration/roles/kured) role execution, performing safe automatic node reboots.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=k3s,validation validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Configuration

{{% steps nested="true" %}}

#### Cluster

Cluster configuration template, see [`config.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/templates/config.j2) for details.

#### HAProxy

HAProxy configuration template, see [`haproxy.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/templates/haproxy.j2) for details.

#### KeepAlived

KeepAlived configuration template, see [`keepalived.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/templates/keepalived.j2) for details.

#### Registries

[Registries](https://docs.k3s.io/installation/registry-mirror) configuration template, see [`registries.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/templates/registries.j2) for details.

{{% /steps %}}

### Service

Service configuration template, see [`service.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/templates/service.j2) for details.

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/k3s/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/k3s) file, for additional details.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to suggest a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
