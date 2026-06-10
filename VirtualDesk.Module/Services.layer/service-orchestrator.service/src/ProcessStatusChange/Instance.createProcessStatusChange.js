
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateListRunningInstances = require("../Helpers/ServiceRuntimeStateManager.utils/ListRunningInstances.create")
const CreateResolveInstanceStorageMounts = require("../Helpers/ServiceRuntimeStateManager.utils/ResolveInstanceStorageMounts.create")
const CreateAdvanceInstanceWhenStorageReady = require("../Helpers/ServiceRuntimeStateManager.utils/AdvanceInstanceWhenStorageReady.create")

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


const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const {
        GetState,
        ChangeStatus,
        TakeDataProperty,
        SetDataProperty,
        HasExecutedStatusSequence
    } = stateManager

    const ListRunningInstances           = CreateListRunningInstances(stateManager)
    const ResolveInstanceStorageMounts   = CreateResolveInstanceStorageMounts(stateManager)
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
            if(!instanceData.storageParams){
                ChangeStatus(INSTANCE_STATE_GROUP, instanceId, CREATING)
            } else {
                ChangeStatus(INSTANCE_STATE_GROUP, instanceId, WAITING)
                const registeredParameters = new Set()

                Object.entries(instanceData.storageParams)
                    .forEach(([parameter, { namespace }]) => {
                        if (registeredParameters.has(parameter)) {
                            return
                        }

                        registeredParameters.add(parameter)

                        RequestData(RequestTypes.REGISTER_STORAGE_PARAM, {
                            serviceId: instanceData.serviceId,
                            instanceId,
                            parameter,
                            namespace
                        })
                    })
            }
            break
        case CREATING:
            const storageMounts = ResolveInstanceStorageMounts(instanceId)

            if (storageMounts.length > 0) {
                const storageStartupParams = Object.fromEntries(
                    storageMounts.map(({ parameter, mountPath }) => [parameter, mountPath])
                )

                SetDataProperty(INSTANCE_STATE_GROUP, instanceId, "startupParams", {
                    ...instanceData.startupParams,
                    ...storageStartupParams
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