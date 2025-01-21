---
title: K3s
prev: /tutorials/handbook
next: /tutorials/handbook/argocd
weight: 4
---

This repository uses [K3s](https://k3s.io), a highly available, certified Kubernetes distribution designed for production workloads, packaged as a single binary that reduces the dependencies and steps needed to install.

<!--more-->

## Dependencies

To properly operate the cluster, install the following dependencies:

```shell
brew install kubernetes-cli
brew install --cask lens
```

During provisioning, the cluster `.kube/config` file is updated locally, refer to `k3s_vars.cluster.kubeconfig` variables defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/defaults/main.yaml) defaults file.

The end-user can use `kubectl` to operate the cluster via local terminal, or [Lens](https://k8slens.dev):

[![K3s: Lens](k3s-lens.webp)](k3s-lens.webp)

> [!TIP]
> Lens automatically detects and exposes the metrics produced by [VictoriaMetrics](/k3s-cluster/wiki/guide/configuration/roles/victoriametrics) role.

## Upgrade

Upon a new K3s version release, end-user can perform a [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/k3s/#upgrade), which will schedule a [Kured](/k3s-cluster/wiki/guide/configuration/roles/kured) reboot.

### Manual Upgrade

Once the [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/k3s/#upgrade) performed, end-user can choose to manually upgrade each cluster node. A [node drain](/k3s-cluster/tutorials/handbook/longhorn/#node-drain) must be executed one node at the time, followed by a node reboot. Once the node is up and running, it can be uncordoned with Lens or `kubectl`, via local terminal:

```shell
kubectl uncordon <node>
```
