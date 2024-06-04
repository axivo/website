---
title: Cluster
prev: /wiki/guide/configuration/roles
next: /wiki/guide/configuration/roles/helm
weight: 1
---

The role performs various tasks related to OS configuration, reset and validation.

<!--more-->

## Role Settings

See the related role settings listed below, defined into [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/defaults/main.yaml) defaults file.

{{% steps %}}

### `cluster_vars.device`

- Default value: `null`

{{< callout type="info" >}}
  Read the [Storage Devices](/k3s-cluster/tutorials/handbook/server) tutorial, on bare-metal infrastructure.
{{< /callout >}}

See the related child settings, listed below.

{{% steps nested="true" %}}

#### `device.enabled`

- Default value: `boolean`, `true`

#### `device.id`

- Default value: `string`, `2:2`

#### `device.name`

- Default value: `string`, `ASMedia Technology`

{{% /steps %}}

### `cluster_vars.hardware`

- Default value: `null`

See the related child settings, listed below.

{{% steps nested="true" %}}

#### `hardware.architecture`

- Default value: `string`, `aarch64`

Hardware architecture used to identify the cluster node hardware architecture. To determine the hardware architecture, run:

```shell
arch
```

Command output:

```shell
aarch64
```

#### `hardware.product`

- Default value: `string`, `Raspberry Pi`

Hardware product, used to identify the cluster node hardware model. To determine the hardware product, run:

```shell
lshw -class system -quiet | grep product
```

Command output:

```shell
product: Raspberry Pi 4 Model B Rev 1.5
```

{{% /steps %}}

### `cluster_vars.service`

- Default value: `null`

See the related child settings, listed below.

{{% steps nested="true" %}}

#### `service.bluetooth`

- Default value: `null`

Setup Bluetooth service, on Raspberry Pi hardware. By default, Ubuntu Server LTS `{{< param variables.os.version >}}` does not installs the related `apt` packages.

{{% steps %}}

##### `bluetooth.enabled`

- Default value: `boolean`, `false`

{{% /steps %}}

#### `service.cloud_init`

- Default value: `null`

Setup Cloud Init service.

{{% steps %}}

##### `cloud_init.enabled`

- Default value: `boolean`, `false`

{{% /steps %}}

#### `service.postfix`

- Default value: `null`

Setup Postfix service, with iCloud mail servers.

{{% steps %}}

##### `postfix.enabled`

- Default value: `boolean`, `true`

##### `postfix.protocols`

- Default value: `string`, `ipv4`

##### `postfix.relay`

- Default value: `null`

{{% steps %}}

###### `relay.host`

- Default value: `string`, `smtp.mail.me.com`

###### `relay.port`

- Default value: `integer`, `587`

{{% /steps %}}

##### `postfix.user`

- Default value: `null`

{{% steps %}}

###### `user.alias`

- Default value: `string`, [`alias@domain.com`](https://support.apple.com/guide/icloud/add-and-manage-email-aliases-mm6b1a490a/icloud)

Mail sent by `root` user will use this email address.

###### `user.name`

- Default value: `string`, [`username@domain.com`](https://appleid.apple.com)

Used for login into iCloud servers.

###### `user.password`

- Default value: `string`, [`password`](https://support.apple.com/102654)

Encrypt the variable with [`ansible-vault`](/k3s-cluster/tutorials/handbook/ansible/#vault).

{{% /steps %}}

{{% /steps %}}

#### `service.snapd`

- Default value: `null`

Setup Snapd service.

{{% steps %}}

##### `snapd.enabled`

- Default value: `boolean`, `false`

{{% /steps %}}

#### `service.unattended_upgrades`

- Default value: `null`

Setup Unattended Upgrades service.

{{% steps %}}

##### `unattended_upgrades.enabled`

- Default value: `boolean`, `true`

##### `unattended_upgrades.mail_report`

- Default value: `string`, `on-change`

##### `unattended_upgrades.remove_deps`

- Default value: `string`, `true`

{{% /steps %}}

#### `service.wifi`

- Default value: `null`

Setup WiFi service, on Raspberry Pi hardware. By default, Ubuntu Server LTS `{{< param variables.os.version >}}` does not installs the related `apt` packages.

{{% steps %}}

##### `wifi.enabled`

- Default value: `boolean`, `false`

{{% /steps %}}

{{% /steps %}}

### `cluster_vars.ssh`

- Default value: `null`

See the related child settings, listed below.

{{% steps nested="true" %}}

#### `ssh.authorized_key`

- Default value: `string`, `/Users/username/.ssh/id_ed25519.pub`

Example of setting a different storage location:

```yaml
cluster_vars:
  ssh:
    authorized_key: /Users/username/keys/id_ed25519.pub
```

{{% /steps %}}

{{% /steps %}}

## Role Tasks

See the related role tasks, listed below.

{{% steps %}}

### Configuration

OS configuration related tasks, see [`configuration.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/configuration.yaml) for details.

### Facts

Ansible facts, see [`facts.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/facts.yaml) for details.

### Firewall

Firewall related tasks, can be used to also configure specific firewall rules. See [`firewall.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/firewall.yaml) for details.

### Main

Main role related tasks, see [`main.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/main.yaml) for details.

### Reset

Reset related tasks, see [`reset.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/reset.yaml) for details.

### Upgrade

OS upgrade related tasks, see [`upgrade.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/upgrade.yaml) for details.

### User

User related tasks, see [`user.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/user.yaml) for details.

### Validation

Validation related tasks, see [`validation.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/roles/cluster/tasks/validation.yaml) for details.

{{% /steps %}}
