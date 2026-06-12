const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateSwapRunningInstance = require("../Helpers/ServiceRuntimeStateManager.utils/SwapRunningInstance.create")

const NormalizeResourceParam = require("../Utils/NormalizeResourceParam")

const {
    FETCH_SERVICE_DATA,
    FETCH_INSTANCE_DATA_LIST,
    FETCH_IMAGE_BUILD_DATA_LIST,
    FETCH_STORAGE_DATA_LIST,
    FETCH_SOCKET_DATA_LIST
} = RequestTypes

const {
    SERVICE_STATE_GROUP,
    STORAGE_STATE_GROUP,
    SOCKET_STATE_GROUP
 } = ItemGroupTypes

const {
    INITIATE,
    INITIALIZING,
    CREATE,
    CREATING,
    CREATED,
    UPDATED,
    RESTARTING,
    HYDRATE_DATA,
    HYDRATING_DATA,
    DATA_HYDRATED,
    FAILURE
} = StatusTypes
//INSTRUÇÕES PARA O CLAUDE CODE IMPLEMENTAR
/**
 * O Storages e Socket somente devem ser criados se o parametro existir e ser igual a true
 * exemplo: 
 * "socketParams":{
        "socket" : {
            "namespace":"iam-socket",
            "owner": true
        }
    },
    "storageParams":{
        "storageFilePath" : {
            "namespace": "iam-manager-service-database-file",
            "filename": "iam-manager-service.sqlite",
            "owner": true
        }
    },
    quando o não existe onwer como nesse caso
    "socketParams":{
        "serviceOrchestratorSocketPath" : "service-orchestrator-socket",
        "repositoryStorageSocketPath": "repository-storage-manager-socket"
    },
    "storageParams":{
        "uploadDirPath" : "repository-manager-repositories-storage"
    },
    quando o socketParams não for owner ele deve buscar pelo namespace o exemplo service-orchestrator-socket deve buscar ele de alguma instancia rodando e montar o volume
    nele, para que os dois de comunique via socket, vale para storageParams mais o storage pertence ao serviço, todo namespace é unico para cada owner se um owner tentar ser cirado par um
    namespace já existente deve ocorrer um FALHA 
 o exemplo baixo o iam-panel se conectar no iam-manager via socket iam-socket
    {
    "serviceName": "iam-manager",
    "serviceDescription": "Serviço de Indentidade e Acesso",
    "repositoryNamespace": "VirtualDeskRepo",
    "packageName": "identity-and-access-management",
    "packageType": "app",
    "packagePath": "Platform.Module/Applications.layer/identity-and-access-management.app",
    "startupParams": {
        "serverName" : "IAMAppInstance"
    },
    "socketParams":{
        "socket" : {
            "namespace":"iam-socket",
            "owner": true
        }
    },
    "storageParams":{
        "storageFilePath" : {
            "namespace": "iam-manager-service-database-file",
            "filename": "iam-manager-service.sqlite",
            "owner": true
        }
    },
    "ports": [],
    "networkmode": "host"
}

{
    "serviceName": "iam-panel",
    "serviceDescription": "Painel de Administração de Identidades de Acessos",
    "repositoryNamespace": "VirtualDeskRepo",
    "packageName": "identity-access-manager-panel",
    "packageType": "webapp",
    "packagePath": "Platform.Module/PanelApplications.layer/IdentityAccessManagerPanel.group/identity-access-manager-panel.webapp",
    "startupParams": {
        "port"                       : "9999",
        "serverName"                 : "IdentityAccessManagerPanelWebAppInstance",
        "serverManagerUrl"           : "http://iam-panel.app.local:9000/server-manager/status",
        "isWatch"                    : true,
        "RT_ENV_GENERATED_DIR_NAME"  : ".generated_data",
        "iamManagerServerManagerUrl" : "/server-manager/status"
    },
    "socketParams":{
        "iamManagerSocketPath" : "iam-socket"
    },
    "ports": [],
    "networkmode": "host"
}
 */
