---
title: Cilium
prev: /tutorials/handbook
next: /tutorials/handbook/cloudflare
---

This repository uses Cilium, as replacement for various Kubernetes key elements, like `kube-proxy`, `network-policy`, `servicelb` and `traefik`.

<!--more-->

## Chart Provisioning

Due to the intricate nature of its requirements, Cilium is deployed in three steps:

- Initial provisioning, after the K3s cluster services are started
- Provisioning, using resources created during initial provisioning
- Post-install provisioning, using resources created by other provisioning roles

## Chart Dependencies

See below the required Cilium dependencies, used into chart configuration. 

### CertManager

During chart post-install provisioning, Cilium Hubble is configured to take advantage of CertManager auto-renewed certificates, instead of default Helm expiring certificates. This requires the creation of three resources:

- CertManager `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository >}}/blob/main/roles/certmanager/templates/cluster_issuer.j2)
- Hubble `Certificate` resource template, see [`certificate.j2`](https://{{< param variables.repository >}}/blob/main/roles/cilium/templates/certificate.j2)
- Hubble `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository >}}/blob/main/roles/cilium/templates/cluster_issuer.j2)

{{< callout type="warning" >}}
Cilium details the following instructions into their installation steps:

> Please make sure that your issuer is able to create certificates under the `cilium.io` domain name.

CertManager cannot control an external domain, therefore the above listed `Certificate` and `ClusterIssuer` resources are created.
{{< /callout >}}

Refer to Cilium [documentation](https://docs.cilium.io/en/stable/gettingstarted/hubble-configuration/), for further details.

### Gateway API

[Gateway API](https://gateway-api.sigs.k8s.io) is an official Kubernetes project, focused on L4 and L7 routing in Kubernetes. Refer to Cilium [documentation](https://docs.cilium.io/en/stable/network/servicemesh/gateway-api/gateway-api/), for further details.

#### Usage Example

This is an example of `Gateway` and `HTTPRoute` resources usage for Longhorn frontend, as replacement for deprecated `Ingress` resource:

- `Gateway` resource template, see [`gateway.j2`](https://{{< param variables.repository >}}/blob/main/roles/longhorn/templates/gateway.j2)
- `HTTPRoute` insecure resource template, see [`http_route.j2`](https://{{< param variables.repository >}}/blob/main/roles/longhorn/templates/http_route.j2)
- `HTTPRoute` secure resource template, see [`https_route.j2`](https://{{< param variables.repository >}}/blob/main/roles/longhorn/templates/https_route.j2)
