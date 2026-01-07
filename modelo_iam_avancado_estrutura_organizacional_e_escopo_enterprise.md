# Modelo IAM Avançado — Estrutura Organizacional e Escopo (Enterprise)

## 1. Introdução

Este documento define, de forma **realista e aplicável a ambientes enterprise**, a **Estrutura Organizacional e o Escopo** de um sistema IAM (Identity and Access Management) avançado.

O objetivo é estabelecer **limites claros de responsabilidade, isolamento, governança e delegação**, evitando modelos excessivamente conceituais que falham quando aplicados a:

- SaaS multi-tenant B2B
- Holdings e multinacionais
- Ambientes governamentais
- Plataformas cloud-native e zero trust

Este modelo é inspirado em práticas consolidadas de **AWS Organizations, GCP Resource Manager, Azure AD e Okta**, mantendo independência de fornecedor.

---

## 2. Princípios Arquiteturais

### 2.1 Isolamento como regra

- Cada **Account (Tenant)** é um **boundary de segurança absoluto**.
- Nenhuma identidade, role ou permissão cruza contas sem **delegação explícita**.
- O *blast radius* de um incidente é sempre limitado a uma conta.

### 2.2 Escopo explícito

> Nenhum acesso existe sem escopo.

Todo elemento do IAM pertence claramente a um nível organizacional:

- Organization
- Account
- Sub-account / Project

### 2.3 Governança central, execução local

- A **Organization governa** (define regras)
- As **Accounts executam** (aplicam acessos)

---

## 3. Organização (Organization)

### 3.1 Definição

A **Organization** representa o **limite máximo de confiança, governança e responsabilidade legal**.

Ela **não concede acesso a recursos**, mas define **como o acesso pode acontecer**.

### 3.2 Responsabilidades

A Organization é responsável por:

- Definir políticas globais de segurança
- Estabelecer requisitos mínimos de autenticação
- Centralizar compliance e auditoria
- Controlar criação e encerramento de contas

### 3.3 O que a Organization NÃO faz

- ❌ Não possui usuários operacionais
- ❌ Não possui sessões
- ❌ Não concede permissões diretas

---

### 3.4 Estrutura de Dados

| Campo | Tipo | Descrição |
|------|------|-----------|
| id | UUID | Identificador único |
| name | String | Nome corporativo |
| legal_entity_id | String | Identificador legal (CNPJ, EIN) |
| security_baseline | JSON | Requisitos mínimos obrigatórios |
| compliance_profiles | Array | LGPD, ISO27001, SOC2 |
| status | Enum | Active / Suspended / Decommissioned |
| created_at | Timestamp | Data de criação |

---

### 3.5 Regras de Negócio

- Toda **Account pertence a exatamente uma Organization**
- Políticas organizacionais são **sempre avaliadas primeiro**
- Deny organizacional **não pode ser sobrescrito**

---

## 4. Conta (Account / Tenant)

### 4.1 Definição

A **Account** é o **boundary operacional real do IAM**.

É nela que:

- Usuários existem
- Service identities operam
- Recursos são acessados
- Logs são gerados

### 4.2 Tipos de Conta

| Tipo | Uso típico |
|-----|-----------|
| ROOT | Administração central |
| BUSINESS_UNIT | Filial, diretoria |
| PROJECT | Sistema, produto |
| ENVIRONMENT | DEV / STAGING / PROD |
| CUSTOMER | Cliente SaaS |

---

### 4.3 Estrutura de Dados

| Campo | Tipo | Descrição |
|------|------|-----------|
| id | UUID | Identificador da conta |
| organization_id | UUID | Organização dona |
| parent_account_id | UUID | Hierarquia opcional |
| name | String | Nome amigável |
| type | Enum | ROOT / PROJECT / CUSTOMER |
| environment | Enum | DEV / STAGING / PROD |
| isolation_level | Enum | Strong / Shared |
| created_at | Timestamp | Data de criação |
| status | Enum | Active / Suspended / Archived |

---

### 4.4 Hierarquia de Contas

```
Organization
 └── ROOT Account
     ├── Business Unit A
     │   ├── Project X (DEV)
     │   └── Project X (PROD)
     └── Business Unit B
         └── Customer 001
```

---

### 4.5 Regras de Isolamento

- Usuários pertencem a **uma conta específica**
- O mesmo e-mail pode existir em múltiplas contas
- Sessões nunca atravessam contas

---

## 5. Delegação Administrativa

### 5.1 Conceito

Administração também é governada por IAM.

Não existem "super usuários globais" sem escopo explícito.

---

### 5.2 Escopos Administrativos

| Escopo | Exemplo |
|------|--------|
| Organization | Security Admin |
| Account | Account Admin |
| Project | Project Owner |

---

### 5.3 Modelo Conceitual

```
AdminScope
- scope_type: Organization | Account | Project
- scope_id
- allowed_actions
```

---

## 6. Escopo de Identidades

### 6.1 Regras Fundamentais

| Identidade | Escopo |
|----------|-------|
| User | Account |
| ServiceIdentity | Account |
| Device | User → Account |
| Session | User + Account |

> Uma identidade **nunca existe fora de uma Account**.

---

## 7. Escopo de Políticas

### 7.1 Níveis de Política

| Nível | Finalidade |
|------|-----------|
| Organization | Guardrails globais |
| Account | Controle de acesso |
| Resource | Exceções específicas |

---

### 7.2 Ordem de Avaliação

1. Deny explícito (Organization → Account → Resource)
2. Allow condicional
3. Default Deny

---

## 8. Casos de Uso Reais

### 8.1 SaaS Multi-tenant

- Organization: Provedor SaaS
- Account: Cliente
- Isolamento total entre clientes

### 8.2 Holding Empresarial

- Organization: Holding
- Account: Filiais
- Governança centralizada

### 8.3 Governo

- Organization: Ministério
- Account: Secretaria
- Sub-account: Sistema

---

## 9. Conclusão

Este modelo estabelece uma **estrutura organizacional realista, auditável e escalável**, adequada a ambientes críticos, regulados e multi-tenant.

Ele evita ambiguidade de escopo, reduz riscos de segurança e prepara o IAM para **Zero Trust, compliance e automação avançada**.

