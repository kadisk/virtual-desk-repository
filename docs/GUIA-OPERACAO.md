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

### Control plane (pré-requisito — antes de qualquer `provision`)

`service-orchestrator` e `repository-storage-manager` **não têm provision file** e
**não são provisionados por `my-services`**: eles são o control plane que o próprio
`my-services` consome via socket (ver
[`my-service-manager.cli/metadata/startup-params.json`](../VirtualDesk.Module/PlatformApplications.layer/my-service-manager.cli/metadata/startup-params.json),
que aponta para `service-orchestrator.app.sock` e `repository-storage-manager.app.sock`).

Por isso eles são **iniciados diretamente pelo ecossistema** (camada de execução /
supervisor), usando seu próprio `metadata/startup-params.json`, e precisam estar **no
ar antes** de rodar qualquer `my-services provision`. O mesmo vale para o
`iam-manager`, consumido por socket pelos painéis e pelo `virtual-desk`.

> Os três expõem um socket em `~/EcosystemData/sockets/` (`service-orchestrator.app.sock`,
> `repository-storage-manager.app.sock`, `iam-socket`). Confirme que estão ativos com
> `supervisor sockets` / `supervisor status <socket>` antes de prosseguir.

### Ring 0 — borda (proxies)

Com o control plane no ar, provisione a borda via `my-services`:

```bash
my-services provision ./provisioning-data/ring0/iam-manager.provision.json
my-services provision ./provisioning-data/ring0/local-domain-router-proxy.provision.json
my-services provision ./provisioning-data/ring0/local-transit-proxy.provision.json
```

> O `iam-manager` aparece aqui porque há um provision file para ele em `ring0/`. Se no
> seu ambiente o `iam-manager` já sobe como control plane (direto pelo ecossistema),
> pule esta linha — não provisione o mesmo serviço duas vezes.

### Ring 1 — plataforma e painéis

```bash
my-services provision ./provisioning-data/ring1/virtual-desk.provision.json
my-services provision ./provisioning-data/ring1/service-panel.provision.json
my-services provision ./provisioning-data/ring1/iam-panel.provision.json
my-services provision ./provisioning-data/ring1/user-space-panel.provision.json
my-services provision ./provisioning-data/ring1/repository-manager-panel.provision.json
```

> Dependências: `service-panel` consome `service-orchestrator` e
> `repository-storage-manager` (control plane); `repository-manager-panel` consome
> `repository-storage-manager`; `virtual-desk`, `iam-panel` e `user-space-panel`
> consomem o `iam-manager`. Garanta o control plane no ar antes destes.

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
