# My Services Manager CLI

CLI para gerenciamento de serviços e suas instâncias.

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `services` | Lista todos os serviços provisionados |
| `service <serviceId>` | Mostra informações detalhadas de um serviço |
| `start <serviceId>` | Inicia um serviço parado |
| `stop <serviceId>` | Para um serviço em execução |
| `provision <arquivo.provision.json>` | Provisiona um novo serviço |
| `instances <serviceId>` | Lista instâncias de um serviço |
| `builds <serviceId>` | Mostra histórico de builds de um serviço |

## Uso

### Listar e consultar serviços
```bash
# Listar todos os serviços
my-services services

# Ver detalhes de um serviço específico
my-services service 12
```

### Gerenciar estado dos serviços
```bash
# Iniciar um serviço
my-services start 12

# Parar um serviço
my-services stop 12
```

### Provisionamento e informações adicionais
```bash
# Provisionar novo serviço
my-services provision ./config/meu-servico.provision.json

# Listar instâncias de um serviço
my-services instances 12

# Ver histórico de builds
my-services builds 12
```

## Parâmetros

| Comando | Parâmetro | Tipo | Obrigatório | Descrição |
|---------|-----------|------|-------------|-----------|
| `service` | `serviceId` | number | ✅ | ID do serviço |
| `start` | `serviceId` | number | ✅ | ID do serviço a iniciar |
| `stop` | `serviceId` | number | ✅ | ID do serviço a parar |
| `provision` | `provisionFilePath` | string | ✅ | Caminho do arquivo `.provision.json` |
| `instances` | `serviceId` | number | ✅ | ID do serviço |
| `builds` | `serviceId` | number | ✅ | ID do serviço |

## Bibliotecas Internas

- `jsonFileUtilitiesLib`: Utilitários para arquivos JSON
- `commandExecutorLib`: Execução de comandos CLI

