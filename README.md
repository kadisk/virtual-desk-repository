# Virtual Desk Repository

Conjunto de componentes para **construir serviços de nuvem corporativos** sobre o
ecossistema [Meta Platform](https://github.com/Meta-Platform). O *Virtual Desk* é o
painel de controle dessa nuvem privada: a partir dele uma organização provisiona,
publica e monitora seus próprios serviços (sites, APIs, painéis administrativos,
containers de aplicação), com identidade e acesso (IAM), orquestração de serviços,
armazenamento de repositórios e roteamento de domínios — tudo executado e
supervisionado pelo ecossistema.

> Este é um **repositório de pacotes do Meta Platform**. Ele não roda sozinho: seus
> pacotes são registrados e instalados em um ecossistema já provisionado (via
> `mywizard` / `repo`). Para os conceitos da plataforma (Repository → Module → Layer →
> Group → Package, namespaces, metadados, supervisor) consulte a documentação oficial
> em [Meta-Platform/.github](https://github.com/Meta-Platform/.github/tree/main/docs).

## O que tem aqui

O repositório agrupa componentes em dois módulos:

- **`Platform.Module`** — as aplicações que formam a nuvem corporativa: o Virtual Desk,
  os proxies de borda, o orquestrador de serviços, o gerenciador de armazenamento de
  repositórios, o IAM e os painéis administrativos (web).
- **`VirtualDesk.Module`** — os serviços de domínio, webservices e CLIs de operação
  (`my-services`, `my-iam`) consumidos pelas aplicações acima.

O catálogo completo de componentes, suas responsabilidades e dependências está em
[`docs/COMPONENTES.md`](docs/COMPONENTES.md). A visão de arquitetura (módulos, camadas,
o **modelo de rings** e o fluxo de uma requisição) está em
[`docs/ARQUITETURA.md`](docs/ARQUITETURA.md).

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [`docs/ONBOARDING.md`](docs/ONBOARDING.md) | **Comece aqui.** Conceitos mínimos, fluxo de requisição e primeiro boot para quem nunca viu a plataforma. |
| [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) | Módulos, camadas, modelo de rings, control plane e fluxo de requisições/roteamento. |
| [`docs/COMPONENTES.md`](docs/COMPONENTES.md) | Catálogo de todos os pacotes + tabela de nomes canônicos (executável × pacote × host × socket). |
| [`docs/GUIA-OPERACAO.md`](docs/GUIA-OPERACAO.md) | Como registrar o repositório, instalar, provisionar e operar os serviços. |
| [`docs/DEBUG.md`](docs/DEBUG.md) | Diagnóstico e troubleshooting (control plane, sockets, roteamento, IAM, containers). |
| [`docs/GLOSSARIO.md`](docs/GLOSSARIO.md) | Definição curta de cada termo usado na documentação. |
| [`modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md`](modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md) | Modelo conceitual de IAM (organização, conta/tenant, escopo, delegação). |
| [`Research/`](Research) | Pesquisa técnica de apoio (IAM, autorização granular, Keycloak). |

## Início rápido

Com um ecossistema Meta Platform já instalado, registre o repositório como fonte e
instale os executáveis:

```bash
# 1. Registra este repositório no ecossistema (ajuste o caminho local)
repo register source VirtualDeskRepo LOCAL_FS --localPath ~/VirtualDeskRepo

# 2. Instala as CLIs de operação, o control plane e as aplicações
repo install VirtualDeskRepo LOCAL_FS --executables \
  "my-services" "my-iam" \
  "iam-manager" "service-orchestrator" "repository-storage-manager" \
  "local-transit-proxy" "local-domain-router-proxy" \
  "virtual-desk" "iam-panel" "service-panel" \
  "repository-manager-panel" "user-space"

# 3. Atualiza o repositório quando houver mudanças
repo update VirtualDeskRepo
```

> **Por que `my-services` e `my-iam` vêm primeiro:** os serviços são provisionados e
> operados por essas CLIs (registradas como executáveis em
> [`metadata/applications.json`](metadata/applications.json)). Sem elas instaladas, os
> passos seguintes não funcionam.

Depois de instalado, o ecossistema inicia o **control plane** (`service-orchestrator`
e `repository-storage-manager` — eles não têm provision file porque o próprio
`my-services` depende deles) e os demais serviços são provisionados pela CLI
`my-services` a partir dos arquivos em [`provisioning-data/`](provisioning-data). O
passo a passo completo (ordem dos rings, portas, hosts `*.local` e operação no dia a
dia) está em [`docs/GUIA-OPERACAO.md`](docs/GUIA-OPERACAO.md).
