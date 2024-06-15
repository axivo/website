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

{{< callout type="info" >}}
  Refer to the Ansible [documentation](https://docs.ansible.com/ansible/latest/vault_guide/vault_using_encrypted_content.html), for usage of encrypted variables and files.
{{< /callout >}}

This repository uses a global password for all encrypted settings, allowing the end-user to securely input the global password during the playbook execution, which will implicitly decrypt all encrypted settings with Ansible Vault.

### Encryption

See below the current list of encrypted variables:

- `ansible_password`
- `argocd_vars.kubernetes.server.admin.password`
- `argocd_vars.kubernetes.server.user.password`
- `cloudflare_vars.kubernetes.api.token.value`
- `cluster_vars.service.postfix.user.alias`
- `cluster_vars.service.postfix.user.name`
- `cluster_vars.service.postfix.user.password`
- `kured_vars.kubernetes.configuration.slack.notify_url`
- `longhorn_vars.kubernetes.default_settings.backup.user.password`
- `prometheus_vars.kubernetes.grafana.user.password`

Example of `ansible_password` variable encryption:

```shell
ansible-vault encrypt_string 'this-Is-Som3-paSsw0rd' --name 'ansible_password'
```

Ansible Vault encrypted variable output:

```shell
New Vault password: my-Gl0bal-Passw0rd
Confirm New Vault password: my-Gl0bal-Passw0rd
Encryption successful
ansible_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          32313062343462356565373964653464623266323538373864383063333232393833336163343436
          3631326537313236613737353037393564623230353936380a643161633533626236376630353864
          35323639343039386465363233303239386535376630656637346333643563613536366631373466
          3461636432363861610a336232313535333433643737636236376236313334656138336335616262
          36613833363662323261373266333565633430643639366435303061313039643637
```

{{< callout type="warning" >}}
  Use the above defined `my-Gl0bal-Passw0rd` global password example for all encrypted settings, into all configuration files.
{{< /callout >}}

Insert the `ansible_password` encrypted output into [`all.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/inventory/cluster/group_vars/all.yaml) configuration file, while respecting the output indentation.

Once all variables have been initially encrypted with the same global password, they can be updated with the [Vault](/k3s-cluster/wiki/guide/playbooks/vault) playbook:

```shell
ansible-playbook --ask-vault-pass vault.yaml
Vault password: my-Gl0bal-Passw0rd
Select an action to perform:
 1) List encrypted role variables
 2) Encrypt role variable
 3) Update global password
: 2
Set variable with a 'key|value' format:
ansible_password|this-Is-An0th3r-paSsw0rd
```

Ansible Vault encrypted variable output:

```shell
New Vault password: my-Gl0bal-Passw0rd
Confirm New Vault password: my-Gl0bal-Passw0rd
ok: [localhost] =>
  encrypted_variable.stdout: |-
    ansible_password: !vault |
              $ANSIBLE_VAULT;1.1;AES256
              62623461303137663165333062663339623431353335396633623538353136336263366638666665
              6432626166383863396434303330356136366231623337350a336538336438373834343836643630
              66353062303735316639313962666661323266613165313865393163386534656165393333306632
              3630366333363764380a626339363632306438333063646238336634323535393233366539643662
              36323730346430623433373034623734383766316330333138633862353530366238
```

### Decryption

The variables can be decrypted and visualized with the [Vault](/k3s-cluster/wiki/guide/playbooks/vault) playbook:

```shell
ansible-playbook --ask-vault-pass vault.yaml
Vault password: my-Gl0bal-Passw0rd
Select an action to perform:
 1) List encrypted role variables
 2) Encrypt role variable
 3) Update global password
: 1
```

Ansible Vault decrypted variables output:

```shell
ok: [localhost] =>
  encrypted_variables:
  - ansible_password: this-Is-An0th3r-paSsw0rd
```

### Playbook Usage

Example of playbook execution, using the Ansible Vault global password:

```shell
ansible-playbook --ask-vault-pass provisioning.yaml
```

Ansible Vault global password prompt:

```shell
Vault password: my-Gl0bal-Passw0rd
```
