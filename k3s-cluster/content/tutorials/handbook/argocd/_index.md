---
title: ArgoCD
prev: /tutorials/handbook
next: /tutorials/handbook/cilium
---

This repository uses [ArgoCD](https://argoproj.github.io/cd) to deploy applications, based on Helm charts. We encourage the community contributing to the [official project](https://{{< param variables.repository.applications >}}).

<!--more-->

## Configuration

See the related role variables, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/defaults/main.yaml) defaults file. Review the [`README.md`](https://{{< param variables.repository.cluster >}}/tree/main/roles/argo-cd) file, for additional details and the advanced configuration settings, listed below.

> [!IMPORTANT]
> A [role upgrade](/k3s-cluster/wiki/guide/configuration/roles/argocd/#upgrade) is required, in order to apply any changes related to configuration.

### Credentials

While still implemented, the `admin` credentials are disabled by default and `user` administrator enabled credentials are configured instead. Additional users can be specified into [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/facts.yaml) tasks file, under `argocd_resources.server.users` collection:

```yaml
argocd_resources:
  server:
    users:
      - name: '{{ argocd_map.credentials.server.user.name }}'
        password: '{{ argocd_map.credentials.server.user.password }}'
        permissions: 'apiKey, login'
        role: admin
        enabled: true
```

The `name` and `password` keys listed above are defined into [`all.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/inventory/cluster/group_vars/all.yaml) group variables file, under `argocd_map.credentials.server` collection.

> [!TIP]
> To enable the `admin` credentials, set the `argocd_vars.kubernetes.configs.cm.admin.enabled` value to `true`, into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/defaults/main.yaml) defaults file.

### Parameters

Additional configuration parameters can be defined into [`config_params.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/config_params.j2) template.

> [!TIP]
> Perform a [role validation](/k3s-cluster/wiki/guide/configuration/roles/argocd/#validation), to visualize all rendered templates and variables.

### RBAC

Additional RBAC policies can be defined into [`config_rbac.j2`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/templates/config_rbac.j2) template. The role automatically injects the users specified into [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/argo-cd/tasks/facts.yaml) tasks file, under `argocd_resources.server.users` collection.

## Repository Setup

Login into [ArgoCD UI](/k3s-cluster/tutorials/handbook/externaldns/#argocd), navigate to `ArgoCD Settings` > `Repositories` and connect to official project repository:

| Key     | Value                                                         |
| :------ | :------------------------------------------------------------ |
| Method  | `HTTPS` <tr></tr>                                             |
| Type    | `git` <tr></tr>                                               |
| Project | `default` <tr></tr>                                           |
| URL     | `https://{{< param variables.repository.applications >}}.git` |

## Applications Provisioning

Application charts are released with version control, based on repository tags. See below an example of application provisioning in ArgoCD.

### Application Resource

In this example, we will create an [Ubuntu Server pod](https://{{< param variables.repository.applications >}}/tree/main/argo/ubuntu), deployed into `default` namespace. Navigate to `Applications` and create an application, then edit the resource manifest as `YAML` and paste the following content:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ubuntu
  namespace: kube-system
spec:
  destination:
    namespace: default
    server: https://kubernetes.default.svc
  project: default
  source:
    helm:
      valueFiles:
        - values.yaml
    path: apps/ubuntu
    repoURL: https://{{< param variables.repository.applications >}}.git
    targetRevision: HEAD
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

#### Metadata

This repository uses the `kube-system` namespace for ArgoCD role provisioning. Adjust the `metadata.namespace` value accordingly, if you deploy ArgoCD in a different namespace.

The `spec.destination.name` is inherited from `metadata.name` value.

### Shell Login

Example of pod shell login:

```shell
$ kubectl get pods -n default -o go-template \
  --template='{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}'
ubuntu-6589cf5fb4-p9z2b

$ kubectl exec -itn default ubuntu-6589cf5fb4-p9z2b -- bash
root@ubuntu-6589cf5fb4-p9z2b:/#
```
