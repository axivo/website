---
title: VictoriaMetrics
prev: /wiki/guide/configuration/roles
next: /wiki/guide/playbooks
---

[VictoriaMetrics](https://docs.victoriametrics.com) is a fast, cost-effective and scalable monitoring solution and time series database, used as drop-in replacement for Prometheus.

The `victoria-metrics` role performs various tasks related to Helm chart deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/tasks/main.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/tasks/reset.yaml) for details.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=victoria-metrics upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=victoria-metrics,validation validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

> [!TIP]
> Perform a role validation, to visualize all rendered templates and variables.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/templates/values.j2) for details.

### Configuration

{{% steps nested="true" %}}

#### AlertManager

Helm chart values template used for additional AlertManager configuration rules, see [`config_alertmanager.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/templates/config_alertmanager.j2) for details.

> [!TIP]
> Additional alerts can be implemented into [`alerts`](https://{{< param variables.repository.cluster >}}blob/main/roles/victoria-metrics/templates/alerts) directory, see [`node_health.js`](https://{{< param variables.repository.cluster >}}blob/main/roles/victoria-metrics/templates/alerts/node_health.j2) for details.

{{% /steps %}}

### Credentials

Kubernetes `Secret` resource template containing the user credentials, see [`credentials.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/templates/credentials.j2) for details.

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/victoriametrics/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/victoria-metrics/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/victoria-metrics) file, for additional details.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
