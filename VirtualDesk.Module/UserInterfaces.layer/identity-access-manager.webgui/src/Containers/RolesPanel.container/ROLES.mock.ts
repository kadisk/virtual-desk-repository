export default [
  { "id": "role-001", "account_id": "acc-00001", "name": "OrganizationAdmin", "description": "Administrador global da organização", "created_at": "2022-01-01T08:00:00Z" },
  { "id": "role-002", "account_id": "acc-00001", "name": "AccountOwner", "description": "Responsável máximo pela conta", "created_at": "2022-01-01T08:05:00Z" },
  { "id": "role-003", "account_id": "acc-00001", "name": "AccountAdmin", "description": "Administrador da conta com poderes operacionais", "created_at": "2022-01-01T08:10:00Z" },
  { "id": "role-004", "account_id": "acc-00001", "name": "IAMAdmin", "description": "Gerenciamento de identidades, roles e policies", "created_at": "2022-01-02T09:00:00Z" },
  { "id": "role-005", "account_id": "acc-00001", "name": "SecurityAdmin", "description": "Administração de segurança e controles de acesso", "created_at": "2022-01-02T09:10:00Z" },

  { "id": "role-006", "account_id": "acc-00002", "name": "ComplianceOfficer", "description": "Responsável por conformidade regulatória e auditorias", "created_at": "2022-02-01T10:00:00Z" },
  { "id": "role-007", "account_id": "acc-00002", "name": "AuditViewer", "description": "Visualização de logs e trilhas de auditoria", "created_at": "2022-02-01T10:10:00Z" },
  { "id": "role-008", "account_id": "acc-00002", "name": "RiskManager", "description": "Gestão de riscos e acessos sensíveis", "created_at": "2022-02-01T10:20:00Z" },

  { "id": "role-009", "account_id": "acc-00003", "name": "CloudAdministrator", "description": "Administração de recursos em cloud", "created_at": "2022-03-01T08:00:00Z" },
  { "id": "role-010", "account_id": "acc-00003", "name": "CloudReadOnly", "description": "Acesso somente leitura a recursos cloud", "created_at": "2022-03-01T08:10:00Z" },

  { "id": "role-011", "account_id": "acc-00004", "name": "DevOpsEngineer", "description": "Operação de CI/CD, infraestrutura e automação", "created_at": "2022-03-10T09:00:00Z" },
  { "id": "role-012", "account_id": "acc-00004", "name": "SRE", "description": "Confiabilidade, observabilidade e resposta a incidentes", "created_at": "2022-03-10T09:10:00Z" },
  { "id": "role-013", "account_id": "acc-00004", "name": "IncidentResponder", "description": "Atuação em incidentes críticos de segurança e operação", "created_at": "2022-03-10T09:20:00Z" },

  { "id": "role-014", "account_id": "acc-00005", "name": "BackendDeveloper", "description": "Desenvolvimento de serviços backend", "created_at": "2022-04-01T08:00:00Z" },
  { "id": "role-015", "account_id": "acc-00005", "name": "FrontendDeveloper", "description": "Desenvolvimento de aplicações frontend", "created_at": "2022-04-01T08:10:00Z" },
  { "id": "role-016", "account_id": "acc-00005", "name": "MobileDeveloper", "description": "Desenvolvimento de aplicações móveis", "created_at": "2022-04-01T08:20:00Z" },

  { "id": "role-017", "account_id": "acc-00006", "name": "DataEngineer", "description": "Pipelines de dados e ingestão", "created_at": "2022-05-01T09:00:00Z" },
  { "id": "role-018", "account_id": "acc-00006", "name": "DataScientist", "description": "Análise avançada e modelos de ML", "created_at": "2022-05-01T09:10:00Z" },
  { "id": "role-019", "account_id": "acc-00006", "name": "DataAnalyst", "description": "Análise e visualização de dados", "created_at": "2022-05-01T09:20:00Z" },

  { "id": "role-020", "account_id": "acc-00007", "name": "MLTrainer", "description": "Treinamento de modelos de machine learning", "created_at": "2022-06-01T08:00:00Z" },
  { "id": "role-021", "account_id": "acc-00007", "name": "MLInferenceOperator", "description": "Operação de inferência e serving de modelos", "created_at": "2022-06-01T08:10:00Z" },

  { "id": "role-022", "account_id": "acc-00008", "name": "DatabaseAdmin", "description": "Administração de bancos de dados", "created_at": "2022-06-15T09:00:00Z" },
  { "id": "role-023", "account_id": "acc-00008", "name": "DatabaseReadOnly", "description": "Leitura de dados em bancos de dados", "created_at": "2022-06-15T09:10:00Z" },

  { "id": "role-024", "account_id": "acc-00009", "name": "NetworkAdmin", "description": "Administração de rede e conectividade", "created_at": "2022-07-01T08:00:00Z" },
  { "id": "role-025", "account_id": "acc-00009", "name": "FirewallOperator", "description": "Gestão de regras de firewall", "created_at": "2022-07-01T08:10:00Z" },

  { "id": "role-026", "account_id": "acc-00010", "name": "IoTDeviceManager", "description": "Gerenciamento de dispositivos IoT", "created_at": "2022-08-01T08:00:00Z" },
  { "id": "role-027", "account_id": "acc-00010", "name": "IoTReadOnly", "description": "Visualização de telemetria IoT", "created_at": "2022-08-01T08:10:00Z" },

  { "id": "role-028", "account_id": "acc-00011", "name": "ManufacturingOperator", "description": "Operação de sistemas industriais", "created_at": "2022-08-15T09:00:00Z" },
  { "id": "role-029", "account_id": "acc-00011", "name": "PLCAdministrator", "description": "Administração de PLCs industriais", "created_at": "2022-08-15T09:10:00Z" },

  { "id": "role-030", "account_id": "acc-00012", "name": "FinanceManager", "description": "Gestão financeira e orçamentária", "created_at": "2022-09-01T08:00:00Z" },
  { "id": "role-031", "account_id": "acc-00012", "name": "BillingOperator", "description": "Operação de faturamento e cobrança", "created_at": "2022-09-01T08:10:00Z" },
  { "id": "role-032", "account_id": "acc-00012", "name": "AccountsPayable", "description": "Contas a pagar", "created_at": "2022-09-01T08:20:00Z" },
  { "id": "role-033", "account_id": "acc-00012", "name": "AccountsReceivable", "description": "Contas a receber", "created_at": "2022-09-01T08:30:00Z" },

  { "id": "role-034", "account_id": "acc-00013", "name": "HRAdmin", "description": "Administração de recursos humanos", "created_at": "2022-09-15T09:00:00Z" },
  { "id": "role-035", "account_id": "acc-00013", "name": "HRViewer", "description": "Consulta de dados de RH", "created_at": "2022-09-15T09:10:00Z" },

  { "id": "role-036", "account_id": "acc-00014", "name": "LegalCounsel", "description": "Gestão jurídica e contratos", "created_at": "2022-10-01T08:00:00Z" },
  { "id": "role-037", "account_id": "acc-00014", "name": "ContractManager", "description": "Gestão de contratos e fornecedores", "created_at": "2022-10-01T08:10:00Z" },

  { "id": "role-038", "account_id": "acc-00015", "name": "SupportAgent", "description": "Atendimento e suporte ao cliente", "created_at": "2022-10-15T09:00:00Z" },
  { "id": "role-039", "account_id": "acc-00015", "name": "SupportSupervisor", "description": "Supervisão de atendimento", "created_at": "2022-10-15T09:10:00Z" },

  { "id": "role-040", "account_id": "acc-00016", "name": "ProductManager", "description": "Gestão de produto e roadmap", "created_at": "2022-11-01T08:00:00Z" },
  { "id": "role-041", "account_id": "acc-00016", "name": "UXDesigner", "description": "Design de experiência do usuário", "created_at": "2022-11-01T08:10:00Z" },

  { "id": "role-042", "account_id": "acc-00017", "name": "SalesManager", "description": "Gestão comercial e vendas", "created_at": "2022-11-15T09:00:00Z" },
  { "id": "role-043", "account_id": "acc-00017", "name": "SalesRepresentative", "description": "Execução de vendas", "created_at": "2022-11-15T09:10:00Z" },

  { "id": "role-044", "account_id": "acc-00018", "name": "MarketingManager", "description": "Gestão de marketing e campanhas", "created_at": "2022-12-01T08:00:00Z" },
  { "id": "role-045", "account_id": "acc-00018", "name": "ContentEditor", "description": "Criação e edição de conteúdo", "created_at": "2022-12-01T08:10:00Z" },

  { "id": "role-046", "account_id": "acc-00019", "name": "SupplyChainManager", "description": "Gestão da cadeia de suprimentos", "created_at": "2023-01-01T08:00:00Z" },
  { "id": "role-047", "account_id": "acc-00019", "name": "LogisticsOperator", "description": "Operação logística e transporte", "created_at": "2023-01-01T08:10:00Z" },

  { "id": "role-048", "account_id": "acc-00020", "name": "WarehouseManager", "description": "Gestão de armazém", "created_at": "2023-01-15T09:00:00Z" },
  { "id": "role-049", "account_id": "acc-00020", "name": "InventoryClerk", "description": "Controle de inventário", "created_at": "2023-01-15T09:10:00Z" },

  { "id": "role-050", "account_id": "acc-00021", "name": "ReadOnlyUser", "description": "Usuário com acesso somente leitura", "created_at": "2023-02-01T08:00:00Z" },

  { "id": "role-051", "account_id": "acc-00022", "name": "SOCAnalyst", "description": "Analista de Centro de Operações de Segurança (SOC)", "created_at": "2023-02-15T09:00:00Z" },
  { "id": "role-052", "account_id": "acc-00022", "name": "ThreatHunter", "description": "Busca ativa por ameaças avançadas", "created_at": "2023-02-15T09:10:00Z" },
  { "id": "role-053", "account_id": "acc-00022", "name": "BlueTeamEngineer", "description": "Defesa e hardening de sistemas", "created_at": "2023-02-15T09:20:00Z" },
  { "id": "role-054", "account_id": "acc-00022", "name": "RedTeamOperator", "description": "Testes de intrusão e simulações ofensivas", "created_at": "2023-02-15T09:30:00Z" },

  { "id": "role-055", "account_id": "acc-00023", "name": "ZeroTrustArchitect", "description": "Arquitetura de segurança Zero Trust", "created_at": "2023-03-01T08:00:00Z" },
  { "id": "role-056", "account_id": "acc-00023", "name": "IdentityArchitect", "description": "Arquitetura de identidades e acessos", "created_at": "2023-03-01T08:10:00Z" },

  { "id": "role-057", "account_id": "acc-00024", "name": "PlatformEngineer", "description": "Engenharia de plataformas internas", "created_at": "2023-03-15T09:00:00Z" },
  { "id": "role-058", "account_id": "acc-00024", "name": "InternalDeveloperPlatformAdmin", "description": "Administração de plataforma de desenvolvimento", "created_at": "2023-03-15T09:10:00Z" },

  { "id": "role-059", "account_id": "acc-00025", "name": "KubernetesAdmin", "description": "Administração de clusters Kubernetes", "created_at": "2023-04-01T08:00:00Z" },
  { "id": "role-060", "account_id": "acc-00025", "name": "KubernetesReadOnly", "description": "Visualização de recursos Kubernetes", "created_at": "2023-04-01T08:10:00Z" },

  { "id": "role-061", "account_id": "acc-00026", "name": "FinOpsManager", "description": "Gestão de custos e otimização financeira em cloud", "created_at": "2023-04-15T09:00:00Z" },
  { "id": "role-062", "account_id": "acc-00026", "name": "CloudCostAnalyst", "description": "Análise de gastos e relatórios financeiros cloud", "created_at": "2023-04-15T09:10:00Z" },

  { "id": "role-063", "account_id": "acc-00027", "name": "DataGovernanceLead", "description": "Governança e qualidade de dados", "created_at": "2023-05-01T08:00:00Z" },
  { "id": "role-064", "account_id": "acc-00027", "name": "DataSteward", "description": "Gestão operacional de domínios de dados", "created_at": "2023-05-01T08:10:00Z" },

  { "id": "role-065", "account_id": "acc-00028", "name": "PrivacyOfficer", "description": "Proteção de dados e privacidade (LGPD/GDPR)", "created_at": "2023-05-15T09:00:00Z" },
  { "id": "role-066", "account_id": "acc-00028", "name": "ConsentManager", "description": "Gestão de consentimentos e preferências", "created_at": "2023-05-15T09:10:00Z" },

  { "id": "role-067", "account_id": "acc-00029", "name": "AIEngineer", "description": "Desenvolvimento de sistemas de IA", "created_at": "2023-06-01T08:00:00Z" },
  { "id": "role-068", "account_id": "acc-00029", "name": "AIGovernanceOfficer", "description": "Governança, ética e controle de IA", "created_at": "2023-06-01T08:10:00Z" },

  { "id": "role-069", "account_id": "acc-00030", "name": "EdgeComputingAdmin", "description": "Administração de infraestrutura de edge computing", "created_at": "2023-06-15T09:00:00Z" },
  { "id": "role-070", "account_id": "acc-00030", "name": "EdgeDeviceOperator", "description": "Operação de dispositivos edge", "created_at": "2023-06-15T09:10:00Z" },

  { "id": "role-071", "account_id": "acc-00031", "name": "IoTSecuritySpecialist", "description": "Segurança aplicada a ambientes IoT", "created_at": "2023-07-01T08:00:00Z" },
  { "id": "role-072", "account_id": "acc-00031", "name": "IoTFirmwareEngineer", "description": "Desenvolvimento e atualização de firmware IoT", "created_at": "2023-07-01T08:10:00Z" },

  { "id": "role-073", "account_id": "acc-00032", "name": "OTSecurityEngineer", "description": "Segurança de sistemas industriais (OT)", "created_at": "2023-07-15T09:00:00Z" },
  { "id": "role-074", "account_id": "acc-00032", "name": "SCADAOperator", "description": "Operação de sistemas SCADA", "created_at": "2023-07-15T09:10:00Z" },

  { "id": "role-075", "account_id": "acc-00033", "name": "ReleaseManager", "description": "Gestão de releases e versionamento", "created_at": "2023-08-01T08:00:00Z" },
  { "id": "role-076", "account_id": "acc-00033", "name": "ChangeManager", "description": "Gestão de mudanças e controle ITIL", "created_at": "2023-08-01T08:10:00Z" },

  { "id": "role-077", "account_id": "acc-00034", "name": "BusinessAnalyst", "description": "Análise de requisitos de negócio", "created_at": "2023-08-15T09:00:00Z" },
  { "id": "role-078", "account_id": "acc-00034", "name": "ProcessOwner", "description": "Dono e responsável por processos corporativos", "created_at": "2023-08-15T09:10:00Z" },

  { "id": "role-079", "account_id": "acc-00035", "name": "APIProductOwner", "description": "Gestão de produtos baseados em APIs", "created_at": "2023-09-01T08:00:00Z" },
  { "id": "role-080", "account_id": "acc-00035", "name": "APIGatewayAdmin", "description": "Administração de gateways de API", "created_at": "2023-09-01T08:10:00Z" },

  { "id": "role-081", "account_id": "acc-00036", "name": "ObservabilityEngineer", "description": "Métricas, logs e tracing distribuído", "created_at": "2023-09-15T09:00:00Z" },
  { "id": "role-082", "account_id": "acc-00036", "name": "TelemetryViewer", "description": "Visualização de dados de telemetria", "created_at": "2023-09-15T09:10:00Z" },

  { "id": "role-083", "account_id": "acc-00037", "name": "BackupAdministrator", "description": "Gestão de backups e recuperação", "created_at": "2023-10-01T08:00:00Z" },
  { "id": "role-084", "account_id": "acc-00037", "name": "DisasterRecoveryManager", "description": "Planejamento e execução de DR", "created_at": "2023-10-01T08:10:00Z" },

  { "id": "role-085", "account_id": "acc-00038", "name": "EncryptionKeyManager", "description": "Gestão de chaves criptográficas", "created_at": "2023-10-15T09:00:00Z" },
  { "id": "role-086", "account_id": "acc-00038", "name": "SecretsAdministrator", "description": "Gestão de segredos e cofres", "created_at": "2023-10-15T09:10:00Z" },

  { "id": "role-087", "account_id": "acc-00039", "name": "ServiceMeshAdmin", "description": "Administração de service mesh", "created_at": "2023-11-01T08:00:00Z" },
  { "id": "role-088", "account_id": "acc-00039", "name": "TrafficPolicyOperator", "description": "Controle de tráfego e políticas de rede", "created_at": "2023-11-01T08:10:00Z" },

  { "id": "role-089", "account_id": "acc-00040", "name": "SandboxEnvironmentAdmin", "description": "Administração de ambientes de sandbox", "created_at": "2023-11-15T09:00:00Z" },
  { "id": "role-090", "account_id": "acc-00040", "name": "ExperimentationUser", "description": "Execução de testes e experimentos", "created_at": "2023-11-15T09:10:00Z" },

  { "id": "role-091", "account_id": "acc-00041", "name": "KnowledgeBaseEditor", "description": "Gestão de base de conhecimento", "created_at": "2023-12-01T08:00:00Z" },
  { "id": "role-092", "account_id": "acc-00041", "name": "DocumentationViewer", "description": "Consulta de documentação técnica", "created_at": "2023-12-01T08:10:00Z" },

  { "id": "role-093", "account_id": "acc-00042", "name": "TrainingAdministrator", "description": "Gestão de treinamentos corporativos", "created_at": "2023-12-15T09:00:00Z" },
  { "id": "role-094", "account_id": "acc-00042", "name": "Learner", "description": "Usuário participante de treinamentos", "created_at": "2023-12-15T09:10:00Z" },

  { "id": "role-095", "account_id": "acc-00043", "name": "ExternalPartnerAdmin", "description": "Gestão de acessos de parceiros externos", "created_at": "2024-01-01T08:00:00Z" },
  { "id": "role-096", "account_id": "acc-00043", "name": "ExternalPartnerUser", "description": "Usuário parceiro com acesso restrito", "created_at": "2024-01-01T08:10:00Z" },

  { "id": "role-097", "account_id": "acc-00044", "name": "TemporaryAccessUser", "description": "Acesso temporário com expiração automática", "created_at": "2024-01-15T09:00:00Z" },
  { "id": "role-098", "account_id": "acc-00044", "name": "BreakGlassAdmin", "description": "Acesso emergencial de contingência", "created_at": "2024-01-15T09:10:00Z" },

  { "id": "role-099", "account_id": "acc-00045", "name": "PolicyAuthor", "description": "Criação e manutenção de políticas de acesso", "created_at": "2024-02-01T08:00:00Z" },
  { "id": "role-100", "account_id": "acc-00045", "name": "PolicyReviewer", "description": "Revisão e aprovação de políticas", "created_at": "2024-02-01T08:10:00Z" }
]
