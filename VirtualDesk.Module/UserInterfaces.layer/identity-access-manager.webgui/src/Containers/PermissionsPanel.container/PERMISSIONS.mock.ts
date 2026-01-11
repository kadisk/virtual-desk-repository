export default[
  { "id": "perm-0001", "namespace": "organization", "action": "read", "description": "Visualizar organização" },
  { "id": "perm-0002", "namespace": "organization", "action": "update", "description": "Atualizar dados da organização" },
  { "id": "perm-0003", "namespace": "organization", "action": "delete", "description": "Excluir organização" },

  { "id": "perm-0004", "namespace": "account", "action": "create", "description": "Criar conta" },
  { "id": "perm-0005", "namespace": "account", "action": "read", "description": "Visualizar conta" },
  { "id": "perm-0006", "namespace": "account", "action": "update", "description": "Atualizar conta" },
  { "id": "perm-0007", "namespace": "account", "action": "delete", "description": "Excluir conta" },

  { "id": "perm-0008", "namespace": "user", "action": "create", "description": "Criar usuário" },
  { "id": "perm-0009", "namespace": "user", "action": "read", "description": "Visualizar usuário" },
  { "id": "perm-0010", "namespace": "user", "action": "update", "description": "Atualizar usuário" },
  { "id": "perm-0011", "namespace": "user", "action": "disable", "description": "Desabilitar usuário" },
  { "id": "perm-0012", "namespace": "user", "action": "delete", "description": "Excluir usuário" },

  { "id": "perm-0013", "namespace": "role", "action": "create", "description": "Criar role" },
  { "id": "perm-0014", "namespace": "role", "action": "read", "description": "Visualizar role" },
  { "id": "perm-0015", "namespace": "role", "action": "update", "description": "Atualizar role" },
  { "id": "perm-0016", "namespace": "role", "action": "delete", "description": "Excluir role" },

  { "id": "perm-0017", "namespace": "permission", "action": "assign", "description": "Atribuir permissão a role" },
  { "id": "perm-0018", "namespace": "permission", "action": "revoke", "description": "Revogar permissão de role" },

  { "id": "perm-0019", "namespace": "policy", "action": "create", "description": "Criar política" },
  { "id": "perm-0020", "namespace": "policy", "action": "read", "description": "Visualizar política" },
  { "id": "perm-0021", "namespace": "policy", "action": "update", "description": "Atualizar política" },
  { "id": "perm-0022", "namespace": "policy", "action": "delete", "description": "Excluir política" },
  { "id": "perm-0023", "namespace": "policy", "action": "bind", "description": "Vincular política" },

  { "id": "perm-0024", "namespace": "session", "action": "invalidate", "description": "Invalidar sessão" },
  { "id": "perm-0025", "namespace": "session", "action": "read", "description": "Visualizar sessão" },

  { "id": "perm-0026", "namespace": "audit", "action": "read", "description": "Ler logs de auditoria" },
  { "id": "perm-0027", "namespace": "audit", "action": "export", "description": "Exportar logs de auditoria" },

  { "id": "perm-0028", "namespace": "device", "action": "register", "description": "Registrar dispositivo" },
  { "id": "perm-0029", "namespace": "device", "action": "read", "description": "Visualizar dispositivo" },
  { "id": "perm-0030", "namespace": "device", "action": "block", "description": "Bloquear dispositivo" },

  { "id": "perm-0031", "namespace": "service_identity", "action": "create", "description": "Criar identidade de serviço" },
  { "id": "perm-0032", "namespace": "service_identity", "action": "rotate_credential", "description": "Rotacionar credencial de serviço" },
  { "id": "perm-0033", "namespace": "service_identity", "action": "disable", "description": "Desabilitar identidade de serviço" },

  { "id": "perm-0034", "namespace": "storage", "action": "read", "description": "Ler storage" },
  { "id": "perm-0035", "namespace": "storage", "action": "write", "description": "Gravar storage" },
  { "id": "perm-0036", "namespace": "storage", "action": "delete", "description": "Excluir dados do storage" },

  { "id": "perm-0037", "namespace": "database", "action": "read", "description": "Ler banco de dados" },
  { "id": "perm-0038", "namespace": "database", "action": "write", "description": "Gravar banco de dados" },
  { "id": "perm-0039", "namespace": "database", "action": "admin", "description": "Administrar banco de dados" },

  { "id": "perm-0040", "namespace": "api", "action": "invoke", "description": "Invocar API" },
  { "id": "perm-0041", "namespace": "api", "action": "admin", "description": "Administrar API" },

  { "id": "perm-0042", "namespace": "backup", "action": "create", "description": "Criar backup" },
  { "id": "perm-0043", "namespace": "backup", "action": "restore", "description": "Restaurar backup" },

  { "id": "perm-0044", "namespace": "monitoring", "action": "read", "description": "Visualizar métricas" },
  { "id": "perm-0045", "namespace": "monitoring", "action": "configure", "description": "Configurar monitoramento" },

  { "id": "perm-0046", "namespace": "network", "action": "read", "description": "Visualizar rede" },
  { "id": "perm-0047", "namespace": "network", "action": "update", "description": "Alterar configuração de rede" },

  { "id": "perm-0048", "namespace": "billing", "action": "read", "description": "Visualizar faturamento" },
  { "id": "perm-0049", "namespace": "billing", "action": "manage", "description": "Gerenciar cobrança" },

  { "id": "perm-0050", "namespace": "compliance", "action": "review", "description": "Executar revisão de compliance" }
  ,
{ "id": "perm-0051", "namespace": "identity", "action": "link", "description": "Vincular identidades" },
{ "id": "perm-0052", "namespace": "identity", "action": "unlink", "description": "Desvincular identidades" },

{ "id": "perm-0053", "namespace": "group", "action": "create", "description": "Criar grupo" },
{ "id": "perm-0054", "namespace": "group", "action": "read", "description": "Visualizar grupo" },
{ "id": "perm-0055", "namespace": "group", "action": "update", "description": "Atualizar grupo" },
{ "id": "perm-0056", "namespace": "group", "action": "delete", "description": "Excluir grupo" },
{ "id": "perm-0057", "namespace": "group", "action": "add_member", "description": "Adicionar membro ao grupo" },
{ "id": "perm-0058", "namespace": "group", "action": "remove_member", "description": "Remover membro do grupo" },

{ "id": "perm-0059", "namespace": "access_review", "action": "create", "description": "Criar revisão de acesso" },
{ "id": "perm-0060", "namespace": "access_review", "action": "approve", "description": "Aprovar revisão de acesso" },
{ "id": "perm-0061", "namespace": "access_review", "action": "revoke", "description": "Revogar acesso em revisão" },

{ "id": "perm-0062", "namespace": "risk", "action": "evaluate", "description": "Avaliar risco de identidade" },
{ "id": "perm-0063", "namespace": "risk", "action": "override", "description": "Sobrescrever nível de risco" },

{ "id": "perm-0064", "namespace": "mfa", "action": "enroll", "description": "Registrar MFA" },
{ "id": "perm-0065", "namespace": "mfa", "action": "reset", "description": "Resetar MFA" },
{ "id": "perm-0066", "namespace": "mfa", "action": "enforce", "description": "Forçar MFA" },

{ "id": "perm-0067", "namespace": "token", "action": "issue", "description": "Emitir token" },
{ "id": "perm-0068", "namespace": "token", "action": "revoke", "description": "Revogar token" },
{ "id": "perm-0069", "namespace": "token", "action": "introspect", "description": "Inspecionar token" },

{ "id": "perm-0070", "namespace": "secret", "action": "read", "description": "Ler segredo" },
{ "id": "perm-0071", "namespace": "secret", "action": "write", "description": "Criar ou atualizar segredo" },
{ "id": "perm-0072", "namespace": "secret", "action": "rotate", "description": "Rotacionar segredo" },

{ "id": "perm-0073", "namespace": "kms", "action": "encrypt", "description": "Criptografar dados" },
{ "id": "perm-0074", "namespace": "kms", "action": "decrypt", "description": "Descriptografar dados" },
{ "id": "perm-0075", "namespace": "kms", "action": "admin", "description": "Administrar chaves KMS" },

{ "id": "perm-0076", "namespace": "compute", "action": "read", "description": "Visualizar recursos de computação" },
{ "id": "perm-0077", "namespace": "compute", "action": "start", "description": "Iniciar instância" },
{ "id": "perm-0078", "namespace": "compute", "action": "stop", "description": "Parar instância" },
{ "id": "perm-0079", "namespace": "compute", "action": "terminate", "description": "Encerrar instância" },

{ "id": "perm-0080", "namespace": "container", "action": "deploy", "description": "Deploy de container" },
{ "id": "perm-0081", "namespace": "container", "action": "scale", "description": "Escalar workload" },
{ "id": "perm-0082", "namespace": "container", "action": "delete", "description": "Remover workload" },

{ "id": "perm-0083", "namespace": "kubernetes", "action": "read", "description": "Visualizar cluster Kubernetes" },
{ "id": "perm-0084", "namespace": "kubernetes", "action": "admin", "description": "Administrar cluster Kubernetes" },

{ "id": "perm-0085", "namespace": "ci", "action": "run", "description": "Executar pipeline CI" },
{ "id": "perm-0086", "namespace": "cd", "action": "deploy", "description": "Executar deploy CD" },

{ "id": "perm-0087", "namespace": "log", "action": "read", "description": "Ler logs" },
{ "id": "perm-0088", "namespace": "log", "action": "delete", "description": "Excluir logs" },

{ "id": "perm-0089", "namespace": "alert", "action": "acknowledge", "description": "Reconhecer alerta" },
{ "id": "perm-0090", "namespace": "alert", "action": "configure", "description": "Configurar alertas" },

{ "id": "perm-0091", "namespace": "iot", "action": "register_device", "description": "Registrar dispositivo IoT" },
{ "id": "perm-0092", "namespace": "iot", "action": "update_firmware", "description": "Atualizar firmware IoT" },
{ "id": "perm-0093", "namespace": "iot", "action": "revoke_device", "description": "Revogar dispositivo IoT" },

{ "id": "perm-0094", "namespace": "edge", "action": "deploy", "description": "Deploy em edge computing" },

{ "id": "perm-0095", "namespace": "data_lake", "action": "ingest", "description": "Ingerir dados no data lake" },
{ "id": "perm-0096", "namespace": "data_lake", "action": "query", "description": "Consultar data lake" },

{ "id": "perm-0097", "namespace": "ml", "action": "train", "description": "Treinar modelo de ML" },
{ "id": "perm-0098", "namespace": "ml", "action": "predict", "description": "Executar predição ML" },

{ "id": "perm-0099", "namespace": "feature_flag", "action": "toggle", "description": "Alternar feature flag" },

{ "id": "perm-0100", "namespace": "governance", "action": "approve", "description": "Aprovar ação de governança" }

]
