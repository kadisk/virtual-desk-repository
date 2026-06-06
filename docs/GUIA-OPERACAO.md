# Guia de operação

Como colocar a nuvem corporativa do Virtual Desk no ar a partir de um ecossistema
Meta Platform já instalado: registrar o repositório, instalar os executáveis e
provisionar/iniciar os serviços na ordem dos rings.

> Não cobre a instalação do ecossistema em si (`mywizard install`). Para isso veja a
> [documentação do Meta Platform](https://github.com/Meta-Platform/.github/tree/main/docs)
> e o [setup-wizard](https://github.com/Meta-Platform/meta-platform-setup-wizard-command-line).

## 1. Registrar e instalar

Registre este repositório como fonte do ecossistema e instale os executáveis. Ajuste
`--localPath` para onde o repositório está na sua máquina:

```bash
repo register source VirtualDeskRepo LOCAL_FS --localPath ~/VirtualDeskRepo

repo install VirtualDeskRepo LOCAL_FS --executables \
  "virtual-desk" "service-orchestrator" "repository-storage-manager" \
  "iam-manager" "local-transit-proxy" "local-domain-router-proxy"
```

Para também instalar os painéis e a CLI de operação, acrescente seus executáveis
(ver [`COMPONENTES.md`](COMPONENTES.md)): `iam-panel`, `service-panel`,
`repository-manager-panel`, `user-space`, `my-services`, `my-iam`.

Quando houver mudanças no repositório:

```bash
repo update VirtualDeskRepo
```

## 2. Resolver os hosts `*.local`

A borda roteia por **nome de host**. Faça os domínios usados pela plataforma
resolverem para a máquina local (ex.: em `/etc/hosts`):

```
127.0.0.1  virtualdesk.app.local service-panel.app.local iam-panel.app.local
127.0.0.1  user-space.app.local repository-manager-panel.app.local
127.0.0.1  kadisk.com.local worms.solutions.local
```

A lista canônica de hosts → portas está em
[`../provisioning-data/ring0/local-domain-router-proxy.provision.json`](../provisioning-data/ring0/local-domain-router-proxy.provision.json).

## 3. Provisionar e iniciar (por ring)

O provisionamento é feito pela CLI `my-services` a partir dos arquivos
`*.provision.json` em [`../provisioning-data/`](../provisioning-data), organizados por
ring. Provisione **do ring mais interno para o mais externo**.

### Ring 0 — infraestrutura e borda

```bash
my-services provision ./provisioning-data/ring0/iam-manager.provision.json
my-services provision ./provisioning-data/ring0/local-domain-router-proxy.provision.json
my-services provision ./provisioning-data/ring0/local-transit-proxy.provision.json
```

### Ring 1 — plataforma e painéis

```bash
my-services provision ./provisioning-data/ring1/virtual-desk.provision.json
my-services provision ./provisioning-data/ring1/service-panel.provision.json
my-services provision ./provisioning-data/ring1/iam-panel.provision.json
my-services provision ./provisioning-data/ring1/user-space-panel.provision.json
my-services provision ./provisioning-data/ring1/repository-manager-panel.provision.json
```

> O `service-panel` depende de `service-orchestrator` e `repository-storage-manager`;
> garanta que esses estejam instalados/provisionados. O `virtual-desk` e o `iam-panel`
> dependem do `iam-manager` (Ring 0).

### Ring 2 — tenants (opcional)

Sites/aplicações de organizações publicados pela plataforma (vêm de outros
repositórios — `KADISKCorpRepo`, `WormsSolutions`). Os arquivos em
`provisioning-data/ring2/` servem de **referência** para publicar novos tenants:

```bash
my-services provision ./provisioning-data/ring2/kadisk-com.provision.json
my-services provision ./provisioning-data/ring2/www-worms-solutions.provision.json
```

## 4. Operação no dia a dia

```bash
my-services services            # lista os serviços provisionados (com IDs)
my-services service <id>        # detalhes de um serviço
my-services start <id>          # inicia
my-services stop <id>           # para
my-services instances <id>      # instâncias em execução
my-services builds <id>         # histórico de builds
```

Para alterar a configuração de um serviço já provisionado, **pare-o** e atualize o
provisionamento:

```bash
my-services stop <id>
my-services update-provision <id> ./provisioning-data/<ring>/<arquivo>.provision.json
my-services start <id>
```

Para remover: `decommission <id>` (serviço parado) ou `terminate <id>` (encerra um
provisionamento em andamento, removendo containers).

## 5. Administrar identidades

Crie a organização e o(s) usuário(s) iniciais com a CLI `my-iam`:

```bash
my-iam create organization "Minha Organização"
my-iam organizations
my-iam create user
my-iam users
```

A administração também está disponível pela web no `iam-panel`
(`http://iam-panel.app.local:9000`).

## 6. Anatomia de um arquivo `*.provision.json`

Cada arquivo descreve um serviço a provisionar. Campos principais:

| Campo | Descrição |
| --- | --- |
| `serviceName` / `serviceDescription` | Nome e descrição do serviço. |
| `repositoryNamespace` | Repositório de origem do pacote (ex.: `VirtualDeskRepo`). |
| `packageName` / `packageType` / `packagePath` | Identificação do pacote dentro do repositório. |
| `startupParams` | Parâmetros de inicialização (porta, `serverName`, URLs, flags como `isWatch`). |
| `socketParams` | Sockets do supervisor que o serviço cria (`owner: true`) ou consome. |
| `storageParams` | Arquivos/diretórios de dados (ex.: bases SQLite, uploads). |
| `ports` / `networkmode` | Configuração de rede (os serviços base usam `host`). |

Use um arquivo existente como ponto de partida e ajuste `startupParams`,
`socketParams` e `storageParams` conforme o novo serviço. Para adicionar um serviço
web ao roteamento, inclua também uma entrada `host → target` na `routeMappingTable`
do `local-domain-router-proxy`.

## 7. Empacotamento em containers (alternativa)

O script [`../up_kadisk_platform.sh`](../up_kadisk_platform.sh) sobe os serviços como
containers Docker em vez de processos no ecossistema host. Ele constrói uma imagem
base do ecossistema e, a partir dela, uma imagem por repositório/executável,
conectando os containers numa rede Docker dedicada. Requer as variáveis de ambiente
`KADISK_CORP_REPO__NAMESPACE`, `WORMS_SOLUTIONS__NAMESPACE` e `TEMP_DIR`, e os
`Dockerfile`s referenciados (`dockerfiles/Dockerfile.base`,
`dockerfiles/Dockerfile.repository`). A convenção de portas dos containers está em
[`../notes.md`](../notes.md).
</content>
