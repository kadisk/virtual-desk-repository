# Virtual Desk Repository

## Configuração
Para que os componente desse repositório possa ser usado é preciso que seja registrado no ecosistema que ele sera usado
 ```bash
repo register source VirtuakDeskRepo LOCAL_FS --localPath ~/VirtualDeskRepo
 ```

## Instando os aplicativos no ecosistema

Instalando o serviço corporativo *Virtual Desk* e sobre a front-end
```bash
repo install VirtuakDeskRepo LOCAL_FS --executables "virtual-desk" "service-orchestrator" "repository-storage-manager"
```


## Atualizando o repositório no ecosistema

```bash
repo update VirtuakDeskRepo
```

## Instalando local

```bash
repo install VirtuakDeskRepo LOCAL_FS --executables "virtual-desk" "service-orchestrator" "repository-storage-manager" "kadisk-transit-proxy" "local-domain-router-proxy"
```