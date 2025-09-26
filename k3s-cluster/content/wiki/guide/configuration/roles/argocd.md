---
title: ArgoCD
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/certmanager
---

[ArgoCD](https://argo-cd.readthedocs.io/en/stable) is a declarative, GitOps continuous delivery tool for Kubernetes, following the GitOps pattern of using Git repositories as the source of truth for defining the desired application state.

The `argo-cd` role performs various tasks related to Helm chart deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=argo-cd upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=argo-cd validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

> [!TIP]
> Perform a role validation, to visualize all rendered templates and variables.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/values.j2) for details.

### Configuration

{{% steps nested="true" %}}

#### Map

Helm chart values template used for configuration map, see [`config_cm.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/config_cm.j2) for details.

#### Parameters

Helm chart values template used for configuration parameters, see [`config_params.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/config_params.j2) for details.

#### RBAC

Helm chart values template used for RBAC configuration, see [`config_rbac.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/config_rbac.j2) for details.

{{% /steps %}}

### Credentials

Kubernetes `Secret` resource template containing the user credentials, see [`credentials.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/credentials.j2) for details.

### Gateway

Kubernetes `Gateway` resource template, see [`gateway.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/gateway.j2) for details.

### HTTP Route

{{% steps nested="true" %}}

#### Insecure Route

Kubernetes `HTTPRoute` resource template, see [`http_route_insecure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/http_route_insecure.j2) for details.

#### Secure Route

Kubernetes `HTTPRoute` resource template, see [`http_route_secure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/http_route_secure.j2) for details.

{{% /steps %}}

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/argocd/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/argo-cd) file, for additional details and refer to ArgoCD [tutorial](/k3s-cluster/tutorials/handbook/argocd), for advanced configuration settings.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
