# Guia Completo de Autorização e Acesso Granular

> Documento de referência para estudo, desenho e implementação de **sistemas seguros, escaláveis e corporativos**, com foco em **IAM, autorização granular e arquitetura enterprise**.

---

## 🎯 Objetivo do Documento

Este material tem como objetivo:

- Servir como **base teórica e prática** para construção de sistemas com controle de acesso robusto
- Ajudar no **desenho de um IAM corporativo próprio**
- Consolidar **modelos mentais**, **padrões arquiteturais** e **boas práticas** usadas em sistemas maduros
- Ser **agnóstico de linguagem e framework**

---

## 🧠 Fundamentos: Modelos Mentais Essenciais

### 📖 Autorização como problema teórico

Autorização não é um detalhe de implementação, mas um **problema clássico de ciência da computação aplicada**, envolvendo:

- Teoria de conjuntos
- Lógica booleana e lógica de predicados
- Sistemas distribuídos
- Teoria de decisão
- Controle de estados

Em sistemas modernos, autorização pode ser vista como uma **função pura**:

```
permitido = f(identidade, ação, recurso, contexto)
```

Essa função deve ser:

- **Determinística**
- **Auditável**
- **Explicável**
- **Reprodutível**

---

## 🧠 Autorização vs Autenticação (base conceitual)

| Conceito | Pergunta que responde |
|--------|----------------------|
| Autenticação | Quem é você? |
| Autorização | O que você pode fazer? |

Teoricamente:

- Autenticação prova identidade
- Autorização avalia **direitos**

Misturar ambos leva a arquiteturas frágeis.

---

## 🧠 Princípios Fundamentais de Segurança Aplicados à Autorização

### 1️⃣ Princípio do Menor Privilégio

Formalmente:

> Um sujeito deve possuir apenas os privilégios mínimos necessários para completar sua tarefa.

Impactos arquiteturais:

- Roles pequenas
- Permissões explícitas
- Revogação simples

---

### 2️⃣ Separação de Responsabilidades (SoD)

Origem: segurança organizacional.

Exemplo clássico:

- Quem cria um pagamento não aprova

Modelagem prática:

- Permissões mutuamente exclusivas
- Policies de conflito

---

### 3️⃣ Defesa em Profundidade

Autorização deve existir em **múltiplas camadas**:

- Edge
- Aplicação
- Domínio
- Dados

Nenhuma camada é confiável isoladamente.

---

### 4️⃣ Fail Secure (Negação por padrão)

Teoria:

> Na dúvida, negue.

Implementação:

- Policies explícitas de allow
- Ausência de regra = deny

---

### 5️⃣ Complete Mediation

Todo acesso deve ser verificado, **sempre**.

Erro comum:

- Validar apenas na criação
- Não validar na leitura

---

Antes de qualquer decisão técnica, é essencial compreender **o que é autorização de verdade**.

### 🔑 Definição Formal

> **Autorização** é o processo de decidir **se uma identidade pode executar uma ação específica sobre um recurso específico, dentro de um determinado contexto**.

Formalmente:

```
Autorização = Identidade + Ação + Recurso + Contexto
```

### 1️⃣ Identidade (Who)

Representa **quem está solicitando** a ação.

Inclui:

- Identificador único (`user_id`, `service_id`)
- Atributos:
  - Tenant / Organização
  - Time / Departamento
  - Região
  - Cargo
- Tipo:
  - Usuário humano
  - Serviço (machine-to-machine)

---

### 2️⃣ Ação (What)

Representa **o que está sendo feito**.

Boas práticas:

- Sempre usar **verbos de domínio**, não conceitos de UI
- Ações devem ser **atômicas e auditáveis**

Exemplos:

- `ORDER:CREATE`
- `ORDER:CANCEL`
- `INVOICE:APPROVE`
- `USER:RESET_PASSWORD`

---

### 3️⃣ Recurso (On what)

Representa **sobre o que a ação está sendo executada**.

Tipos de recurso:

- Entidade individual (`order_id = 123`)
- Coleção (`orders`)
- Endpoint
- Job
- Comando

---

### 4️⃣ Contexto (Under which conditions)

Representa **as condições dinâmicas** da autorização.

Exemplos:

- Tenant atual
- Dono do recurso
- Estado do recurso (`status = OPEN`)
- Horário
- Localização

---

## 🧱 Modelos de Controle de Acesso

### 📐 Visão Formal dos Modelos

Do ponto de vista teórico, cada modelo representa uma forma diferente de **mapear sujeitos, objetos e operações**.

Formalmente:

- Sujeito (S)
- Objeto (O)
- Operação (Op)

Autorização decide se:

```
(S, Op, O) ∈ Permissões
```

---

### 1️⃣ RBAC — Role-Based Access Control

```
Usuário → Roles → Permissões
```

#### Exemplo

- `ADMIN`
- `MANAGER`
- `USER`

