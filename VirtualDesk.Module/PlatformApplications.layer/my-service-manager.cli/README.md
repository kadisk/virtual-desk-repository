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
| `storages <serviceId>` | Lista os storages de um serviço |
| `storage-params <serviceId>` | Lista os parâmetros de storage de um serviço |
| `sockets <serviceId>` | Lista os sockets de um serviço |
| `socket-params <serviceId>` | Lista os parâmetros de socket de um serviço |
| `containers <serviceId>` | Lista os containers de um serviço |
| `decommission <serviceId>` | Remove todas as informações de um serviço parado |
| `update-provision <serviceId> <arquivo.provision.json>` | Atualiza o provisionamento de um serviço já provisionado (o serviço deve estar parado) |
| `terminate <serviceId>` | Encerra o provisionamento de um serviço que está em processo de provisionamento |

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

### Recursos de um serviço
```bash
# Listar os storages de um serviço
my-services storages 12

# Listar os parâmetros de storage de um serviço
my-services storage-params 12

# Listar os sockets de um serviço
my-services sockets 12

# Listar os parâmetros de socket de um serviço
my-services socket-params 12

# Listar os containers de um serviço
my-services containers 12
```


### Atualizar um serviço provisionado
O serviço precisa estar **parado** antes de atualizar o provisionamento.
```bash
# Parar, atualizar o provisionamento e iniciar novamente
my-services stop 12
my-services update-provision 12 ./config/meu-servico.provision.json
my-services start 12
```

### Descomissionar e encerrar
```bash
# Remove um serviço parado (apaga seus dados)
my-services decommission 12

# Encerra um provisionamento em andamento
my-services terminate 12
```

## Parâmetros

| Comando | Parâmetro | Tipo | Obrigatório | Descrição |
|---------|-----------|------|-------------|-----------|
| `service` | `serviceId` | number | sim | ID do serviço |
| `start` | `serviceId` | number | sim | ID do serviço a iniciar |
| `stop` | `serviceId` | number | sim | ID do serviço a parar |
| `provision` | `provisionFilePath` | string | sim | Caminho do arquivo `.provision.json` |
| `instances` | `serviceId` | number | sim | ID do serviço |
| `builds` | `serviceId` | number | sim | ID do serviço |
| `storages` | `serviceId` | number | sim | ID do serviço |
| `storage-params` | `serviceId` | number | sim | ID do serviço |
| `sockets` | `serviceId` | number | sim | ID do serviço |
| `socket-params` | `serviceId` | number | sim | ID do serviço |
| `containers` | `serviceId` | number | sim | ID do serviço |
