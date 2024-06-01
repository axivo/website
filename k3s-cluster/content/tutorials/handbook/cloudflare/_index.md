---
title: Cloudflare
prev: /tutorials/handbook
next: /tutorials/handbook/kured
---

This repository uses [Cloudflare](https://www.cloudflare.com) and [ExternalDNS](https://github.com/kubernetes-sigs/external-dns), to maintain the public DNS records and generate valid Let's Encrypt certificates.

<!--more-->

## API Token

Generate the domain [API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/), with following permissions:

{{< filetree/container >}}
  {{< filetree/folder name="ACCOUNT" >}}
    {{< filetree/folder name="domain.com - Zone:Read, DNS:Edit" state="closed" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

Encrypt the `token.value` with [`ansible-vault`](/k3s-cluster/tutorials/handbook/ansible/#vault) and insert it into 
[`main.yaml`](https://{{< param variables.repository >}}/blob/main/roles/cloudflare/defaults/main.yaml) defaults file.

## Front-Ends

The following front-ends are available, once the cluster is provisioned successfully:

- AlertManager, `https://alertmanager.domain.com`
- ArgoCD, `https://argocd.domain.com`
- Cilium Hubble, `https://hubble.domain.com`
- Longhorn, `https://longhorn.domain.com`
- Grafana, `https://grafana.domain.com`
- Prometheus, `https://prometheus.domain.com`

Update the `gateway.domain` setting into [`main.yaml`](https://{{< param variables.repository >}}/blob/main/roles/cloudflare/defaults/main.yaml) defaults file.
