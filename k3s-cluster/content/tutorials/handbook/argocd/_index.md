---
title: ArgoCD
prev: /tutorials/handbook
next: /tutorials/handbook/cilium
---

This repository uses [ArgoCD](https://argoproj.github.io/cd) to deploy applications, based on Helm charts. We encourage the community contributing to the [official project](https://{{< param variables.repository.applications >}}).

<!--more-->

## Repository Setup

Navigate to `ArgoCD Settings` > `Repositories` and connect to official project repository:

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
    name: ''
    namespace: default
    server: 'https://kubernetes.default.svc'
  source:
    path: argo/ubuntu
    repoURL: 'https://{{< param variables.repository.applications >}}.git'
    targetRevision: ubuntu/v1.0.0
    helm:
      valueFiles:
        - values.yaml
  sources: []
  project: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
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
