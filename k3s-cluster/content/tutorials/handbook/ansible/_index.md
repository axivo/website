---
title: Ansible
prev: /tutorials/handbook
next: /tutorials/handbook/server
weight: 1
---

[Ansible](https://docs.ansible.com) is an open-source software application written in Python, automating the management of remote systems and controlling their desired state.

<!--more-->

## Vault

[Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/vault.html) encrypts variables, in order to protect sensitive content such as passwords or keys, rather than leaving it visible as plaintext into configuration files.

> [!IMPORTANT]
> Refer to the Ansible [documentation](https://docs.ansible.com/ansible/latest/vault_guide/vault_using_encrypted_content.html), for usage of encrypted variables and files.

This repository uses a global password for all encrypted settings, allowing the end-user to securely input the global password during the playbook execution, which will implicitly decrypt all encrypted settings with Ansible Vault.

### Encrypted Variables

End-user needs to perform an initial encryption of all encrypted role variables. See below the current list of encrypted variables, present into [`all.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/inventory/cluster/group_vars/all.yaml) group variables file:

- `ansible_password`
- `global_map.credentials.argocd.server.admin.password`
- `global_map.credentials.argocd.server.user.password`
- `global_map.credentials.cluster.postfix.user.alias`
- `global_map.credentials.cluster.postfix.user.name`
- `global_map.credentials.cluster.postfix.user.password`
- `global_map.credentials.externaldns.cloudflare.api.token`
- `global_map.credentials.kured.slack.notify.url`
- `global_map.credentials.longhorn.backup.user.password`
- `global_map.credentials.victoriametrics.grafana.user.password`

Example of initial `ansible_password` variable encryption:

```shell
ansible-vault encrypt_string 'this-Is-Som3-paSsw0rd' --name 'ansible_password'
New Vault password: my-Gl0bal-Passw0rd
Confirm New Vault password: my-Gl0bal-Passw0rd
```

> [!IMPORTANT]
> Use the above defined `my-Gl0bal-Passw0rd` global password example, for all encrypted variables.

Ansible Vault encrypted variable output:

```shell
Encryption successful
ansible_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          32313062343462356565373964653464623266323538373864383063333232393833336163343436
          3631326537313236613737353037393564623230353936380a643161633533626236376630353864
          35323639343039386465363233303239386535376630656637346333643563613536366631373466
          3461636432363861610a336232313535333433643737636236376236313334656138336335616262
          36613833363662323261373266333565633430643639366435303061313039643637
```

Insert the `ansible_password` encrypted output into [`all.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/inventory/cluster/group_vars/all.yaml) group variables file, while respecting the *existing* indentation.

> [!TIP]
> Once all variables have been initially encrypted with the same global password, they can be decrypted or updated with the [Vault](/k3s-cluster/wiki/guide/playbooks/vault) playbook.

### Playbook Usage

Example of playbook execution, using the Ansible Vault global password:

```shell
ansible-playbook --ask-vault-pass provisioning.yaml
```

Ansible Vault global password prompt:

```shell
Vault password: my-Gl0bal-Passw0rd
```
