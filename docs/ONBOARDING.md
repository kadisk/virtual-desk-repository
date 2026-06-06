# Onboarding

Guia para quem **nunca viu** a Meta Platform nem o Virtual Desk. Lê em ordem: conceitos
mínimos → como uma requisição flui → primeiro boot → para onde ir depois. Os detalhes
ficam nos documentos referenciados; aqui está o caminho feliz.

## 1. O que é a Meta Platform (neste contexto)

A **Meta Platform** é o runtime/ecossistema sobre o qual este repositório roda. Em uma
frase: ela registra repositórios, instala pacotes, resolve dependências por namespace
(a partir de metadados), executa processos supervisionados e permite que eles se
comuniquem por sockets e HTTP.

Você não precisa dominá-la para começar, mas precisa saber que **este repositório não é
uma aplicação que se executa com `npm start`** — ele é um conjunto de pacotes que a Meta
Platform instala e opera. Conceitos formais:
[documentação oficial](https://github.com/Meta-Platform/.github/tree/main/docs) e
[open standard](https://github.com/Meta-Platform/meta-platform-open-standard).

## 2. O que é o Virtual Desk Repository

Um conjunto de pacotes que implementa uma **nuvem corporativa privada**: o painel de
controle (*Virtual Desk*), IAM (identidade e acesso), orquestração de serviços,
armazenamento de repositórios, proxies de borda, painéis administrativos e as CLIs de
operação (`my-services`, `my-iam`). Veja a visão completa em
[`ARQUITETURA.md`](ARQUITETURA.md) e o catálogo em [`COMPONENTES.md`](COMPONENTES.md).

## 3. Hierarquia mental mínima

Sete conceitos resolvem 90% da confusão inicial. Um mesmo componente tem nomes
diferentes em contextos diferentes — a tabela liga todos:

| Conceito | Exemplo neste repo | O que é |
| --- | --- | --- |
| Repository | `VirtualDeskRepo` | Fonte de pacotes registrada no ecossistema. |
| Module | `Platform.Module` | Agrupa camadas funcionais. |
| Layer | `Applications.layer` | Categoria técnica de pacotes. |
| Group | `ServiceOrchestratorPanel.group` | Reúne webapp + webgui + webservices + serviços de apoio. |
| Package | `virtual-desk.webapp` | Unidade instalável/bootável (tem `metadata/`). |
| Executable | `virtual-desk` | Nome usado em `repo install --executables`. |
| Service | `virtual-desk` provisionado | Instância gerenciada por `my-services`, criada a partir de um `*.provision.json`. |

> A tabela completa de equivalências (executável × pacote × grupo × host × socket ×
> `serviceName`) está em [`COMPONENTES.md`](COMPONENTES.md#nomes-canônicos-executável--pacote--grupo--host--socket).

Há **duas formas** de um pacote subir: o **control plane** (`service-orchestrator` e
`repository-storage-manager`), iniciado direto pelo ecossistema, e os **serviços
provisionados** (todo o resto), criados pelo `my-services`. Entender essa divisão evita
o erro mais comum no primeiro setup — ver [`ARQUITETURA.md`](ARQUITETURA.md#control-plane-vs-serviços-provisionados).

## 4. Como uma requisição atravessa a plataforma

Tudo entra por **uma porta só** (`9000`) e é roteado por nome de host:

1. O navegador acessa `http://virtualdesk.app.local:9000`.
2. O `/etc/hosts` resolve `virtualdesk.app.local` para `127.0.0.1`.
3. O `local-transit-proxy` recebe na porta `9000`.
4. Ele encaminha **tudo** para o `local-domain-router-proxy` na porta `7000`.
5. O domain router lê o `Host header` da requisição.
6. Consulta a `routeMappingTable` e descobre a porta-alvo.
7. Encaminha para `http://localhost:7001`.
8. O `virtual-desk.webapp` atende.

O diagrama está em [`ARQUITETURA.md`](ARQUITETURA.md#3-fluxo-de-uma-requisição).

## 5. Primeiro boot (caminho feliz)

Pré-requisitos: um ecossistema Meta Platform já instalado, com o comando `repo`
disponível, e permissão para editar `/etc/hosts`.

```bash
# 1. Registrar este repositório como fonte
repo register source VirtualDeskRepo LOCAL_FS --localPath ~/VirtualDeskRepo

# 2. Instalar CLIs, control plane e aplicações
repo install VirtualDeskRepo LOCAL_FS --executables \
  "my-services" "my-iam" \
  "iam-manager" "service-orchestrator" "repository-storage-manager" \
  "local-transit-proxy" "local-domain-router-proxy" \
  "virtual-desk" "iam-panel" "service-panel" \
  "repository-manager-panel" "user-space"

# 3. Mapear os hosts locais em /etc/hosts (ver PORTAS na tabela de nomes canônicos)
#    127.0.0.1  virtualdesk.app.local iam-panel.app.local service-panel.app.local ...

# 4. Garantir o control plane no ar (iniciado pelo ecossistema), depois provisionar:
my-services provision ./provisioning-data/ring0/iam-manager.provision.json
my-services provision ./provisioning-data/ring0/local-domain-router-proxy.provision.json
my-services provision ./provisioning-data/ring0/local-transit-proxy.provision.json
my-services provision ./provisioning-data/ring1/virtual-desk.provision.json

# 5. Conferir
my-services services
```

> O passo a passo completo, com **todos** os rings e a ordem exata, está em
> [`GUIA-OPERACAO.md`](GUIA-OPERACAO.md). Se algo não subir, vá para
> [`DEBUG.md`](DEBUG.md).

Depois acesse `http://virtualdesk.app.local:9000` no navegador.

## 6. Criar a organização e o usuário iniciais

```bash
my-iam create organization "Minha Organização"
my-iam create user
my-iam organizations
my-iam users
```

O modelo conceitual de IAM (organização, conta/tenant, escopo, política) está em
[`../modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md`](../modelo_iam_avancado_estrutura_organizacional_e_escopo_enterprise.md).

## 7. Para onde ir depois

| Quero… | Documento |
| --- | --- |
| Entender a arquitetura e os rings | [`ARQUITETURA.md`](ARQUITETURA.md) |
| Saber o que cada pacote faz | [`COMPONENTES.md`](COMPONENTES.md) |
| Operar (instalar, provisionar, atualizar) | [`GUIA-OPERACAO.md`](GUIA-OPERACAO.md) |
| Diagnosticar um problema | [`DEBUG.md`](DEBUG.md) |
| Entender um termo | [`GLOSSARIO.md`](GLOSSARIO.md) |
