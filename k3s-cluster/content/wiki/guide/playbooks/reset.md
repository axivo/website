---
title: Reset
prev: /wiki/guide/playbooks
---

The playbook allows the end-user to perform a cluster reset, bringing the nodes to an initial pre-provisioning state.

<!--more-->

> [!IMPORTANT]
> Refer to the Ansible [tutorial](/tutorials/handbook/ansible), for usage of encrypted variables and files.

## Execution

Example of playbook execution, using the Ansible Vault global password:

```shell
ansible-playbook --ask-vault-pass reset.yaml
```

Ansible Vault global password prompt:

```shell
Vault password: my-Gl0bal-Passw0rd
```

To faster re-deploy a cluster after reset, skip the removal of installed `apt` packages:

```shell
Remove installed apt packages? [Y/n] [n]:
```

> [!TIP]
> Pressing Enter is equivalent to selecting the default `[n]` option.