const CreateServiceProcessStatusChange = ({ stateManager, RequestData }) =>
    (serviceId) => {

        const {
            GetState,
            TakeDataProperty,
            ChangeStatus,
            GetPreviousStatus,
            HasExecutedStatusSequence,
            FindKeyByPropertyData
         } = stateManager

        const SwapRunningInstance = CreateSwapRunningInstance({ stateManager, RequestData })

        const previousStatus = GetPreviousStatus(SERVICE_STATE_GROUP, serviceId)

        const _TakeInstanceParams = () => TakeDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams")
        const _TakeStorageDataParams = () => TakeDataProperty(SERVICE_STATE_GROUP, serviceId, "storageDataParams")

        const _FindDuplicatedOwnerNamespace = ({ storageParams = {}, socketParams = {} }) => {
            const storageDuplicated = Object.entries(storageParams)
                .map(([parameter, value]) => NormalizeResourceParam(parameter, value))
                .filter(({ owner }) => owner)
                .find(({ namespace }) => FindKeyByPropertyData(STORAGE_STATE_GROUP, "namespace", namespace) != null)

            if (storageDuplicated) return storageDuplicated.namespace

            const socketDuplicated = Object.entries(socketParams)
                .map(([parameter, value]) => NormalizeResourceParam(parameter, value))
                .filter(({ owner }) => owner)
                .find(({ namespace }) => FindKeyByPropertyData(SOCKET_STATE_GROUP, "namespace", namespace) != null)

            if (socketDuplicated) return socketDuplicated.namespace

            return null
        }

        const { status } = GetState(SERVICE_STATE_GROUP, serviceId)

        console.log(`SERVICE [${serviceId}] STATUS CHANGE ${status.description}`)

        switch (status) {
            case HYDRATE_DATA:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, HYDRATING_DATA)
                RequestData(FETCH_SERVICE_DATA, { serviceId })
                break
            case DATA_HYDRATED:
                if(HasExecutedStatusSequence(SERVICE_STATE_GROUP, serviceId, [ DATA_HYDRATED, HYDRATING_DATA, HYDRATE_DATA, CREATE])){
                    ChangeStatus(SERVICE_STATE_GROUP, serviceId, CREATING)
                }else if(HasExecutedStatusSequence(SERVICE_STATE_GROUP, serviceId, [ DATA_HYDRATED, HYDRATING_DATA, HYDRATE_DATA, INITIATE])){
                    ChangeStatus(SERVICE_STATE_GROUP, serviceId, INITIALIZING)
                }
                break
            case INITIATE:
            case CREATE:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, HYDRATE_DATA)
                break
            case CREATING:
                const serviceStateData = GetState(SERVICE_STATE_GROUP, serviceId)?.data ?? {}
                const duplicatedNamespace = _FindDuplicatedOwnerNamespace({
                    storageParams : serviceStateData.storageDataParams?.storageParams,
                    socketParams  : serviceStateData.instanceParams?.socketParams
                })

                if (duplicatedNamespace) {
                    console.warn(`SERVICE [${serviceId}] FAILURE: namespace owner "${duplicatedNamespace}" já existe`)
                    ChangeStatus(SERVICE_STATE_GROUP, serviceId, FAILURE)
                    break
                }

                RequestData(RequestTypes.CREATE_NEW_INSTANCE, _TakeInstanceParams())
                const storageDataParams = _TakeStorageDataParams()

                if (storageDataParams?.storageParams) {
                    const registeredNamespaces = new Set()

                    Object.entries(storageDataParams.storageParams)
                        .map(([parameter, value]) => NormalizeResourceParam(parameter, value))
                        .filter(({ owner }) => owner)
                        .forEach(({ namespace, filename }) => {
                            if (registeredNamespaces.has(namespace)) {
                                return
                            }

                            registeredNamespaces.add(namespace)

                            RequestData(RequestTypes.REGISTER_STORAGE, {
                                serviceId,
                                namespace,
                                filename
                            })
                        })
                }
                break
            case INITIALIZING:
                RequestData(FETCH_STORAGE_DATA_LIST, { serviceId })
                RequestData(FETCH_SOCKET_DATA_LIST, { serviceId })
                RequestData(FETCH_INSTANCE_DATA_LIST, { serviceId })
                RequestData(FETCH_IMAGE_BUILD_DATA_LIST, { serviceId })
                break
            case CREATED:
                break
            case UPDATED:
                SwapRunningInstance(serviceId, _TakeInstanceParams())
                break
            case RESTARTING:
                break
            case FAILURE:
                break
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
        }
    }

module.exports = CreateServiceProcessStatusChange