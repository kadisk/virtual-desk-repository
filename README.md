# Virtual Desk Repository

## Configuração
Para que os componente desse repositório possa ser usado é preciso que seja registrado no ecosistema que ele sera usado
 ```bash
repo register source VirtualDeskRepo LOCAL_FS --localPath ~/VirtualDeskRepo
 ```

## Instando os aplicativos no ecosistema

Instalando o serviço corporativo *Virtual Desk* e sobre a front-end
```bash
repo install VirtualDeskRepo LOCAL_FS --executables "virtual-desk" "service-orchestrator" "repository-storage-manager"



repo install VirtualDeskRepo LOCAL_FS --executables "local-transit-proxy" "local-domain-router-proxy"
```


## Atualizando o repositório no ecosistema

```bash
repo update VirtualDeskRepo
```

## Instalando local

```bash
repo install VirtualDeskRepo LOCAL_FS --executables "my-services" "virtual-desk" "service-orchestrator" "repository-storage-manager" "kadisk-transit-proxy" "local-domain-router-proxy"
```