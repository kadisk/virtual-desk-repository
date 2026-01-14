# IAM Tools CLI

CLI para gerenciamento do IAM.

## Comandos Disponíveis

| Comando                                     | Descrição                        |
| ------------------------------------------- | -------------------------------- |
| `create organization <name>`                | Cria uma nova organização        |
| `create user`                               | Cria um novo usuário             |
| `organizations`                             | Lista todas as organizações      |
| `users`                                     | Lista todos os usuários          |
| `change organization name <organizationId>` | Altera o nome de uma organização |
| `delete organization <organizationId>`      | Remove uma organização           |

## Uso

### Organizações

```bash
# Criar uma nova organização
my-iam create organization "Minha Organização"

# Listar todas as organizações
my-iam organizations

# Alterar o nome de uma organização
my-iam change organization name org_123

# Remover uma organização
my-iam delete organization org_123
```

### Usuários

```bash
# Criar um novo usuário
my-iam create user

# Listar todos os usuários
my-iam users
```

## Parâmetros

| Comando                    | Parâmetro        | Tipo   | Obrigatório | Descrição                        |
| -------------------------- | ---------------- | ------ | ----------- | -------------------------------- |
| `create organization`      | `name`           | string | ✅           | Nome da organização a ser criada |
| `change organization name` | `organizationId` | string | ✅           | ID da organização a ser alterada |
| `delete organization`      | `organizationId` | string | ✅           | ID da organização a ser removida |

## Bibliotecas Internas

* `jsonFileUtilitiesLib`: Utilitários para leitura e escrita de arquivos JSON
* `commandExecutorLib`: Execução e orquestração de comandos CLI
