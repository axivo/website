---
title: Vault
prev: /wiki/guide/playbooks
---

The playbook allows the end-user to perform various Ansible Vault related tasks, like listing currently encrypted role variables, encryption of a specific role variable and update the Ansible Vault global password.

<!--more-->

> [!IMPORTANT]
> Refer to the Ansible [tutorial](/tutorials/handbook/ansible), for usage of encrypted variables and files.

## Execution

Example of playbook execution, using the Ansible Vault global password:

```shell
ansible-playbook --ask-vault-pass vault.yaml
```

Ansible Vault global password prompt:

```shell
Vault password: my-Gl0bal-Passw0rd
```

### Variables Decryption

The variables can be decrypted and visualized with the playbook:

```shell
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
    ansible_password: [redacted]
    global_map:
      credentials:
        argocd:
          server:
            admin:
              password: [redacted]
            user:
              password: [redacted]
        cluster:
          postfix:
            user:
              alias: alias@icloud.com
              name: username@icloud.com
              password: [redacted]
        externaldns:
          cloudflare:
            api:
              token: [redacted]
        kured:
          slack:
            notify:
              url: slack://[redacted]/[redacted]/[redacted]
        longhorn:
          backup:
            user:
              password: [redacted]
        victoriametrics:
          grafana:
            user:
              password: [redacted]
```

### Variables Encryption

New variable values can be encrypted with the playbook:

```shell
Select an action to perform:
 1) List encrypted role variables
 2) Encrypt role variable
 3) Update global password
: 2
Set variable with a 'key|value' format:
global_map.credentials.argocd.server.user.password|this-Is-An0th3r-paSsw0rd
New Vault password: my-Gl0bal-Passw0rd
Confirm New Vault password: my-Gl0bal-Passw0rd
```

> [!IMPORTANT]
> Use the existing global password, to avoid breaking the playbook Ansible Vault decryption process.

Ansible Vault encrypted variable output:

```shell
ok: [localhost] =>
  encrypted_variable.stdout: |-
    global_map.credentials.argocd.server.user.password: !vault |
              $ANSIBLE_VAULT;1.1;AES256
              66343733613831643830336363643830343062343534643730353134633131656632366238373465
              3865303630383736373731396330356663653263393161300a386534613937636165376331343833
              31636135656432656130383132613834653739373835316330383162386539396231316532346366
              3438383835366466310a656236363438626430316239363266653462316538633935313438633336
              32646363343764353339363138363436623233363063623064333866363062653061
```

### Global Password Update

The global password can be updated with the playbook:

```shell
Select an action to perform:
 1) List encrypted role variables
 2) Encrypt role variable
 3) Update global password
: 3
New global password (output is hidden):
new-Gl0bal-Passw0rd
Confirm new global password (output is hidden):
new-Gl0bal-Passw0rd
```

The newly encrypted variables will be displayed, update the [`all.yaml`](https://{{< param variables.repository.cluster >}}/blob/main/inventory/cluster/group_vars/all.yaml) group variables file with the new values.
