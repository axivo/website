---
title: Tools
prev: /tutorials/handbook
---

See below various products and services, related to cluster deployments and optimizations.

<!--more-->

## Renovate

This repository uses [Renovate](https://docs.renovatebot.com), to automate the release pull requests and keep dependencies up-to-date.

### Configuration

Follow the Renovate [onboarding instructions](https://docs.renovatebot.com/getting-started/installing-onboarding/) and once the `k3s-cluster` forked repository is configured, review the [`renovate.json5`](https://{{< param variables.repository.cluster >}}/blob/main/.github/renovate.json5) configuration file, for current Renovate implementation.

See a [PR example](https://{{< param variables.repository.cluster >}}/pull/463), with a new release version generated by Renovate.

## Robusta KRR

This repository follows the Kubernetes resource optimization common practices, see the [Robusta blog entry](https://home.robusta.dev/blog/stop-using-cpu-limits) for more details. Use [`krr`](https://github.com/robusta-dev/krr), to optimize the cluster resources allocation.

### Configuration

Install the [application](https://github.com/robusta-dev/krr?tab=readme-ov-file#installation-methods), in your computer:

```shell
brew tap robusta-dev/homebrew-krr
brew install krr
```

Example of running a `simple` strategy, using the [Prometheus endpoint](/k3s-cluster/tutorials/handbook/externaldns/#victoria-metrics):

```shell
krr simple -p https://metrics.domain.com/prometheus -n kube-system --allow-hpa
```

Adjust the resources accordingly, example of resources configuration present into `external-dns` [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/external-dns/defaults/main.yaml) defaults file, where `resources.limits.cpu` is set to `null`:

```yaml
resources:
  limits:
    cpu: null
    memory: 128Mi
  requests:
    cpu: 10m
    memory: 128Mi
```
