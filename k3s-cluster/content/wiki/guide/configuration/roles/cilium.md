---
title: Cilium
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/coredns
---

[Cilium](https://docs.cilium.io/en/stable) is an open source, cloud native solution for providing, securing, and observing network connectivity between workloads, fueled by the revolutionary Kernel technology eBPF.

The `cilium` role performs various tasks related to Helm chart deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

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

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=cilium upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=cilium,validation validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

> [!TIP]
> Perform a role validation, to visualize all rendered templates and variables.

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

### Load Balancer IP Pool

Kubernetes `CiliumLoadBalancerIPPool` resource template, see [`loadbalancer_ip_pool.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/loadbalancer_ip_pool.j2) for details.

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/cilium/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/cilium) file, for additional details.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
