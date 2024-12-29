---
title: ArgoCD
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/certmanager
---

The role performs various tasks related to Helm chart deployment, reset and validation.

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

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/upgrade.yaml) for details.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/validation.yaml) for details.

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/values.j2) for details.

### Configuration

{{% steps nested="true" %}}

#### Parameters

Helm chart values template used for additional configuration parameters, see [`config_params.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/config_params.j2) for details.

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

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/argo-cd) file, for additional details.
