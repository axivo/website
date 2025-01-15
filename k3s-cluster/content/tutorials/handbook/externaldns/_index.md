---
title: ExternalDNS
prev: /tutorials/handbook
next: /tutorials/handbook/kured
---

This repository uses [ExternalDNS](https://github.com/kubernetes-sigs/external-dns) with [Cloudflare](https://www.cloudflare.com) provider, in order to maintain the public DNS records and generate valid Let's Encrypt certificates.

<!--more-->

## Cloudflare

Generate the Cloudflare domain [API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/), with following permissions:

{{< filetree/container >}}
  {{< filetree/folder name="ACCOUNT" >}}
    {{< filetree/folder name="domain.com - Zone:Read, DNS:Edit" state="closed" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

Encrypt the `global_map.credentials.externaldns.cloudflare.api.token` value with [`ansible-vault`](/k3s-cluster/tutorials/handbook/ansible/#vault) and insert it into 
[`all.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/inventory/cluster/group_vars/all.yaml) group variables file.

## Front-Ends

See below the list of available front-ends, once the cluster is provisioned successfully.

> [!TIP]
> Update the `externaldns_vars.cloudflare.host.domain` setting, into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/defaults/main.yaml) defaults file.

### ArgoCD

- UI, `https://argocd.domain.com`

### Cilium

- Hubble UI, `https://hubble.domain.com`

### Longhorn

- UI, `https://longhorn.domain.com`

### Victoria Logs

- UI, `https://logs.domain.com`

### Victoria Metrics

See below the global, VMCluster and VMSingle endpoints.

#### Global

- AlertManager UI, `https://alertmanager.domain.com`
- Grafana UI, `https://grafana.domain.com`
- VMAgent UI, `https://agent.domain.com`
- VMAlert UI, `https://alert.domain.com`

#### VMCluster

The following front-ends are available, when `victoriametrics_vars.kubernetes.vmcluster.enabled` is set to `true`:

- VMInsert UI, `https://insert.domain.com`
- VMSelect UI, `https://metrics.domain.com`
- VMSelect Prometheus Endpoint, `https://metrics.domain.com/prometheus`
- VMStorage UI, `https://storage.domain.com`

#### VMSingle

The following front-end is available, when `victoriametrics_vars.kubernetes.vmcluster.enabled` is set to `false`:

- VMSingle UI, `https://metrics.domain.com`
- VMSingle Prometheus Endpoint, `https://metrics.domain.com/prometheus`
