---
title: Validation
prev: /wiki/guide/playbooks
---

The playbook allows the end-user to perform an initial cluster components validation, to be executed prior cluster provisioning.

<!--more-->

> [!IMPORTANT]
> Refer to the Ansible [tutorial](/k3s-cluster/tutorials/handbook/ansible), for usage of encrypted variables and files.

## Execution

Example of playbook execution, using the Ansible Vault global password:

```shell
ansible-playbook --ask-vault-pass validation.yaml
```

Ansible Vault global password prompt:

```shell
Vault password: my-Gl0bal-Passw0rd
```

Run the following command, to perform the validation tasks for a specific role:

```shell
ansible-playbook --ask-vault-pass --tags=argo-cd validation.yaml
```
