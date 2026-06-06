# Catálogo de componentes

Lista de todos os pacotes do repositório, agrupados por papel. Os **executáveis**
(coluna correspondente) são os nomes registrados em
[`../metadata/applications.json`](../metadata/applications.json) e usados nos comandos
`repo install ... --executables` e na CLI `my-services`.

> **Fonte canônica:** este documento é uma visão humana do catálogo. A referência
> técnica dos executáveis (nome, tipo `APP`/`CLI`, `packageNamespace`, socket) é o
> arquivo [`../metadata/applications.json`](../metadata/applications.json). Em caso de
> divergência, o JSON vence.

## Nomes canônicos (executável × pacote × grupo × host × socket)

Um mesmo componente aparece com nomes diferentes conforme o contexto. A tabela abaixo
desfaz a ambiguidade (note, por exemplo, que o executável é `user-space`, mas o pacote
é `user-space-panel.webapp` e o `serviceName` no provision file é `user-space-panel`):

| Executável (`repo install`) | Pacote | Grupo | Host (`*.local`) | Porta | Socket | `serviceName` no provision |
| --- | --- | --- | --- | --- | --- | --- |
| `virtual-desk` | `virtual-desk.webapp` | — | `virtualdesk.app.local` | `7001` | `virtual-desk.sock` | `virtual-desk` |
| `iam-manager` | `identity-and-access-management.app` | — | — | `iam-socket` | `iam-manager.sock` | `iam-manager` |
| `service-orchestrator` | `service-orchestrator.app` | — | — | socket | `service-orchestrator.sock` | _(control plane, sem provision)_ |
| `repository-storage-manager` | `repository-storage-manager.app` | — | — | socket | `repository-storage-manager.sock` | _(control plane, sem provision)_ |
| `local-transit-proxy` | `local-transit-proxy.app` | — | _(todos)_ | `9000`→`7000` | `local-transit-proxy.sock` | `local-transit-proxy` |
| `local-domain-router-proxy` | `local-domain-router-proxy.app` | — | `*.local` | `7000` | `local-domain-router-proxy.sock` | `local-domain-router-proxy` |
| `iam-panel` | `identity-access-manager-panel.webapp` | `IdentityAccessManagerPanel.group` | `iam-panel.app.local` | `9999` | `iam-panel.sock` | `iam-panel` |
| `service-panel` | `service-orchestrator-panel.webapp` | `ServiceOrchestratorPanel.group` | `service-panel.app.local` | `8545` | `service-panel.sock` | `service-panel` |
| `repository-manager-panel` | `repository-manager-panel.webapp` | `RepositoryManagerPanel.group` | `repository-manager-panel.app.local` | `7006` | `repository-manager-panel.sock` | `repository-manager-panel` |
| `user-space` | `user-space-panel.webapp` | `UserSpacePanel.group` | `user-space.app.local` | `7005` | `user-space.sock` | `user-space-panel` |

> Todos os hosts `*.local` são acessados pelo navegador na porta única **`9000`** (o
> `local-transit-proxy`); a coluna "Porta" acima é a porta **interna** do serviço, para
> onde o `local-domain-router-proxy` encaminha. Ver a `routeMappingTable` em
> [`../provisioning-data/ring0/local-domain-router-proxy.provision.json`](../provisioning-data/ring0/local-domain-router-proxy.provision.json).

## Aplicações da plataforma (`Platform.Module/Applications.layer`)

| Pacote | Executável | Tipo | Descrição |
| --- | --- | --- | --- |
| `virtual-desk.webapp` | `virtual-desk` | webapp | Painel de controle principal da nuvem. Compõe num só processo: workbench (`my-workbench`), monitoração de instâncias, hub de eventos, administração do ecossistema, autenticação (JWT) e gestão de usuários. |
| `service-orchestrator.app` | `service-orchestrator` | app | Orquestrador de serviços e containers. Monta `ServiceOrchestratorManager` sobre o `ContainerManager`. Endpoints exigem autenticação. |
| `repository-storage-manager.app` | `repository-storage-manager` | app | Armazena e serve o código-fonte dos repositórios importados; integra com o `EcosystemData`. |
| `identity-and-access-management.app` | `iam-manager` | app | Serviço de identidade e acesso (organizações, usuários, store SQLite). Dono do `iam-socket`. |
| `local-transit-proxy.app` | `local-transit-proxy` | app | Proxy de trânsito: borda única que encaminha todo o tráfego (`9000`) ao domain router. |
| `local-domain-router-proxy.app` | `local-domain-router-proxy` | app | Proxy de domínio: roteia por Host header (`*.local`) para a porta do serviço-alvo. |

## Painéis administrativos (`Platform.Module/PanelApplications.layer`)

Cada **grupo** (`*.group`) reúne a aplicação web (`webapp`), o front-end (`webgui`),
o webservice de apoio e, quando necessário, serviços adicionais.

