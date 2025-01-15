---
title: ExternalDNS
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/kured
---

[ExternalDNS](https://kubernetes-sigs.github.io/external-dns/latest/) makes Kubernetes resources discoverable via public DNS servers, by synchronizing exposed Kubernetes Services and Ingresses.

The `external-dns` role performs various tasks related to [Cloudflare](https://www.cloudflare.com) DNS configuration, as well the `external-dns` Helm chart deployment, reset and validation.

> [!TIP]
> Role deployments are performed at `global` level, using the [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook. Upgrades can be performed at `role` level, see the instructions detailed below.

<!--more-->

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/tasks/facts.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/tasks/main.yaml) for details.

### Post-Install

Post-install related tasks, see [`postinstall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/tasks/postinstall.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/tasks/reset.yaml) for details.

> [!TIP]
> A reset is performed at global level only, review the [Reset](/k3s-cluster/wiki/guide/playbooks/reset) playbook instructions.

### Upgrade

Upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/tasks/upgrade.yaml) for details. Run the following command, to perform a role upgrade:

```shell
ansible-playbook --ask-vault-pass --tags=external-dns upgrade.yaml
```

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/tasks/validation.yaml) for details. Run the following command, to perform all role related validation tasks:

```shell
ansible-playbook --ask-vault-pass --tags=external-dns,validation validation.yaml
```

{{% /steps %}}

## Role Templates

See the related role templates, listed below.

{{% steps %}}

### Helm Chart

Helm chart values template, see [`values.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/templates/values.j2) for details.

### API Token

Kubernetes `Secret` resource template, see [`api_token.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/templates/api_token.j2) for details.

### Cluster Issuer

Kubernetes `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/templates/cluster_issuer.j2) for details.

{{% /steps %}}

## Role Variables

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/externaldns/#upgrade) is required, in order to apply any changes related to role variables.

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/external-dns) file, for additional details.

> [!TIP]
> Use [Renovate](/k3s-cluster/tutorials/handbook/tools/#renovate) to automate release pull requests and keep dependencies up-to-date.

## Support

If you encounter any role related problems or want to request a new feature, feel free to [open an issue](https://{{< param variables.repository.cluster >}}/issues). For general questions or feedback, please use the [discussions](https://{{< param variables.repository.cluster >}}/discussions).
