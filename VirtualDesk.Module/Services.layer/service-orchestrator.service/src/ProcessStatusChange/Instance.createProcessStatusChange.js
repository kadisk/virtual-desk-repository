
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateListRunningInstances = require("../Helpers/ServiceRuntimeStateManager.utils/ListRunningInstances.create")
const CreateResolveInstanceStorageMounts = require("../Helpers/ServiceRuntimeStateManager.utils/ResolveInstanceStorageMounts.create")
const CreateResolveInstanceSocketMounts = require("../Helpers/ServiceRuntimeStateManager.utils/ResolveInstanceSocketMounts.create")
const CreateResolveInstanceHostMounts = require("../Helpers/ServiceRuntimeStateManager.utils/ResolveInstanceHostMounts.create")
const CreateAdvanceInstanceWhenStorageReady = require("../Helpers/ServiceRuntimeStateManager.utils/AdvanceInstanceWhenStorageReady.create")

const NormalizeResourceParam = require("../Utils/NormalizeResourceParam")
const { BuildSocketPath } = require("../Utils/SocketMountPaths")

const {
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP
 } = ItemGroupTypes

const {
    INITIATE,
    INITIALIZING,
    CREATE,
    WAITING,
    CREATING,
    CREATED,
    RESTARTING,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED,
    FAILURE
} = StatusTypes

/**
 * Storage pertence ao serviço; Socket pertence à instância. Ambos seguem o mesmo objetivo:
 * o owner cria o recurso (volume) e os demais (owner ou não) montam o volume através de um
 * Param (StorageParam/SocketParam). A instância só avança de WAITING para CREATING quando todos
 * os Params (storage e socket) estão READY.
 */
