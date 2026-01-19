export default [
  {
    "id": "pol-0001",
    "name": "Deny Blocked Devices",
    "effect": "Deny",
    "priority": 0,
    "resource_pattern": "*",
    "condition_expression": { "device.trust_state": "Blocked" },
    "status": "Active",
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "pol-0002",
    "name": "Deny Suspended Accounts",
    "effect": "Deny",
    "priority": 1,
    "resource_pattern": "*",
    "condition_expression": { "account.status": "Suspended" },
    "status": "Active",
    "created_at": "2024-01-01T00:01:00Z"
  },
  {
    "id": "pol-0003",
    "name": "Deny High Risk Users",
    "effect": "Deny",
    "priority": 2,
    "resource_pattern": "*",
    "condition_expression": { "user.risk_level": "High" },
    "status": "Active",
    "created_at": "2024-01-01T00:02:00Z"
  },
  {
    "id": "pol-0004",
    "name": "Require MFA for Privileged Access",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "admin/*",
    "condition_expression": { "session.mfa_verified": false },
    "status": "Active",
    "created_at": "2024-01-01T00:03:00Z"
  },
  {
    "id": "pol-0005",
    "name": "Allow Trusted Devices",
    "effect": "Allow",
    "priority": 20,
    "resource_pattern": "*",
    "condition_expression": { "device.trust_state": "Trusted" },
    "status": "Active",
    "created_at": "2024-01-01T00:04:00Z"
  },

  {
    "id": "pol-0006",
    "name": "Deny Unknown Devices",
    "effect": "Deny",
    "priority": 5,
    "resource_pattern": "*",
    "condition_expression": { "device.trust_state": "Unknown" },
    "status": "Active",
    "created_at": "2024-01-01T00:05:00Z"
  },
  {
    "id": "pol-0007",
    "name": "Allow Business Hours Only",
    "effect": "Allow",
    "priority": 50,
    "resource_pattern": "*",
    "condition_expression": { "time.hour": [8, 18] },
    "status": "Active",
    "created_at": "2024-01-01T00:06:00Z"
  },
  {
    "id": "pol-0008",
    "name": "Deny Outside Business Hours",
    "effect": "Deny",
    "priority": 10,
    "resource_pattern": "*",
    "condition_expression": { "time.hour_not_in": [8, 18] },
    "status": "Active",
    "created_at": "2024-01-01T00:07:00Z"
  },
  {
    "id": "pol-0009",
    "name": "Allow Corporate Network",
    "effect": "Allow",
    "priority": 40,
    "resource_pattern": "*",
    "condition_expression": { "network.zone": "Corporate" },
    "status": "Active",
    "created_at": "2024-01-01T00:08:00Z"
  },
  {
    "id": "pol-0010",
    "name": "Deny External Network Admin Access",
    "effect": "Deny",
    "priority": 4,
    "resource_pattern": "admin/*",
    "condition_expression": { "network.zone": "External" },
    "status": "Active",
    "created_at": "2024-01-01T00:09:00Z"
  },

  {
    "id": "pol-0011",
    "name": "Allow Cloud ReadOnly",
    "effect": "Allow",
    "priority": 60,
    "resource_pattern": "cloud/*/read",
    "condition_expression": { "trust_scope": "READ_ONLY" },
    "status": "Active",
    "created_at": "2024-01-02T00:00:00Z"
  },
  {
    "id": "pol-0012",
    "name": "Deny Cloud Delete Operations",
    "effect": "Deny",
    "priority": 6,
    "resource_pattern": "cloud/*/delete",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-02T00:01:00Z"
  },
  {
    "id": "pol-0013",
    "name": "Require MFA for Cloud Write",
    "effect": "Deny",
    "priority": 7,
    "resource_pattern": "cloud/*/write",
    "condition_expression": { "session.mfa_verified": false },
    "status": "Active",
    "created_at": "2024-01-02T00:02:00Z"
  },
  {
    "id": "pol-0014",
    "name": "Allow CI/CD Pipelines",
    "effect": "Allow",
    "priority": 30,
    "resource_pattern": "cloud/iac/*",
    "condition_expression": { "service.name": "ci-cd-runner" },
    "status": "Active",
    "created_at": "2024-01-02T00:03:00Z"
  },
  {
    "id": "pol-0015",
    "name": "Deny Manual Production Changes",
    "effect": "Deny",
    "priority": 8,
    "resource_pattern": "cloud/prod/*",
    "condition_expression": { "actor.type": "User" },
    "status": "Active",
    "created_at": "2024-01-02T00:04:00Z"
  },

  {
    "id": "pol-0016",
    "name": "Allow Encrypted Storage Only",
    "effect": "Allow",
    "priority": 35,
    "resource_pattern": "storage/*",
    "condition_expression": { "resource.encrypted": true },
    "status": "Active",
    "created_at": "2024-01-02T00:05:00Z"
  },
  {
    "id": "pol-0017",
    "name": "Deny Unencrypted Storage",
    "effect": "Deny",
    "priority": 2,
    "resource_pattern": "storage/*",
    "condition_expression": { "resource.encrypted": false },
    "status": "Active",
    "created_at": "2024-01-02T00:06:00Z"
  },
  {
    "id": "pol-0018",
    "name": "Deny Public Buckets",
    "effect": "Deny",
    "priority": 1,
    "resource_pattern": "storage/*",
    "condition_expression": { "resource.public": true },
    "status": "Active",
    "created_at": "2024-01-02T00:07:00Z"
  },
  {
    "id": "pol-0019",
    "name": "Allow Backup Operations",
    "effect": "Allow",
    "priority": 70,
    "resource_pattern": "backup/*",
    "condition_expression": { "role": "BackupAdministrator" },
    "status": "Active",
    "created_at": "2024-01-02T00:08:00Z"
  },
  {
    "id": "pol-0020",
    "name": "Deny Backup Delete",
    "effect": "Deny",
    "priority": 5,
    "resource_pattern": "backup/*/delete",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-02T00:09:00Z"
  },

  {
    "id": "pol-0021",
    "name": "Allow IoT Devices with Certificate",
    "effect": "Allow",
    "priority": 40,
    "resource_pattern": "iot/*",
    "condition_expression": {
      "device.device_type": "IOT",
      "auth.method": "CERTIFICATE"
    },
    "status": "Active",
    "created_at": "2024-01-03T00:00:00Z"
  },
  {
    "id": "pol-0022",
    "name": "Deny IoT without Certificate",
    "effect": "Deny",
    "priority": 1,
    "resource_pattern": "iot/*",
    "condition_expression": {
      "auth.method_not": "CERTIFICATE"
    },
    "status": "Active",
    "created_at": "2024-01-03T00:01:00Z"
  },
  {
    "id": "pol-0023",
    "name": "Allow Firmware Update in Maintenance Window",
    "effect": "Allow",
    "priority": 60,
    "resource_pattern": "iot/firmware/update",
    "condition_expression": {
      "time.window": "maintenance"
    },
    "status": "Active",
    "created_at": "2024-01-03T00:02:00Z"
  },
  {
    "id": "pol-0024",
    "name": "Deny Firmware Update Outside Window",
    "effect": "Deny",
    "priority": 5,
    "resource_pattern": "iot/firmware/update",
    "condition_expression": {
      "time.window_not": "maintenance"
    },
    "status": "Active",
    "created_at": "2024-01-03T00:03:00Z"
  },
  {
    "id": "pol-0025",
    "name": "Allow Edge Trusted Nodes",
    "effect": "Allow",
    "priority": 45,
    "resource_pattern": "edge/*",
    "condition_expression": {
      "device.trust_state": "Trusted"
    },
    "status": "Active",
    "created_at": "2024-01-03T00:04:00Z"
  }

  ,
  {
    "id": "pol-0026",
    "name": "Deny Unknown Edge Nodes",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "edge/*",
    "condition_expression": { "device.trust_state": "Unknown" },
    "status": "Active",
    "created_at": "2024-01-03T00:05:00Z"
  },
  {
    "id": "pol-0027",
    "name": "Allow Kubernetes ReadOnly",
    "effect": "Allow",
    "priority": 60,
    "resource_pattern": "k8s/*/read",
    "condition_expression": { "trust_scope": "READ_ONLY" },
    "status": "Active",
    "created_at": "2024-01-04T00:00:00Z"
  },
  {
    "id": "pol-0028",
    "name": "Deny Kubernetes Exec",
    "effect": "Deny",
    "priority": 4,
    "resource_pattern": "k8s/*/exec",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-04T00:01:00Z"
  },
  {
    "id": "pol-0029",
    "name": "Allow Kubernetes Admins",
    "effect": "Allow",
    "priority": 40,
    "resource_pattern": "k8s/*",
    "condition_expression": { "role": "KubernetesAdmin" },
    "status": "Active",
    "created_at": "2024-01-04T00:02:00Z"
  },
  {
    "id": "pol-0030",
    "name": "Require MFA for Kubernetes Write",
    "effect": "Deny",
    "priority": 5,
    "resource_pattern": "k8s/*/write",
    "condition_expression": { "session.mfa_verified": false },
    "status": "Active",
    "created_at": "2024-01-04T00:03:00Z"
  },

  {
    "id": "pol-0031",
    "name": "Allow API Read",
    "effect": "Allow",
    "priority": 70,
    "resource_pattern": "api/*/read",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-05T00:00:00Z"
  },
  {
    "id": "pol-0032",
    "name": "Deny API Write for External Partners",
    "effect": "Deny",
    "priority": 6,
    "resource_pattern": "api/*/write",
    "condition_expression": { "actor.type": "ExternalPartner" },
    "status": "Active",
    "created_at": "2024-01-05T00:01:00Z"
  },
  {
    "id": "pol-0033",
    "name": "Allow API Gateway Admin",
    "effect": "Allow",
    "priority": 45,
    "resource_pattern": "api/gateway/*",
    "condition_expression": { "role": "APIGatewayAdmin" },
    "status": "Active",
    "created_at": "2024-01-05T00:02:00Z"
  },
  {
    "id": "pol-0034",
    "name": "Require Rate Limit Enforcement",
    "effect": "Deny",
    "priority": 7,
    "resource_pattern": "api/*",
    "condition_expression": { "api.rate_limit_applied": false },
    "status": "Active",
    "created_at": "2024-01-05T00:03:00Z"
  },
  {
    "id": "pol-0035",
    "name": "Allow Service-to-Service Communication",
    "effect": "Allow",
    "priority": 80,
    "resource_pattern": "service/*",
    "condition_expression": { "actor.type": "ServiceIdentity" },
    "status": "Active",
    "created_at": "2024-01-05T00:04:00Z"
  },

  {
    "id": "pol-0036",
    "name": "Deny Cross-Account Access",
    "effect": "Deny",
    "priority": 2,
    "resource_pattern": "*",
    "condition_expression": { "account.cross_access": true },
    "status": "Active",
    "created_at": "2024-01-06T00:00:00Z"
  },
  {
    "id": "pol-0037",
    "name": "Allow Same Account Access",
    "effect": "Allow",
    "priority": 90,
    "resource_pattern": "*",
    "condition_expression": { "account.cross_access": false },
    "status": "Active",
    "created_at": "2024-01-06T00:01:00Z"
  },
  {
    "id": "pol-0038",
    "name": "Deny Data Export Without Approval",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "data/export",
    "condition_expression": { "approval.granted": false },
    "status": "Active",
    "created_at": "2024-01-06T00:02:00Z"
  },
  {
    "id": "pol-0039",
    "name": "Allow Data Analyst Read",
    "effect": "Allow",
    "priority": 65,
    "resource_pattern": "data/*/read",
    "condition_expression": { "role": "DataAnalyst" },
    "status": "Active",
    "created_at": "2024-01-06T00:03:00Z"
  },
  {
    "id": "pol-0040",
    "name": "Deny PII Access Without Clearance",
    "effect": "Deny",
    "priority": 1,
    "resource_pattern": "data/pii/*",
    "condition_expression": { "user.clearance": false },
    "status": "Active",
    "created_at": "2024-01-06T00:04:00Z"
  }
,
  {
    "id": "pol-0041",
    "name": "Allow Backup Operations",
    "effect": "Allow",
    "priority": 75,
    "resource_pattern": "backup/*",
    "condition_expression": { "actor.type": "ServiceIdentity" },
    "status": "Active",
    "created_at": "2024-01-07T00:00:00Z"
  },
  {
    "id": "pol-0042",
    "name": "Deny Backup Deletion",
    "effect": "Deny",
    "priority": 2,
    "resource_pattern": "backup/*/delete",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-07T00:01:00Z"
  },
  {
    "id": "pol-0043",
    "name": "Allow Security Audit Read",
    "effect": "Allow",
    "priority": 85,
    "resource_pattern": "audit/*/read",
    "condition_expression": { "role": "SecurityAuditor" },
    "status": "Active",
    "created_at": "2024-01-07T00:02:00Z"
  },
  {
    "id": "pol-0044",
    "name": "Deny Audit Log Modification",
    "effect": "Deny",
    "priority": 1,
    "resource_pattern": "audit/*/write",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-07T00:03:00Z"
  },
  {
    "id": "pol-0045",
    "name": "Require Secure Channel for Audit Access",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "audit/*",
    "condition_expression": { "connection.secure": false },
    "status": "Active",
    "created_at": "2024-01-07T00:04:00Z"
  },

  {
    "id": "pol-0046",
    "name": "Allow Database Read",
    "effect": "Allow",
    "priority": 70,
    "resource_pattern": "db/*/read",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-08T00:00:00Z"
  },
  {
    "id": "pol-0047",
    "name": "Deny Database Write from IoT Devices",
    "effect": "Deny",
    "priority": 4,
    "resource_pattern": "db/*/write",
    "condition_expression": { "device.category": "IoT" },
    "status": "Active",
    "created_at": "2024-01-08T00:01:00Z"
  },
  {
    "id": "pol-0048",
    "name": "Allow Database Admin Full Access",
    "effect": "Allow",
    "priority": 40,
    "resource_pattern": "db/*",
    "condition_expression": { "role": "DatabaseAdmin" },
    "status": "Active",
    "created_at": "2024-01-08T00:02:00Z"
  },
  {
    "id": "pol-0049",
    "name": "Require Encryption for Database Connections",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "db/*",
    "condition_expression": { "connection.encrypted": false },
    "status": "Active",
    "created_at": "2024-01-08T00:03:00Z"
  },
  {
    "id": "pol-0050",
    "name": "Deny Cross-Region Database Access",
    "effect": "Deny",
    "priority": 2,
    "resource_pattern": "db/*",
    "condition_expression": { "region.mismatch": true },
    "status": "Active",
    "created_at": "2024-01-08T00:04:00Z"
  },

  {
    "id": "pol-0051",
    "name": "Allow Messaging Publish",
    "effect": "Allow",
    "priority": 80,
    "resource_pattern": "mq/*/publish",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-09T00:00:00Z"
  },
  {
    "id": "pol-0052",
    "name": "Allow Messaging Consume",
    "effect": "Allow",
    "priority": 80,
    "resource_pattern": "mq/*/consume",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-09T00:01:00Z"
  },
  {
    "id": "pol-0053",
    "name": "Deny Messaging Admin from External Network",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "mq/*",
    "condition_expression": { "network.trust_zone": "External" },
    "status": "Active",
    "created_at": "2024-01-09T00:02:00Z"
  },
  {
    "id": "pol-0054",
    "name": "Allow Messaging Admin",
    "effect": "Allow",
    "priority": 45,
    "resource_pattern": "mq/*",
    "condition_expression": { "role": "MessagingAdmin" },
    "status": "Active",
    "created_at": "2024-01-09T00:03:00Z"
  },
  {
    "id": "pol-0055",
    "name": "Require Quota Enforcement for Messaging",
    "effect": "Deny",
    "priority": 4,
    "resource_pattern": "mq/*",
    "condition_expression": { "quota.exceeded": true },
    "status": "Active",
    "created_at": "2024-01-09T00:04:00Z"
  },

  {
    "id": "pol-0056",
    "name": "Allow File Storage Read",
    "effect": "Allow",
    "priority": 75,
    "resource_pattern": "storage/*/read",
    "condition_expression": {},
    "status": "Active",
    "created_at": "2024-01-10T00:00:00Z"
  },
  {
    "id": "pol-0057",
    "name": "Deny Public File Upload",
    "effect": "Deny",
    "priority": 2,
    "resource_pattern": "storage/*/write",
    "condition_expression": { "storage.public": true },
    "status": "Active",
    "created_at": "2024-01-10T00:01:00Z"
  },
  {
    "id": "pol-0058",
    "name": "Allow Storage Admin",
    "effect": "Allow",
    "priority": 50,
    "resource_pattern": "storage/*",
    "condition_expression": { "role": "StorageAdmin" },
    "status": "Active",
    "created_at": "2024-01-10T00:02:00Z"
  },
  {
    "id": "pol-0059",
    "name": "Require Malware Scan on Upload",
    "effect": "Deny",
    "priority": 3,
    "resource_pattern": "storage/*/write",
    "condition_expression": { "scan.malware": "NotScanned" },
    "status": "Active",
    "created_at": "2024-01-10T00:03:00Z"
  },
  {
    "id": "pol-0060",
    "name": "Deny Storage Access from Untrusted Device",
    "effect": "Deny",
    "priority": 1,
    "resource_pattern": "storage/*",
    "condition_expression": { "device.trust_state": "Untrusted" },
    "status": "Active",
    "created_at": "2024-01-10T00:04:00Z"
  }
,
{
  "id": "pol-0061",
  "name": "Deny Access Without MFA",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "*",
  "condition_expression": { "session.mfa_verified": false },
  "status": "Active",
  "created_at": "2024-01-11T00:00:00Z"
},
{
  "id": "pol-0062",
  "name": "Allow Admin Access with MFA",
  "effect": "Allow",
  "priority": 30,
  "resource_pattern": "*",
  "condition_expression": { "role": "Admin", "session.mfa_verified": true },
  "status": "Active",
  "created_at": "2024-01-11T00:01:00Z"
},
{
  "id": "pol-0063",
  "name": "Deny High Risk User Access",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "*",
  "condition_expression": { "user.risk_level": "High" },
  "status": "Active",
  "created_at": "2024-01-11T00:02:00Z"
},
{
  "id": "pol-0064",
  "name": "Allow Medium Risk Read Only",
  "effect": "Allow",
  "priority": 60,
  "resource_pattern": "*/read",
  "condition_expression": { "user.risk_level": "Medium" },
  "status": "Active",
  "created_at": "2024-01-11T00:03:00Z"
},
{
  "id": "pol-0065",
  "name": "Deny Concurrent Sessions Limit Exceeded",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "*",
  "condition_expression": { "session.concurrent_exceeded": true },
  "status": "Active",
  "created_at": "2024-01-11T00:04:00Z"
},
{
  "id": "pol-0066",
  "name": "Allow Service Identity Internal Access",
  "effect": "Allow",
  "priority": 70,
  "resource_pattern": "internal/*",
  "condition_expression": { "actor.type": "ServiceIdentity" },
  "status": "Active",
  "created_at": "2024-01-11T00:05:00Z"
},
{
  "id": "pol-0067",
  "name": "Deny Service Identity External Access",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "external/*",
  "condition_expression": { "actor.type": "ServiceIdentity" },
  "status": "Active",
  "created_at": "2024-01-11T00:06:00Z"
},
{
  "id": "pol-0068",
  "name": "Require Device Trust for Sensitive Operations",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "sensitive/*",
  "condition_expression": { "device.trust_state": "Unknown" },
  "status": "Active",
  "created_at": "2024-01-11T00:07:00Z"
},
{
  "id": "pol-0069",
  "name": "Deny Blocked Device",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "*",
  "condition_expression": { "device.trust_state": "Blocked" },
  "status": "Active",
  "created_at": "2024-01-11T00:08:00Z"
},
{
  "id": "pol-0070",
  "name": "Allow Trusted Device Full Access",
  "effect": "Allow",
  "priority": 40,
  "resource_pattern": "*",
  "condition_expression": { "device.trust_state": "Trusted" },
  "status": "Active",
  "created_at": "2024-01-11T00:09:00Z"
}
,
{
  "id": "pol-0071",
  "name": "Allow Infrastructure Read",
  "effect": "Allow",
  "priority": 80,
  "resource_pattern": "infra/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-12T00:00:00Z"
},
{
  "id": "pol-0072",
  "name": "Deny Infrastructure Delete",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "infra/*/delete",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-12T00:01:00Z"
},
{
  "id": "pol-0073",
  "name": "Allow Infra Admin",
  "effect": "Allow",
  "priority": 45,
  "resource_pattern": "infra/*",
  "condition_expression": { "role": "InfraAdmin" },
  "status": "Active",
  "created_at": "2024-01-12T00:02:00Z"
},
{
  "id": "pol-0074",
  "name": "Require Change Window",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "infra/*/write",
  "condition_expression": { "change.window": "Closed" },
  "status": "Active",
  "created_at": "2024-01-12T00:03:00Z"
},
{
  "id": "pol-0075",
  "name": "Allow CI/CD Deploy",
  "effect": "Allow",
  "priority": 60,
  "resource_pattern": "deploy/*",
  "condition_expression": { "actor.type": "ServiceIdentity" },
  "status": "Active",
  "created_at": "2024-01-12T00:04:00Z"
}
,
{
  "id": "pol-0101",
  "name": "Allow Personal Data Read",
  "effect": "Allow",
  "priority": 70,
  "resource_pattern": "data/personal/*/read",
  "condition_expression": { "purpose": "Business" },
  "status": "Active",
  "created_at": "2024-01-20T00:00:00Z"
},
{
  "id": "pol-0102",
  "name": "Deny Personal Data Export",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "data/personal/*/export",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-20T00:01:00Z"
},
{
  "id": "pol-0103",
  "name": "Allow DPO Full Access",
  "effect": "Allow",
  "priority": 35,
  "resource_pattern": "data/personal/*",
  "condition_expression": { "role": "DataProtectionOfficer" },
  "status": "Active",
  "created_at": "2024-01-20T00:02:00Z"
},
{
  "id": "pol-0104",
  "name": "Require Consent for Personal Data Processing",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "data/personal/*",
  "condition_expression": { "consent.valid": false },
  "status": "Active",
  "created_at": "2024-01-20T00:03:00Z"
},
{
  "id": "pol-0105",
  "name": "Deny Cross-Border Personal Data Access",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "data/personal/*",
  "condition_expression": { "data_residency.violation": true },
  "status": "Active",
  "created_at": "2024-01-20T00:04:00Z"
},

{
  "id": "pol-0106",
  "name": "Allow Financial Data Read",
  "effect": "Allow",
  "priority": 75,
  "resource_pattern": "data/financial/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-21T00:00:00Z"
},
{
  "id": "pol-0107",
  "name": "Deny Financial Data Write from External Network",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "data/financial/*/write",
  "condition_expression": { "network.trust_zone": "External" },
  "status": "Active",
  "created_at": "2024-01-21T00:01:00Z"
},
{
  "id": "pol-0108",
  "name": "Allow Finance Admin",
  "effect": "Allow",
  "priority": 40,
  "resource_pattern": "data/financial/*",
  "condition_expression": { "role": "FinanceAdmin" },
  "status": "Active",
  "created_at": "2024-01-21T00:02:00Z"
},
{
  "id": "pol-0109",
  "name": "Require Dual Approval for Financial Export",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "data/financial/*/export",
  "condition_expression": { "approval.dual": false },
  "status": "Active",
  "created_at": "2024-01-21T00:03:00Z"
},
{
  "id": "pol-0110",
  "name": "Deny Financial Access Outside Business Hours",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "data/financial/*",
  "condition_expression": { "time.outside_business_hours": true },
  "status": "Active",
  "created_at": "2024-01-21T00:04:00Z"
},

{
  "id": "pol-0111",
  "name": "Allow Audit Log Read",
  "effect": "Allow",
  "priority": 85,
  "resource_pattern": "audit/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-22T00:00:00Z"
},
{
  "id": "pol-0112",
  "name": "Deny Audit Log Delete",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "audit/*/delete",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-22T00:01:00Z"
},
{
  "id": "pol-0113",
  "name": "Require Integrity Check for Audit Access",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "audit/*",
  "condition_expression": { "integrity.check_failed": true },
  "status": "Active",
  "created_at": "2024-01-22T00:02:00Z"
},
{
  "id": "pol-0114",
  "name": "Allow External Auditor Temporary Access",
  "effect": "Allow",
  "priority": 55,
  "resource_pattern": "audit/*",
  "condition_expression": { "actor.contractor": true },
  "status": "Active",
  "created_at": "2024-01-22T00:03:00Z"
},
{
  "id": "pol-0115",
  "name": "Deny Audit Access After Contract End",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "audit/*",
  "condition_expression": { "contract.valid": false },
  "status": "Active",
  "created_at": "2024-01-22T00:04:00Z"
},

{
  "id": "pol-0116",
  "name": "Allow Data Retention Process",
  "effect": "Allow",
  "priority": 65,
  "resource_pattern": "governance/retention/*",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-23T00:00:00Z"
},
{
  "id": "pol-0117",
  "name": "Deny Retention Override",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "governance/retention/override",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-23T00:01:00Z"
},
{
  "id": "pol-0118",
  "name": "Allow Legal Hold Access",
  "effect": "Allow",
  "priority": 45,
  "resource_pattern": "governance/legal-hold/*",
  "condition_expression": { "role": "LegalAdmin" },
  "status": "Active",
  "created_at": "2024-01-23T00:02:00Z"
},
{
  "id": "pol-0119",
  "name": "Deny Legal Hold Release Without Approval",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "governance/legal-hold/release",
  "condition_expression": { "approval.required": true },
  "status": "Active",
  "created_at": "2024-01-23T00:03:00Z"
},
{
  "id": "pol-0120",
  "name": "Require Immutable Storage for Legal Hold",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "governance/legal-hold/*",
  "condition_expression": { "storage.immutable": false },
  "status": "Active",
  "created_at": "2024-01-23T00:04:00Z"
},

{
  "id": "pol-0121",
  "name": "Allow Disaster Recovery Activation",
  "effect": "Allow",
  "priority": 50,
  "resource_pattern": "dr/*/activate",
  "condition_expression": { "role": "DRAdmin" },
  "status": "Active",
  "created_at": "2024-01-24T00:00:00Z"
},
{
  "id": "pol-0122",
  "name": "Deny DR Activation Without Incident",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "dr/*/activate",
  "condition_expression": { "incident.active": false },
  "status": "Active",
  "created_at": "2024-01-24T00:01:00Z"
},
{
  "id": "pol-0123",
  "name": "Allow Backup Restore",
  "effect": "Allow",
  "priority": 60,
  "resource_pattern": "backup/*/restore",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-24T00:02:00Z"
},
{
  "id": "pol-0124",
  "name": "Deny Backup Restore from Unverified Source",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "backup/*/restore",
  "condition_expression": { "source.verified": false },
  "status": "Active",
  "created_at": "2024-01-24T00:03:00Z"
},
{
  "id": "pol-0125",
  "name": "Require DR Approval Chain",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "dr/*",
  "condition_expression": { "approval.chain_complete": false },
  "status": "Active",
  "created_at": "2024-01-24T00:04:00Z"
},

{
  "id": "pol-0126",
  "name": "Allow API Public Read",
  "effect": "Allow",
  "priority": 90,
  "resource_pattern": "api/public/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-25T00:00:00Z"
},
{
  "id": "pol-0127",
  "name": "Deny API Abuse Rate Limit",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "api/*",
  "condition_expression": { "rate_limit.exceeded": true },
  "status": "Active",
  "created_at": "2024-01-25T00:01:00Z"
},
{
  "id": "pol-0128",
  "name": "Allow API Admin",
  "effect": "Allow",
  "priority": 40,
  "resource_pattern": "api/*",
  "condition_expression": { "role": "APIAdmin" },
  "status": "Active",
  "created_at": "2024-01-25T00:02:00Z"
},
{
  "id": "pol-0129",
  "name": "Require API Token Rotation",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "api/*",
  "condition_expression": { "token.rotation_expired": true },
  "status": "Active",
  "created_at": "2024-01-25T00:03:00Z"
},
{
  "id": "pol-0130",
  "name": "Deny API Access from Blocked Country",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "api/*",
  "condition_expression": { "location.blocked": true },
  "status": "Active",
  "created_at": "2024-01-25T00:04:00Z"
},

{
  "id": "pol-0131",
  "name": "Allow ML Model Read",
  "effect": "Allow",
  "priority": 80,
  "resource_pattern": "ml/models/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-26T00:00:00Z"
},
{
  "id": "pol-0132",
  "name": "Deny ML Model Training from Untrusted Device",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "ml/models/*/train",
  "condition_expression": { "device.trust_state": "Untrusted" },
  "status": "Active",
  "created_at": "2024-01-26T00:01:00Z"
},
{
  "id": "pol-0133",
  "name": "Allow ML Admin",
  "effect": "Allow",
  "priority": 45,
  "resource_pattern": "ml/*",
  "condition_expression": { "role": "MLAdmin" },
  "status": "Active",
  "created_at": "2024-01-26T00:02:00Z"
},
{
  "id": "pol-0134",
  "name": "Require Dataset Provenance",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "ml/*",
  "condition_expression": { "dataset.provenance_verified": false },
  "status": "Active",
  "created_at": "2024-01-26T00:03:00Z"
},
{
  "id": "pol-0135",
  "name": "Deny ML Export Without Approval",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "ml/*/export",
  "condition_expression": { "approval.required": true },
  "status": "Active",
  "created_at": "2024-01-26T00:04:00Z"
},

{
  "id": "pol-0136",
  "name": "Allow Observability Read",
  "effect": "Allow",
  "priority": 85,
  "resource_pattern": "observability/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-27T00:00:00Z"
},
{
  "id": "pol-0137",
  "name": "Deny Observability Config Change",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "observability/*/write",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-27T00:01:00Z"
},
{
  "id": "pol-0138",
  "name": "Allow SRE Admin",
  "effect": "Allow",
  "priority": 40,
  "resource_pattern": "observability/*",
  "condition_expression": { "role": "SREAdmin" },
  "status": "Active",
  "created_at": "2024-01-27T00:02:00Z"
},
{
  "id": "pol-0139",
  "name": "Require Alert Acknowledgement",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "observability/alerts/*",
  "condition_expression": { "alert.acknowledged": false },
  "status": "Active",
  "created_at": "2024-01-27T00:03:00Z"
},
{
  "id": "pol-0140",
  "name": "Deny Observability Access from External Network",
  "effect": "Deny",
  "priority": 2,
  "resource_pattern": "observability/*",
  "condition_expression": { "network.trust_zone": "External" },
  "status": "Active",
  "created_at": "2024-01-27T00:04:00Z"
},

{
  "id": "pol-0141",
  "name": "Allow Experimental Feature Access",
  "effect": "Allow",
  "priority": 60,
  "resource_pattern": "feature/experimental/*",
  "condition_expression": { "user.opt_in": true },
  "status": "Active",
  "created_at": "2024-01-28T00:00:00Z"
},
{
  "id": "pol-0142",
  "name": "Deny Experimental Features in Production",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "feature/experimental/*",
  "condition_expression": { "environment": "Production" },
  "status": "Active",
  "created_at": "2024-01-28T00:01:00Z"
},
{
  "id": "pol-0143",
  "name": "Allow Feature Toggle Admin",
  "effect": "Allow",
  "priority": 45,
  "resource_pattern": "feature/*",
  "condition_expression": { "role": "FeatureAdmin" },
  "status": "Active",
  "created_at": "2024-01-28T00:02:00Z"
},
{
  "id": "pol-0144",
  "name": "Require Canary Deployment",
  "effect": "Deny",
  "priority": 3,
  "resource_pattern": "feature/*/deploy",
  "condition_expression": { "deployment.canary": false },
  "status": "Active",
  "created_at": "2024-01-28T00:03:00Z"
},
{
  "id": "pol-0145",
  "name": "Deny Feature Rollback Without Approval",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "feature/*/rollback",
  "condition_expression": { "approval.required": true },
  "status": "Active",
  "created_at": "2024-01-28T00:04:00Z"
},

{
  "id": "pol-0146",
  "name": "Allow Organization Admin Full Access",
  "effect": "Allow",
  "priority": 20,
  "resource_pattern": "*",
  "condition_expression": { "role": "OrganizationAdmin" },
  "status": "Active",
  "created_at": "2024-01-29T00:00:00Z"
},
{
  "id": "pol-0147",
  "name": "Deny Organization Deletion",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "organization/*/delete",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-29T00:01:00Z"
},
{
  "id": "pol-0148",
  "name": "Require Board Approval for Organization Changes",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "organization/*/update",
  "condition_expression": { "approval.board": false },
  "status": "Active",
  "created_at": "2024-01-29T00:02:00Z"
},
{
  "id": "pol-0149",
  "name": "Allow Organization Read",
  "effect": "Allow",
  "priority": 95,
  "resource_pattern": "organization/*/read",
  "condition_expression": {},
  "status": "Active",
  "created_at": "2024-01-29T00:03:00Z"
},
{
  "id": "pol-0150",
  "name": "Deny Organization Access When Suspended",
  "effect": "Deny",
  "priority": 1,
  "resource_pattern": "organization/*",
  "condition_expression": { "organization.status": "Suspended" },
  "status": "Active",
  "created_at": "2024-01-29T00:04:00Z"
}

]
