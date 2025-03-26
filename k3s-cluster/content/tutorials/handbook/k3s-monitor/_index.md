---
title: K3s Monitor
prev: /tutorials/handbook
next: /tutorials/handbook/argocd
weight: 4
---

{{< badge content="Source Code" icon="github" link="https://github.com/axivo/k3s-monitor" >}}

The **K3s Monitor** tool is a comprehensive Python utility designed to collect, analyze and report on resource utilization and performance metrics from a K3s cluster. This tool is particularly useful for diagnosing performance issues, capacity planning and understanding resource consumption patterns in production environments.

<!--more-->

## Tool Features

* **Cluster Resource Monitoring**: Collects various resource metrics from nodes and pods
* **Component-Specific Monitoring**: Tracks resource usage for all K3s Cluster [components](/k3s-cluster/wiki/guide/configuration/roles/#charts)
* **Log Collection**: Gathers logs from system services and Kubernetes components
* **Automated Analysis**: Identifies high resource consumption and potential issues
* **Comparative Reporting**: Compares current metrics with previous monitoring runs
* **Comprehensive Summary**: Generates detailed reports with recommendations, ready for AI-assisted analysis with tools like [Claude](https://claude.ai)

## Prerequisites

The following dependencies are required to run the **K3s Monitor** tool, automatically deployed with [Provisioning](/k3s-cluster/wiki/guide/playbooks/provisioning) playbook:

* Python 3.8+
* `python3-kubernetes` library
* `python3-yaml` library
* `kubectl` configured to access the K3s cluster
* `journalctl` for log collection
* `jq` for JSON processing

## Generated Reports

The following reports are generated:

* **cilium-metrics.log**: Detailed Cilium networking status, endpoints and services information
* **cluster-info.log**: Basic information about the cluster
* **comparison.log**: Comparison with previous monitoring runs
* **component-metrics.csv**: Time-series data for component resource usage
* **summary.log**: Overall resource usage summary and recommendations
* **etcd-metrics.log**: Status of HA clusters, `etcd` cluster health and metrics
* **k3s-monitor.log**: Operational log of the monitoring tool itself, including all actions taken during execution
* **log-summary.txt**: Summary of important log events (errors, warnings)
* **pod-metrics.csv**: Detailed pod-level resource metrics
* **sysctl.txt**: System kernel parameter settings
* **summary.log**: Overall resource usage summary and recommendations

See below the directories and files structure, containing the generated reports.

> [!NOTE]
> Submit the generated tarball to [Claude](https://claude.ai), for AI-assisted analysis. Upload the tarball to a chat with Claude and ask for an analysis of your K3s cluster metrics and performance.

{{< filetree/container >}}
  {{< filetree/folder name="/var/log/k3s" >}}
    {{< filetree/folder name="YYYYMMDD-HHMMSS (click to expand)" state="closed" >}}
      {{< filetree/file name="cilium-metrics.log" >}}
      {{< filetree/file name="cluster-info.log" >}}
      {{< filetree/file name="comparison.log" >}}
      {{< filetree/file name="component-metrics.csv" >}}
      {{< filetree/file name="etcd-metrics.log" >}}
      {{< filetree/file name="k3s-monitor.log" >}}
      {{< filetree/file name="log-summary.txt" >}}
      {{< filetree/file name="pod-metrics.csv" >}}
      {{< filetree/folder name="service" >}}
        {{< filetree/folder name="components" >}}
          {{< filetree/file name="argo-cd_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="cert-manager_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="cilium_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="coredns_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="external-dns_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="kured_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="longhorn_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="metrics-server_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="victorialogs_YYYYMMDD-HHMMSS.log" >}}
          {{< filetree/file name="victoriametrics_YYYYMMDD-HHMMSS.log" >}}
        {{< /filetree/folder >}}
        {{< filetree/file name="containerd.log" >}}
        {{< filetree/file name="k3s.log" >}}
        {{< filetree/file name="kubelet.log" >}}
      {{< /filetree/folder >}}
      {{< filetree/file name="summary.log" >}}
      {{< filetree/file name="sysctl.txt" >}}
    {{< /filetree/folder >}}
    {{< filetree/file name="k3s-monitor-YYYYMMDD-HHMMSS.tar.gz" >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

## Tool Usage

Login into one of the server nodes and run the tool:

```shell
ssh apollo
sudo k3s-monitor --help
usage: k3s-monitor [-h] [-d DURATION] [-i INTERVAL] [-l LOG_DIR] [-m LOG_MAX_SIZE] [-n NAMESPACE] [-v]

K3s Cluster Monitor

options:
  -h, --help            show this help message and exit
  -d DURATION, --duration DURATION
                        Total monitoring duration in seconds (default: 3600)
  -i INTERVAL, --interval INTERVAL
                        Time between metric collections in seconds (default: 300)
  -l LOG_DIR, --log-dir LOG_DIR
                        Directory to store logs and reports (default: /var/log/k3s)
  -m LOG_MAX_SIZE, --log-max-size LOG_MAX_SIZE
                        Maximum log file size in MB (default: 50)
  -n NAMESPACE, --namespace NAMESPACE
                        Default namespace (default: kube-system)
  -v, --verbose         Enable verbose logging (default: False)
  ```

See below various **K3s Monitor** tool usage examples.

{{% details title="Examples" closed="true" %}}

Monitor components for 24 hours with 15-minute intervals:

```shell
sudo k3s-monitor --duration 86400 --interval 900
```

Store logs into a custom directory with verbose output:

```shell
sudo k3s-monitor --log-dir /home/user/k3s-monitoring --verbose
```

Monitor components deployed into a different namespace:

```shell
sudo k3s-monitor --namespace monitoring
```

Run a quick 10-minute check with 1-minute intervals:

```shell
sudo k3s-monitor --duration 600 --interval 60
```

{{% /details %}}

## Best Practices

* **Regular Monitoring**: Run the tool periodically (e.g., weekly) to establish baseline metrics
* **After Changes**: Run after cluster upgrades or significant workload changes
* **Retention**: Keep monitoring results for trend analysis
* **Size Appropriately**: Adjust duration and interval based on cluster size:
  * Small clusters: 1-hour duration, 5-minute intervals
  * Large clusters: 6-hour duration, 15-minute intervals
