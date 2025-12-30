---
title: Ubuntu Server
prev: /tutorials/handbook
next: /tutorials/handbook/network
weight: 2
---

The K3s cluster can be provisioned into any type of bare-metal hardware. This repository uses Raspberry Pi's as bare-metal hardware example, therefore is recommended to install the latest Ubuntu Server `{{< param variables.os.version >}}+` LTS (64-bits) OS with Raspberry Pi Imager.

<!--more-->

## OS Installation

Each cluster node uses Ubuntu Server `{{< param variables.os.version >}}+` LTS (64-bits) OS installed, which is a requirement for [Cilium](https://cilium.io). The `apt` package dependencies changed, compared to previous `{{< param variables.os.previous_version >}}` release, therefore, `{{< param variables.os.version >}}+` release is enforced as minimal requirement.

> [!NOTE]
> For generic hardware, install the OS using your favorite provisioning method.

{{% steps %}}

### Software

Run the following command to install the Raspberry Pi Imager software:

```shell
brew install raspberry-pi-imager
```

### OS General Settings

On each cluster node, under `OS Customisation: General` section, set **only** the `hostname`, `username` and `password`, as well the `locale` values:

![OS General Settings: Imager General](server-imager-general.webp)

> [!IMPORTANT]
> Use the `username` defined above to set the [`ansible_username`](/wiki/guide/configuration/user) variable.

### OS Services

On each cluster node, under `OS Customisation: Services` section, enable SSH with password authentication:

![OS General Settings: Imager Services](server-imager-services.webp)

{{% /steps %}}

## Hardware

See the `cluster_vars.hardware` settings listed below, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/defaults/main.yaml) defaults file.

{{% steps %}}

### `hardware.architecture`

Hardware architecture used to identify the cluster node hardware architecture. To determine the hardware architecture, run:

```shell
arch
```

Command output:

```shell
aarch64
```

> [!IMPORTANT]
> Certain roles install required binaries, dependent on the hardware architecture.

Example for `k3s` binary defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/k3s/defaults/main.yaml) defaults file:

```yaml
k3s_vars:
  release:
    k3s:
      checksum: sha256sum-arm64.txt
      file: k3s-arm64
      name: k3s
```

The correct hardware architecture value for `arm64` should be `aarch64`, with a file named `k3s-aarch64`, which unfortunately is not the naming convention used into GitHub repositories. Linux kernel community [have chosen](https://lkml.org/lkml/2012/7/6/624) to call their kernel port `arm64` (rather than `aarch64`), hence the use of hardcoded values.

### `hardware.product`

Hardware product, used to identify the cluster node hardware model. To determine the hardware product, run:

```shell
lshw -class system -quiet | grep product
```

Command output:

```shell
product: Raspberry Pi 4 Model B Rev 1.5
```

{{% /steps %}}

## Storage Devices

See the `cluster_vars.device` settings listed below, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/defaults/main.yaml) defaults file.

> [!NOTE]
> To prevent premature wear and improve system performance, the [Provisioning](/wiki/guide/playbooks/provisioning) playbook disables the `atime` timestamp on storage device mounts.

{{% steps %}}

### `device.enabled`

Setting the value to `false` will assume the storage devices are internal and disable any configuration settings related to storage devices attached to hardware through USB cable adapter.

Validate the storage devices attached with a USB cable adapter to hardware, by running the `lsusb` command:

```shell
lsusb
```

Command output:

```shell
Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
Bus 002 Device 002: ID 174c:55aa ASMedia Technology Inc. ASM1051E SATA 6Gb/s bridge, ASM1053E SATA 6Gb/s bridge, ASM1153 SATA 3Gb/s bridge, ASM1153E SATA 6Gb/s bridge
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
Bus 001 Device 002: ID 2109:3431 VIA Labs, Inc. Hub
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```

For example, connecting the storage device with different USB cable models might result in a different `device.name`. Similarly, connecting the storage device to a different USB port will result in a different `device.id`.

> [!TIP]
> Run the [Validation](/wiki/guide/playbooks/validation) playbook, to validate the USB storage device values.

### `device.id`

The storage device attached with a USB cable adapter to hardware is identified as `Bus 002 Device 002`, which sets the `device.id` to `2:2`. To test if the value is correct, run:

```shell
lsusb -s '2:2'
```

Command output:

```shell
Bus 002 Device 002: ID 174c:55aa ASMedia Technology Inc. ASM1051E SATA 6Gb/s bridge, ASM1053E SATA 6Gb/s bridge, ASM1153 SATA 3Gb/s bridge, ASM1153E SATA 6Gb/s bridge
```

### `device.name`

The storage device USB cable adapter chipset is identified as `ASMedia Technology Inc. bridge`, which sets the `device.name` to `ASMedia Technology`. To test if the value is correct, run:

```shell
lsusb -s '2:2' | grep 'ASMedia Technology'
```

Command output:

```shell
Bus 002 Device 002: ID 174c:55aa ASMedia Technology Inc. ASM1051E SATA 6Gb/s bridge, ASM1053E SATA 6Gb/s bridge, ASM1153 SATA 3Gb/s bridge, ASM1153E SATA 6Gb/s bridge
```

{{% /steps %}}

## Hostname Validation

Depending on what network router you use, the `hostname` might not resolve correctly in Ubuntu. Prior cluster deployment, verify the `hostname` FQDN is correctly set.

{{% steps %}}

### Server Login

Login into one of the cluster nodes:

```shell
ssh apollo
```

### Validation

Validate the `/etc/hosts` configuration:

```shell
cat /etc/hosts | grep apollo
```

If the output is as listed below, no action is required:

```shell
127.0.1.1 apollo.local apollo
```

> [!NOTE]
> The [Provisioning](/wiki/guide/playbooks/provisioning) playbook will validate on each cluster node if the above format is respected, and correct it if needed.

You can check the detected server node FQDNs, by running:

```shell
hostname --all-fqdns
```

The output should be:

```shell
apollo.local apollo
```

{{% /steps %}}