Cada role agrega permissões:

```
MANAGER → ORDER:CREATE, ORDER:UPDATE
```

#### Vantagens

- Simples de entender
- Fácil de implementar
- Ótimo para backoffice

#### Limitações

- Pouca granularidade
- Não resolve acesso a **dados específicos**

---

### 2️⃣ ABAC — Attribute-Based Access Control

```
Usuário + Recurso + Contexto → Regra
```

#### Exemplo conceitual

```json
{
  "effect": "allow",
  "action": "read",
  "condition": "user.company_id == resource.company_id"
}
```

#### Vantagens

- Alta granularidade
- Ideal para multitenancy
- Permite regras complexas

#### Desafios

- Mais difícil de modelar
- Pode virar caos sem governança

---

### 3️⃣ PBAC — Policy-Based Access Control

Foco em **políticas externas ao código**.

Características:

- Policies versionadas
- Avaliação em runtime
- Separação total entre regra e aplicação

Ferramentas comuns:

- Keycloak Authorization Services
- Open Policy Agent (OPA)
- Casbin

---

### 4️⃣ ACL — Access Control List

```
Recurso → Lista de acessos
```

Exemplo:

```
Documento X:
  user_1 → read
  user_2 → write
```

Usos comuns:

- Documentos
- Arquivos
- Compartilhamentos específicos

---

## 🧩 Modelo Híbrido (Padrão Enterprise)

Sistemas maduros raramente usam um único modelo.

Modelo recomendado:

```
RBAC → define ações possíveis
ABAC → filtra dados
PBAC → valida regras complexas
```

---

## 🏗️ Arquitetura de Autorização Recomendada

```
┌───────────────┐
│ Auth (IAM)    │  → Keycloak / IAM próprio
└───────────────┘
        ↓ JWT / Introspection
┌────────────────────┐
│ API Gateway        │  → valida token
└────────────────────┘
        ↓
┌────────────────────┐
│ Authorization Layer│  → Policies
└────────────────────┘
        ↓
┌────────────────────┐
│ Domain / Use Cases │
└────────────────────┘
        ↓
┌────────────────────┐
│ Database (RLS)     │
└────────────────────┘
```

---

## 🛠️ Boas Práticas de Implementação

### 🔒 Nunca confiar no frontend

- Frontend **não é camada de segurança**
- Backend sempre valida

---

### 🎯 Permissões orientadas a ações

❌ `CAN_ACCESS_SCREEN_X`

✅ `ORDER:CREATE`

---

### 🎟️ Tokens pequenos

Recomenda-se:

```json
{
  "sub": "123",
  "roles": ["manager"],
  "tenant_id": "org_1"
}
```

Evitar:

- Tokens gigantes
- Regras dentro do token

---

### 🧱 Camada central de autorização

Exemplo conceitual:

```
can(user, action, resource)
```

Frameworks:

- CASL (JS)
- Casbin
- OPA (Rego)

---

## 🗄️ Granularidade no Banco de Dados

### Opção 1 — Filtro manual

```sql
SELECT * FROM orders WHERE company_id = :tenant
```

✔ Simples
❌ Sujeito a erro humano

---

### Opção 2 — Views

```sql
CREATE VIEW orders_scoped AS
SELECT * FROM orders
WHERE company_id = current_setting('app.tenant');
```

---

### Opção 3 — Row Level Security (PostgreSQL)

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation
ON orders
USING (company_id = current_setting('app.tenant')::uuid);
```

🔥 Padrão ouro para multitenancy

---

## 🧪 Estratégia de Testes de Autorização

### Testes por papel

- ADMIN → pode tudo
- USER → restrições

---

### Testes por contexto

- Usuário do tenant A não acessa tenant B

---

### Testes negativos

- Esperar `403 Forbidden`

---

## 🧠 Padrões de Design Relacionados

- Policy Object
- Specification Pattern
- Command Pattern
- Middleware / Decorator
- CQRS

---

## ❌ Erros Comuns

- Usar apenas RBAC
- Autorizar só no controller
- Token gigante
- Regras espalhadas
- `if (isAdmin)` em todo código

---

## ✅ Checklist Final

- Autorização no backend
- Policies centralizadas
- RBAC + ABAC combinados
- Filtro de dados obrigatório
- Testes de permissão
- Logs e auditoria
- Revisão periódica de acessos

---

## 🧭 Conclusão

> **Segurança não é um detalhe técnico — é uma decisão de arquitetura.**

Uma boa autorização garante:

- Menor superfície de ataque
- Menos bugs críticos
- Mais confiança para escalar o sistema

---

## 📚 Próximos Passos Sugeridos

- Modelar um IAM próprio
- Integrar com Keycloak / OPA
- Aplicar RLS em produção
- Criar auditoria completa

---

**Documento criado para estudo contínuo e evolução arquitetural.**

