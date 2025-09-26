---
title: Cluster
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/helm
weight: 1
---

[Ubuntu Server](https://ubuntu.com/server/docs) is a version of the Ubuntu operating system designed and engineered as a backbone for the internet, delivering the best value scale-out performance available.

The `cluster` role performs various tasks related to OS configuration, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Configuration

OS configuration related tasks, see [`configuration.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/configuration.yaml) for details.

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/facts.yaml) for details.

### Firewall

Firewall related tasks, can be used to also configure specific firewall rules. See [`firewall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/firewall.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/main.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

OS upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=cluster upgrade.yaml
```

### User

User related tasks, see [`user.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/user.yaml) for details.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=cluster validation.yaml
```

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/cluster/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/cluster) file and perform any optional adjustments.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