const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const {
        GetState,
        ChangeStatus,
        TakeDataProperty,
        SetDataProperty,
        HasExecutedStatusSequence
    } = stateManager

    const ListRunningInstances            = CreateListRunningInstances(stateManager)
    const ResolveInstanceStorageMounts    = CreateResolveInstanceStorageMounts(stateManager)
    const ResolveInstanceSocketMounts     = CreateResolveInstanceSocketMounts(stateManager)
    const ResolveInstanceHostMounts       = CreateResolveInstanceHostMounts(stateManager)
    const AdvanceInstanceWhenStorageReady = CreateAdvanceInstanceWhenStorageReady(stateManager)

    const { status, data: instanceData } = GetState(INSTANCE_STATE_GROUP, instanceId)
    const { status:serviceStatus, data: serviceData } = GetState(SERVICE_STATE_GROUP, instanceData.serviceId)

    const _TakeContainerDataParams = () => TakeDataProperty(INSTANCE_STATE_GROUP, instanceId, "containerDataParams")

    console.log(`INSTANCE [${instanceId}] STATUS CHANGE ${status.description}`)

    switch (status) {
        case INITIATE:
            ChangeStatus(INSTANCE_STATE_GROUP, instanceId, INITIALIZING)
            break
        case CREATE:
            const storageParams   = instanceData.storageParams ?? {}
            const socketParams    = instanceData.socketParams ?? {}
            const hostMountParams = instanceData.hostMountParams ?? {}
            const hasStorageParams   = Object.keys(storageParams).length > 0
            const hasSocketParams    = Object.keys(socketParams).length > 0
            const hasHostMountParams = Object.keys(hostMountParams).length > 0

            if(!hasStorageParams && !hasSocketParams && !hasHostMountParams){
                ChangeStatus(INSTANCE_STATE_GROUP, instanceId, CREATING)
            } else {
                ChangeStatus(INSTANCE_STATE_GROUP, instanceId, WAITING)

                const ownerSocketNamespaces = new Set()
                Object.entries(socketParams)
                    .map(([parameter, value]) => NormalizeResourceParam(parameter, value))
                    .filter(({ owner }) => owner)
                    .forEach(({ namespace }) => {
                        if (ownerSocketNamespaces.has(namespace)) {
                            return
                        }

                        ownerSocketNamespaces.add(namespace)

                        RequestData(RequestTypes.REGISTER_SOCKET, {
                            serviceId : instanceData.serviceId,
                            instanceId,
                            namespace,
                            socketPath: BuildSocketPath(namespace)
                        })
                    })

                const registeredStorageParameters = new Set()
                Object.entries(storageParams)
                    .forEach(([parameter, value]) => {
                        if (registeredStorageParameters.has(parameter)) {
                            return
                        }

                        registeredStorageParameters.add(parameter)

                        const { namespace } = NormalizeResourceParam(parameter, value)

                        RequestData(RequestTypes.REGISTER_STORAGE_PARAM, {
                            serviceId: instanceData.serviceId,
                            instanceId,
                            parameter,
                            namespace
                        })
                    })

                const registeredSocketParameters = new Set()
                Object.entries(socketParams)
                    .forEach(([parameter, value]) => {
                        if (registeredSocketParameters.has(parameter)) {
                            return
                        }

                        registeredSocketParameters.add(parameter)

                        const { namespace } = NormalizeResourceParam(parameter, value)

                        RequestData(RequestTypes.REGISTER_SOCKET_PARAM, {
                            serviceId: instanceData.serviceId,
                            instanceId,
                            parameter,
                            namespace
                        })
                    })

                const registeredHostMountParameters = new Set()
                Object.entries(hostMountParams)
                    .forEach(([parameter, value]) => {
                        if (registeredHostMountParameters.has(parameter)) {
                            return
                        }

                        registeredHostMountParameters.add(parameter)

                        const { namespace } = NormalizeResourceParam(parameter, value)

                        RequestData(RequestTypes.REGISTER_HOST_MOUNT_PARAM, {
                            serviceId: instanceData.serviceId,
                            instanceId,
                            parameter,
                            namespace
                        })
                    })
            }
            break
        case CREATING:
            const storageMounts   = ResolveInstanceStorageMounts(instanceId)
            const socketMounts    = ResolveInstanceSocketMounts(instanceId)
            const hostMountMounts = ResolveInstanceHostMounts(instanceId)

            if (storageMounts.length > 0 || socketMounts.length > 0 || hostMountMounts.length > 0) {
                const storageStartupParams = Object.fromEntries(
                    storageMounts.map(({ parameter, mountPath }) => [parameter, mountPath])
                )
                const socketStartupParams = Object.fromEntries(
                    socketMounts.map(({ parameter, socketPath }) => [parameter, socketPath])
                )
                const hostMountStartupParams = Object.fromEntries(
                    hostMountMounts.map(({ parameter, mountPath }) => [parameter, mountPath])
                )

                SetDataProperty(INSTANCE_STATE_GROUP, instanceId, "startupParams", {
                    ...instanceData.startupParams,
                    ...storageStartupParams,
                    ...socketStartupParams,
                    ...hostMountStartupParams
                })
            }

            RequestData(RequestTypes.REGISTER_BUILD_NEW_IMAGE, {
                serviceId: instanceData.serviceId,
                instanceId,
                serviceName : serviceData.serviceName,
                repositoryNamespace : serviceData.originRepositoryNamespace
            })
            break
        case CREATED:
            break
        case INITIALIZING:
            RequestData(RequestTypes.FETCH_STORAGE_PARAM_DATA_LIST, {
                serviceId: instanceData.serviceId,
                instanceId
            })
            RequestData(RequestTypes.FETCH_SOCKET_PARAM_DATA_LIST, {
                serviceId: instanceData.serviceId,
                instanceId
            })
            RequestData(RequestTypes.FETCH_HOST_MOUNT_PARAM_DATA_LIST, {
                serviceId: instanceData.serviceId,
                instanceId
            })
            RequestData(RequestTypes.FETCH_CONTAINER_DATA, {
                serviceId: instanceData.serviceId,
                instanceId
            })
            break
        case RUNNING:
            ChangeStatus(SERVICE_STATE_GROUP, instanceData.serviceId, RUNNING)
            break
        case STOPPING:
        case STOPPED:
        case TERMINATED:
            if(serviceStatus !== RESTARTING && ListRunningInstances(instanceData.serviceId).length === 0)
                ChangeStatus(SERVICE_STATE_GROUP, instanceData.serviceId, status)
            break
        case STARTING:
            break
        case WAITING:
            if(HasExecutedStatusSequence(INSTANCE_STATE_GROUP, instanceId, [ WAITING, CREATING ])){
                const containerDataParams = _TakeContainerDataParams()
                if(containerDataParams) RequestData(RequestTypes.REGISTER_NEW_CONTAINER, containerDataParams)
                else ChangeStatus(INSTANCE_STATE_GROUP, instanceId, FAILURE)
            } else if(HasExecutedStatusSequence(INSTANCE_STATE_GROUP, instanceId, [ WAITING, CREATE ])) {
                AdvanceInstanceWhenStorageReady(instanceId)
            }
            break
        case FAILURE:
            ChangeStatus(SERVICE_STATE_GROUP, instanceData.serviceId, FAILURE)
            break
        default:
            console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
    }
        
}

module.exports = CreateInstanceProcessStatusChange