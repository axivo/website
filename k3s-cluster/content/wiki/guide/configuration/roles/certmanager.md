---
title: CertManager
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/cilium
---

The role performs various tasks related to Helm chart deployment, reset and validation.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/tasks/reset.yaml) for details.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/tasks/upgrade.yaml) for details.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/tasks/validation.yaml) for details.

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/templates/values.j2) for details.

### Cluster Issuer

Kubernetes `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/templates/cluster_issuer.j2) for details.

{{% /steps %}}

## Role Variables

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/cert-manager) file, for additional details.