| Grupo | Executável (webapp) | Tipo | Descrição |
| --- | --- | --- | --- |
| `IdentityAccessManagerPanel.group` | `iam-panel` | webapp + webgui + webservice | Administração de identidades e acessos; fala com o `iam-manager` via `iam-socket`. |
| `ServiceOrchestratorPanel.group` | `service-panel` | webapp + webgui + webservices + `container-manager.service` | Administração dos serviços em execução; fala com `service-orchestrator` e `repository-storage-manager`. |
| `RepositoryManagerPanel.group` | `repository-manager-panel` | webapp + webgui | Administração de repositórios; fala com `repository-storage-manager`. |
| `UserSpacePanel.group` | `user-space-panel` | webapp + webgui + webservice | Espaço do usuário; consome o IAM. |

> O grupo `ServiceOrchestratorPanel` também contém `service-orchestrator-manager.webservice`
> e `container-manager.webservice`, que expõem o orquestrador e o gerenciador de
> containers ao painel.

## Serviços de domínio (`VirtualDesk.Module/Services.layer`)

Serviços reutilizáveis montados dentro das aplicações via `boot.json` (por namespace).

| Pacote | Usado por | Descrição |
| --- | --- | --- |
| `proxy.service` | transit-proxy, domain-router-proxy | Implementa `TransitProxyService` e `DomainRouterProxyService`. |
| `service-orchestrator.service` | service-orchestrator.app | `ServiceOrchestratorManager`: provisiona/inicia/para serviços. |
| `container-manager.service` | service-orchestrator.app, service-panel | `ContainerManager`: ciclo de vida de containers. |
| `repository-storage-manager.service` | repository-storage-manager.app | Armazenamento do código-fonte de repositórios. |
| `event-manager.service` | virtual-desk.webapp | `EventHubService`: hub de eventos (SQLite). |
| `instance-monitoring.service` | virtual-desk.webapp | `InstanceMonitoringManager`: monitora instâncias em execução. |
| `my-workbench.service` | virtual-desk.webapp | `MyWorkspaceManager`: workspaces do usuário. |
| `user-management.service` | virtual-desk.webapp | `UserManagementService`: contas/sessões, integra com o IAM. |
| `user-space.service` | user-space-panel | Serviço do espaço do usuário. |

## Webservices (`VirtualDesk.Module/Webservices.layer`)

Grupos de endpoints HTTP acoplados ao `HTTPServerService` das aplicações.

| Pacote | Descrição |
| --- | --- |
| `authenticator.webservice` | Autenticação de contas de usuário. |
| `user-management.webservice` | Gestão de contas de usuário. |
| `ecosystem-administrator.webservice` | Configurações do ecossistema. |
| `ecosystem-monitoring.webservice` | Monitoração das atividades do ecossistema. |
| `my-workbench.webservice` | Endpoints do workbench do usuário. |
| `repository-manager.webservice` | Endpoints de gestão de repositórios. |

## Front-ends (`VirtualDesk.Module/UserInterfaces.layer`)

| Pacote | Descrição |
| --- | --- |
| `virtual-desk.webgui` | GUI do painel de controle Virtual Desk (servida pela `virtual-desk.webapp`). |
| `my-apps-panel.webgui` | GUI do painel "minhas aplicações". |

## CLIs de operação (`VirtualDesk.Module/PlatformApplications.layer`)

| Pacote | Executável | Descrição |
| --- | --- | --- |
| `my-service-manager.cli` | `my-services` | Provisiona e gerencia serviços e instâncias. |
| `iam-tools.cli` | `my-iam` | Gerencia organizações e usuários do IAM. |

### `my-services`

| Comando | Descrição |
| --- | --- |
| `services` | Lista todos os serviços provisionados. |
| `service <id>` | Mostra detalhes de um serviço. |
| `start <id>` / `stop <id>` | Inicia / para um serviço. |
| `provision <arquivo.provision.json>` | Provisiona um novo serviço. |
| `update-provision <id> <arquivo>` | Atualiza o provisionamento (serviço deve estar parado). |
| `instances <id>` | Lista as instâncias de um serviço. |
| `builds <id>` | Histórico de builds de imagem. |
| `decommission <id>` | Descomissiona um serviço parado. |
| `terminate <id>` | Encerra um provisionamento em andamento (remove containers). |

### `my-iam`

| Comando | Descrição |
| --- | --- |
| `create organization <name>` | Cria uma organização. |
| `create user` | Cria um usuário. |
| `organizations` / `users` | Lista organizações / usuários. |
| `change organization name <id>` | Altera o nome de uma organização. |
| `delete organization <id>` | Remove uma organização. |

Detalhes e exemplos nos READMEs de cada CLI:
[`my-service-manager.cli`](../VirtualDesk.Module/PlatformApplications.layer/my-service-manager.cli/README.md)
e [`iam-tools.cli`](../VirtualDesk.Module/PlatformApplications.layer/iam-tools.cli/README.md).
