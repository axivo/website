---
title: Longhorn
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/metricsserver
---

[Longhorn](https://longhorn.io/docs) is a lightweight, reliable, and powerful distributed block storage system for Kubernetes, implementing distributed block storage using containers and microservices.

The `longhorn` role performs various tasks related to Helm chart deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=longhorn upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=longhorn validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/templates/values.j2) for details.

### Credentials

Kubernetes `Secret` resource template containing the user credentials, see [`credentials.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/templates/credentials.j2) for details.

### Gateway

Kubernetes `Gateway` resource template, see [`gateway.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/templates/gateway.j2) for details.

### HTTP Route

{{% steps nested="true" %}}

#### Insecure Route

Kubernetes `HTTPRoute` resource template, see [`http_route_insecure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/templates/http_route_insecure.j2) for details.

#### Secure Route

Kubernetes `HTTPRoute` resource template, see [`http_route_secure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/templates/http_route_secure.j2) for details.

{{% /steps %}}

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/wiki/guide/configuration/roles/longhorn/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/longhorn/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/longhorn) file, for additional details.

> [!TIP]
> Use [Renovate](/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
