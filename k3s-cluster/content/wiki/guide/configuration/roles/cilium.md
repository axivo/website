---
title: Cilium
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/coredns
---

The role performs various tasks related to Helm chart deployment, reset and validation.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/reset.yaml) for details.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/upgrade.yaml) for details.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/validation.yaml) for details.

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/values.j2) for details.

### Certificate

Kubernetes `Certificate` resource template, see [`certificate.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/certificate.j2) for details.

### Cluster Issuer

Kubernetes `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/cluster_issuer.j2) for details.

### Gateway

Kubernetes `Gateway` resource template, see [`gateway.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/gateway.j2) for details.

### HTTP Route

{{% steps nested="true" %}}

#### Insecure Route

Kubernetes `HTTPRoute` resource template, see [`http_route_insecure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/http_route_insecure.j2) for details.

#### Secure Route

Kubernetes `HTTPRoute` resource template, see [`http_route_secure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/http_route_secure.j2) for details.

{{% /steps %}}

### L2 Announcement Policy

Kubernetes `CiliumL2AnnouncementPolicy` resource template, see [`l2_announcement_policy.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/l2_announcement_policy.j2) for details.

### Load Balancer

Kubernetes `Service` resource template, see [`loadbalancer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/loadbalancer.j2) for details.

### Load Balancer IP Pool

Kubernetes `CiliumLoadBalancerIPPool` resource template, see [`loadbalancer_ip_pool.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/loadbalancer_ip_pool.j2) for details.

{{% /steps %}}

## Role Variables

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/cilium) file, for additional details.
