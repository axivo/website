---
title: Cilium
prev: /tutorials/handbook
next: /tutorials/handbook/externaldns
---

This repository uses Cilium, as replacement for various Kubernetes key elements, like `kube-proxy`, `network-policy`, `servicelb` and `traefik`.

<!--more-->

## Provisioning

Due to the intricate nature of its requirements, Cilium is deployed in three steps:

- Initial provisioning, after the K3s cluster services are started
- Provisioning, using resources created during initial provisioning
- Post-install provisioning, using resources created by other provisioning roles

## Dependencies

See below the required Cilium dependencies, used into chart configuration. 

### CertManager

During chart post-install provisioning, Cilium Hubble is configured to take advantage of CertManager auto-renewed certificates, instead of default Helm expiring certificates. This requires the creation of three resources:

- CertManager `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cert-manager/templates/cluster_issuer.j2)
- Hubble `Certificate` resource template, see [`certificate.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/certificate.j2)
- Hubble `ClusterIssuer` resource template, see [`cluster_issuer.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/cluster_issuer.j2)

> [!IMPORTANT]
> Cilium details the following instructions, into their `cert-manager` [installation](https://docs.cilium.io/en/latest/observability/hubble/configuration/tls) steps:
> > Please make sure that your issuer is able to create certificates under the `cilium.io` domain name.
>
> CertManager cannot control a domain not owned by end-user, therefore the above listed `Certificate` and `ClusterIssuer` resources are created.

Refer to Cilium Hubble [documentation](https://docs.cilium.io/en/stable/gettingstarted/hubble-configuration/), for further details.

### Gateway API

[Gateway API](https://gateway-api.sigs.k8s.io) is an official Kubernetes project, focused on L4 and L7 routing in Kubernetes.

#### Usage Example

This is an example of `Gateway` and `HTTPRoute` resources usage for [Cilium Hubble UI](/k3s-cluster/tutorials/handbook/externaldns/#cilium), as replacement for `Ingress` resource:

- `Gateway` resource template, see [`gateway.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/gateway.j2)
- `HTTPRoute` insecure resource template, see [`http_route_insecure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/http_route_insecure.j2)
- `HTTPRoute` secure resource template, see [`https_route_secure.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cilium/templates/https_route_secure.j2)

Refer to Cilium [documentation](https://docs.cilium.io/en/stable/network/servicemesh/gateway-api/gateway-api/), for further details.

## Connectivity

To perform a connectivity test, login into one of the server nodes and run the following commands:

```shell
cilium hubble port-forward &
cilium connectivity test
```

To remove the `cilium-test` namespace and Hubble `port-forward`, run:

```shell
kubectl delete namespace cilium-test -n kube-system
ps aux | grep kubectl | grep -v grep | awk {'print $2'} | xargs kill
```
