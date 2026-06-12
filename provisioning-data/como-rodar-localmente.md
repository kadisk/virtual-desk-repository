
Os comando
## Iniciando as estrutura local do VirtualDesk

```bash
# Inciando os proxy 
my-services provision ./provisioning-data/ring0/local-domain-router-proxy.provision.json 
my-services provision ./provisioning-data/ring0/local-transit-proxy.provision.json

# Montando os arquivo externo
my-services host-mount service-orchestrator-socket /home/kadisk/EcosystemData/sockets/service-orchestrator.app.sock
my-services host-mount repository-storage-manager-socket /home/kadisk/EcosystemData/sockets/repository-storage-manager.app.sock
my-services host-mount repository-manager-repositories-storage /home/kadisk/virtual-desk-state/local-app-data/my-services-uploded-repositories/
my-services host-mount docker-socket /var/run/docker.sock


my-services provision ./provisioning-data/ring0/iam-manager.provision.json

# Front-end Service Panel
my-services provision ./provisioning-data/ring1/service-panel.provision.json

#Demais paineis
my-services provision ./provisioning-data/ring1/iam-panel.provision.json
my-services provision ./provisioning-data/ring1/repository-manager-panel.provision.json
my-services provision ./provisioning-data/ring1/user-space-panel.provision.json
my-services provision ./provisioning-data/ring1/virtual-desk.provision.json
```
