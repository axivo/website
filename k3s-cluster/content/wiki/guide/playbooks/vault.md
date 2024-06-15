---
title: Vault
prev: /wiki/guide/playbooks
---

The playbook allows the end-user to perform various Ansible Vault related tasks, like listing currently encrypted role variables, encryption of a specific role variable and update of Ansible Vault global password.

<!--more-->

{{< callout type="info" >}}
  Refer to the Ansible [tutorial](/k3s-cluster/tutorials/handbook/ansible), for usage of encrypted variables and files.
{{< /callout >}}

## Execution

Example of playbook execution, using the Ansible Vault global password:

```shell
ansible-playbook --ask-vault-pass vault.yaml
```

Ansible Vault global password prompt:

```shell
Vault password: my-Gl0bal-Passw0rd
