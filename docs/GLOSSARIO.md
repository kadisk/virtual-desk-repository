# Glossário

Termos usados na documentação deste repositório. Os conceitos da plataforma têm
definição canônica no
[open standard](https://github.com/Meta-Platform/meta-platform-open-standard); aqui está
a versão curta, com o sentido **neste repositório**.

## Hierarquia de pacotes

- **Repository** — fonte de pacotes registrada no ecossistema (ex.: `VirtualDeskRepo`).
  Registrada com `repo register source` e instalada com `repo install`.
- **Module** (`*.Module`) — primeiro nível de organização dentro do repositório
  (ex.: `Platform.Module`, `VirtualDesk.Module`).
- **Layer** (`*.layer`) — categoria técnica de pacotes dentro de um módulo
  (ex.: `Applications.layer`, `Services.layer`, `Webservices.layer`).
- **Group** (`*.group`) — agrupamento opcional que reúne pacotes relacionados de um
  mesmo painel (ex.: `ServiceOrchestratorPanel.group` = webapp + webgui + webservices).
- **Package** — unidade instalável/bootável. Tem uma pasta `metadata/`. O sufixo indica
  o tipo: `.app`, `.webapp`, `.webgui`, `.webservice`, `.service`, `.cli`, `.lib`.
- **Executable** — nome registrado em [`../metadata/applications.json`](../metadata/applications.json)
  e usado em `repo install --executables` (ex.: `virtual-desk`, `my-services`). Pode
  diferir do nome do pacote.

## Namespaces e metadados

- **Namespace** — identificador de um pacote/instância usado para declarar dependências
  **sem caminho relativo**. Prefixos: `@/` (referência a pacote no repo), `@@/`
  (instância criada no boot), `@//` (referência interna ao próprio pacote).
- **`package.json` (metadata)** — declara o `namespace` do pacote.
- **`boot.json`** — manifesto de boot: lista os serviços/endpoints que o pacote monta e
  suas dependências por namespace (`bound-params`).
- **`command-group.json`** — árvore de comandos de uma CLI (fonte canônica dos comandos).
- **`startup-params.json`** — valores de inicialização do pacote quando iniciado
  diretamente pelo ecossistema.
- **`*.provision.json`** — descreve um **serviço a provisionar** via `my-services`:
  pacote de origem, `startupParams`, `socketParams`, `storageParams`, rede.

## Execução e operação

- **Supervisor** — componente do ecossistema que mantém e monitora instâncias em
  execução. CLI `supervisor` (instance-supervisor): `sockets`, `status`, `log`, `kill`.
- **Socket do supervisor** — canal de IPC (arquivo em `~/EcosystemData/sockets/`) pelo
  qual os componentes se comunicam (ex.: `iam-socket`, `service-orchestrator.app.sock`).
- **Service / serviço provisionado** — instância criada e gerenciada pelo `my-services`
  a partir de um `*.provision.json`. Tem ID, instâncias e histórico de builds.
- **Control plane** — `service-orchestrator` e `repository-storage-manager`: iniciados
  **direto** pelo ecossistema (não por `my-services`), pois o próprio `my-services`
  depende deles. Ver [`ARQUITETURA.md`](ARQUITETURA.md#control-plane-vs-serviços-provisionados).
- **Ring** — anel de provisionamento, do mais interno (infra/borda) ao mais externo
  (tenants). Define a ordem de boot. Arquivos em
  [`../provisioning-data/`](../provisioning-data) estão organizados por ring.

## Rede e roteamento

- **Transit proxy** (`local-transit-proxy`) — borda única: recebe todo o tráfego na
  porta `9000` e encaminha ao domain router.
- **Domain router** (`local-domain-router-proxy`) — roteia por `Host header` (`*.local`)
  para a porta interna do serviço-alvo.
- **`routeMappingTable`** — tabela `host → target` consultada pelo domain router. Vive em
  [`../provisioning-data/ring0/local-domain-router-proxy.provision.json`](../provisioning-data/ring0/local-domain-router-proxy.provision.json).
- **`*.local`** — hosts virtuais resolvidos para `127.0.0.1` (via `/etc/hosts`) e
  acessados sempre pela porta `9000`.

## IAM

- **IAM** — Identity and Access Management. Serviço `iam-manager`, administrado pela CLI
  `my-iam` e pelo `iam-panel`.
- **Organization** — limite máximo de governança/confiança. Define como o acesso pode
  acontecer; não concede acesso direto.
- **Account / Tenant** — boundary operacional onde usuários, identidades de serviço e
  recursos existem. Uma organização tem várias contas.
- **Scope (escopo)** — nível ao qual um acesso pertence (Organization / Account /
  Project). Nenhum acesso existe sem escopo.
- **Policy (política)** — regra de autorização. Ordem de avaliação: deny explícito →
  allow condicional → default deny.

Detalhes do modelo em
[`../modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md`](../modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md).

## Tenants e containers

- **Tenant** — organização/cliente cujos sites e aplicações são publicados *através* da
  plataforma (Ring 2), vindos de outros repositórios (ex.: `KADISKCorpRepo`,
  `WormsSolutions`).
- **Container** — modo alternativo de deploy (Docker); convenção de portas em
  [`../notes.md`](../notes.md).
