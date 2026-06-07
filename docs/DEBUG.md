# Diagnóstico e troubleshooting

Como descobrir por que algo não subiu ou não responde. A ordem importa: comece pelo
control plane, depois sockets, depois rede/roteamento, depois o serviço específico.

> Os comandos `supervisor` vêm da CLI `instance-supervisor` do ecossistema (essential
> repository); `my-services` é a CLI deste repositório. `ss`/`getent`/`curl` são do
> sistema. Ajuste caminhos de socket conforme o seu `EcosystemData`.

## 1. Checklist rápido

```bash
supervisor sockets                       # lista todos os sockets de supervisão
my-services services                     # lista serviços provisionados (com IDs e estado)
ss -lntp | grep -E '7000|7001|7005|7006|8545|9000|9999'   # portas em escuta
getent hosts virtualdesk.app.local       # o host *.local resolve?
curl -H 'Host: virtualdesk.app.local' http://127.0.0.1:9000   # passa pela borda?
```

## 2. O control plane está no ar?

Nada provisionado funciona sem `service-orchestrator` e `repository-storage-manager`
(ver [`ARQUITETURA.md`](ARQUITETURA.md#control-plane-vs-serviços-provisionados)). Eles
expõem sockets em `~/EcosystemData/sockets/`:

```bash
supervisor sockets | grep -E 'service-orchestrator|repository-storage-manager|iam'
supervisor status service-orchestrator.app.sock
supervisor status repository-storage-manager.app.sock
```

- **`my-services` falha ao conectar / timeout:** o control plane não está rodando.
  Confirme que `service-orchestrator` e `repository-storage-manager` foram instalados e
  iniciados pelo ecossistema **antes** de qualquer `provision`.
- **Painéis sobem mas IAM falha:** confirme o `iam-manager` (socket `iam-socket`).

## 3. Inspecionar um serviço provisionado

```bash
my-services services            # ache o ID do serviço
my-services service <id>        # detalhes e estado
my-services instances <id>      # instâncias em execução
my-services builds <id>         # histórico de builds de imagem
```

Para ver o log da instância pelo socket do supervisor:

```bash
supervisor sockets              # descubra o socket do serviço (ex.: virtual-desk.sock)
supervisor log <socket>         # log da instância
supervisor tasks <socket>       # tarefas carregadas no task executor da instância
supervisor kill <socket>        # mata a instância (último recurso)
```

## 4. Erro de roteamento / host

Sintoma: o navegador não abre `http://<host>.local:9000`, ou cai no serviço errado.

1. **O host resolve?**
   ```bash
   getent hosts virtualdesk.app.local      # deve apontar para 127.0.0.1
   ```
   Se não, adicione a entrada em `/etc/hosts`.
2. **A borda responde?**
   ```bash
   curl -i -H 'Host: virtualdesk.app.local' http://127.0.0.1:9000
   ```
   - Sem resposta na `9000` → `local-transit-proxy` não está no ar.
   - Resposta de erro de roteamento → confira a `routeMappingTable` em
     [`../provisioning-data/ring0/local-domain-router-proxy.provision.json`](../provisioning-data/ring0/local-domain-router-proxy.provision.json):
     o `host` precisa existir e o `target` apontar para a porta interna correta.
3. **O serviço-alvo está ouvindo na porta interna?**
   ```bash
   ss -lntp | grep 7001      # ex.: virtual-desk
   curl -i http://127.0.0.1:7001
   ```
   Se a porta interna responde mas a `9000` não chega lá, o problema é na cadeia
   transit-proxy → domain-router (passos 1–2). A tabela de portas internas está em
   [`COMPONENTES.md`](COMPONENTES.md#nomes-canônicos-executável--pacote--grupo--host--socket).

## 5. Erro de IAM / autenticação (JWT)

- Confirme o `iam-manager` (passo 2) e o socket `iam-socket`.
- Crie organização/usuário se o ambiente estiver vazio:
  ```bash
  my-iam organizations
  my-iam users
  ```
- O `virtual-desk.webapp` valida JWT com um `secretKey` (ver
  `startupParams.secretKey` no provision file). Falhas 401/403 logo após o login
  geralmente são `secretKey` divergente ou IAM indisponível.

## 6. Erro de repository storage / provisionamento

- `repository-storage-manager` armazena o código dos repositórios importados. Se um
  `provision`/`update-provision` falha ao encontrar o pacote, confirme que o repositório
  de origem (`repositoryNamespace` do provision file) está importado e que o socket
  `repository-storage-manager.app.sock` responde (passo 2).
- Lembre: `update-provision` exige o serviço **parado**
  (ver [`GUIA-OPERACAO.md`](GUIA-OPERACAO.md#4-operação-no-dia-a-dia)).
