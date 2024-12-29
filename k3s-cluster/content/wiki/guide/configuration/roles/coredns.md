---
title: CoreDNS
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/externaldns
---

The role performs various tasks related to Helm chart deployment, reset and validation.

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

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/upgrade.yaml) for details.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/coredns/tasks/validation.yaml) for details.

{{% /steps %}}
