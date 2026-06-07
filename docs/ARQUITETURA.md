# Arquitetura

O **Virtual Desk Repository** entrega uma nuvem corporativa privada como um conjunto
de pacotes do Meta Platform. Esta página descreve como esses pacotes estão organizados,
como se relacionam em tempo de execução (o **modelo de rings**) e como uma requisição
do navegador chega até cada serviço.

> Pré-requisito conceitual: a hierarquia `Repository → Module (*.Module) → Layer
> (*.layer) → Group (*.group) → Package`, os namespaces (`@/`, `@@/`, `@//`) e os
> metadados (`boot.json`, `package.json`, `command-group.json`) são definições do
> **Meta Platform**. Veja a
> [documentação oficial](https://github.com/Meta-Platform/.github/tree/main/docs) e o
> [open standard](https://github.com/Meta-Platform/meta-platform-open-standard).

## 1. Módulos e camadas

O repositório tem dois módulos.

### `Platform.Module` — as aplicações da nuvem

| Camada | Pacotes (executáveis) | Papel |
| --- | --- | --- |
| `Applications.layer` | `virtual-desk.webapp`, `service-orchestrator.app`, `repository-storage-manager.app`, `identity-and-access-management.app`, `local-transit-proxy.app`, `local-domain-router-proxy.app` | As aplicações servidoras que compõem a plataforma e a borda de rede. |
| `PanelApplications.layer` | grupos `IdentityAccessManagerPanel`, `ServiceOrchestratorPanel`, `RepositoryManagerPanel`, `UserSpacePanel` | Painéis administrativos web (cada grupo reúne `webapp` + `webgui` + `webservice` e, quando preciso, serviços de apoio). |

### `VirtualDesk.Module` — serviços, webservices e operação

| Camada | Pacotes | Papel |
| --- | --- | --- |
| `Services.layer` | `event-manager`, `instance-monitoring`, `my-workbench`, `proxy`, `repository-storage-manager`, `service-orchestrator`, `user-management`, `user-space` (todos `.service`) | Serviços de domínio reutilizáveis, montados dentro das aplicações via `boot.json`. |
| `Webservices.layer` | `authenticator`, `ecosystem-administrator`, `ecosystem-monitoring`, `my-workbench`, `repository-manager`, `user-management` (todos `.webservice`) | Grupos de endpoints HTTP acoplados ao servidor das aplicações. |
| `UserInterfaces.layer` | `virtual-desk.webgui`, `my-apps-panel.webgui` | Front-ends (GUI) servidos pelas webapps. |
| `PlatformApplications.layer` | `my-service-manager.cli` (`my-services`), `iam-tools.cli` (`my-iam`) | CLIs de operação. |

> As aplicações **não embutem** seus serviços por caminho relativo: o `boot.json` de
> cada app declara dependências por **namespace** e o supervisor monta o grafo em
> tempo de execução. Por exemplo, `service-orchestrator.app` consome
> `@/service-orchestrator.service/...` e `@/container-manager.service/...`; o
> `virtual-desk.webapp` compõe ~6 webservices e vários serviços num único processo.

## 2. Modelo de rings

Os serviços são provisionados em **rings** (anéis), do mais interno (infraestrutura)
ao mais externo (conteúdo dos tenants). Os arquivos `*.provision.json` em
[`../provisioning-data/`](../provisioning-data) estão organizados exatamente por ring.

### Ring 0 — infraestrutura e borda

A base sobre a qual tudo roda. São aplicações em `networkmode: host`.

| Serviço | Pacote | Porta / socket | Função |
| --- | --- | --- | --- |
| `iam-manager` | `identity-and-access-management.app` | socket `iam-socket` + SQLite | Identidade e acesso (organizações, usuários). É o dono do socket de IAM. |
| `local-domain-router-proxy` | `local-domain-router-proxy.app` | entra na `7000` | Roteia por **Host header** (`*.local`) para a porta do serviço-alvo. |
| `local-transit-proxy` | `local-transit-proxy.app` | entra na `9000` → `7000` | Borda única: recebe **todo** o tráfego e encaminha ao domain router. |

### Ring 1 — a plataforma Virtual Desk

As aplicações de plataforma e seus painéis. Dependem do Ring 0 (IAM e roteamento).

| Serviço | Pacote | Porta | Função |
| --- | --- | --- | --- |
| `virtual-desk` | `virtual-desk.webapp` | `7001` | Painel de controle principal da plataforma (workbench, monitoração, administração do ecossistema, autenticação). |
| `service-panel` | `service-orchestrator-panel.webapp` | `8545` | Painel de administração dos serviços em execução. |
| `iam-panel` | `identity-access-manager-panel.webapp` | `9999` | Painel de administração de identidades e acessos. |
| `user-space-panel` | `user-space-panel.webapp` | `7005` | Espaço/painel do usuário. |
| `repository-manager-panel` | `repository-manager-panel.webapp` | `7006` | Painel de administração de repositórios. |
| `service-orchestrator` | `service-orchestrator.app` | socket | **Control plane.** Orquestra serviços e containers (consumido pelo `service-panel` e pela CLI `my-services`). |
| `repository-storage-manager` | `repository-storage-manager.app` | socket | **Control plane.** Armazena e serve o código-fonte dos repositórios importados. |

> Os painéis (`webapp`) falam com as aplicações de back-end (`service-orchestrator`,
> `repository-storage-manager`, `iam-manager`) por **socket** do supervisor — ver os
> campos `socketParams` nos arquivos de provisionamento.

#### Control plane vs serviços provisionados

Há duas formas de um pacote subir, e a diferença é visível na presença (ou não) de um
arquivo `*.provision.json`:

- **Control plane** — `service-orchestrator` e `repository-storage-manager` **não têm**
  provision file. Eles são iniciados **diretamente pelo ecossistema** (camada de
  execução / supervisor) a partir do próprio `metadata/startup-params.json`. Têm de
  estar no ar **antes** de qualquer provisionamento, porque o `my-services` os consome
  por socket (ver
  [`my-service-manager.cli/metadata/startup-params.json`](../VirtualDesk.Module/PlatformApplications.layer/my-service-manager.cli/metadata/startup-params.json)).
  Não se provisiona o orquestrador com o próprio orquestrador.
- **Serviços provisionados** — todos os demais (proxies, `iam-manager`, painéis,
  `virtual-desk`, tenants) têm um `*.provision.json` e são criados/iniciados pela CLI
  `my-services`, que delega ao `service-orchestrator`.

### Ring 2 — tenants (conteúdo publicado)

Sites e aplicações de cada organização/cliente publicados *através* da plataforma.
Vêm de **outros repositórios** (`KADISKCorpRepo`, `WormsSolutions`), não deste:

| Serviço | Porta | Origem |
| --- | --- | --- |
| `kadisk-com` | `7002` | Portal da KADISK (`KADISKCorpRepo`). |
| `www-worms-solutions` | `7003` | Portal da Worms Solutions (`WormsSolutions`). |
| `_3dservice` / `_3dview` | `8085` / `8081` | Visualizador 3D back/front (`WormsSolutions`). |

Os arquivos em `provisioning-data/ring2/` são exemplos de como a plataforma publica
conteúdo de tenants; servem de referência para provisionar novos sites.

## 3. Fluxo de uma requisição

Toda a entrada passa por uma porta única e é roteada por nome de host:

```
Navegador (http://<host>.local:9000)
      │
      ▼
local-transit-proxy  (entryPort 9000)         ── borda única
      │  encaminha tudo para
      ▼
local-domain-router-proxy  (entryPort 7000)   ── roteia por Host header
      │  routeMappingTable: host → porta
      ├── virtualdesk.app.local            → 7001  (virtual-desk)
      ├── service-panel.app.local          → 8545  (service-panel)
      ├── iam-panel.app.local              → 9999  (iam-panel)
      ├── user-space.app.local             → 7005  (user-space-panel)
      ├── repository-manager-panel.app.local → 7006 (repository-manager-panel)
      ├── kadisk.com.local                 → 7002  (kadisk-com, tenant)
      └── worms.solutions.local            → 7003  (www-worms-solutions, tenant)
```

A tabela de roteamento vive em `routeMappingTable`, dentro de
[`provisioning-data/ring0/local-domain-router-proxy.provision.json`](../provisioning-data/ring0/local-domain-router-proxy.provision.json).
Adicionar um novo serviço web à nuvem é, do ponto de vista da borda, acrescentar uma
entrada `host → target` nessa tabela (além de provisionar o serviço em si).

> Os hosts `*.local` precisam resolver para a máquina (ex.: entradas em `/etc/hosts`).

## 4. Identidade e acesso (IAM)

O `iam-manager` (Ring 0) é o serviço de identidade. Ele expõe, via `boot.json`,
os serviços de domínio `IdentityAndAccessManager`, `UserManager` e
`OrganizationManager` sobre um `IAMPersistentStoreManager` (SQLite). É administrado
pela CLI `my-iam` e pelo `iam-panel`. O `virtual-desk.webapp` consome o IAM por socket
(`iam-socket`) para autenticação (JWT) e gestão de usuários.

O **modelo conceitual** de IAM adotado (organização como limite de governança, conta/
tenant como boundary operacional, escopo explícito de identidades e políticas,
delegação administrativa, ordem de avaliação deny→allow→default-deny) está descrito em
[`../modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md`](../modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md),
com a pesquisa de apoio em [`../Research/`](../Research).

## 5. Convenção de portas (containers)

Quando os serviços são empacotados em containers, a faixa de porta indica o papel do
container. A convenção está em [`../notes.md`](../notes.md):

| Faixa | Uso |
| --- | --- |
| `3XXX` | Containers de desenvolvimento/teste (descartáveis, acessíveis externamente). |
| `8XXX` | Partes expostas (APIs e front-ends) acessíveis externamente. |
| `6XXX` | Serviços de acesso apenas interno. |
| `4XXX` | Persistência de dados (SQLite, Neo4J, MySQL, PostgreSQL, InfluxDB…). |
| `5XXX` | Outros serviços não-plataforma (Python, Kafka, OpenCV…). |
