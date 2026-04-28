
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateListRunningInstances = require("../Helpers/ServiceRuntimeStateManager.utils/ListRunningInstances.create")

const { 
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const {
    INITIALIZING,
    CREATING,
    CREATED,
    RESTARTING,
    LOADING,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED
} = StatusTypes

const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const { GetState, ChangeStatus, TakeDataProperty } = stateManager

    const _TakeContainerParams = () => TakeDataProperty(INSTANCE_STATE_GROUP, instanceId, "containerParams")

    const ListRunningInstances = CreateListRunningInstances(stateManager)

    const { status, data } = GetState(INSTANCE_STATE_GROUP, instanceId)
    const { serviceId } = data
    const { status:serviceStatus, data: serviceData } = GetState(SERVICE_STATE_GROUP, serviceId)

    switch (status) {
        case CREATING:
            RequestData(RequestTypes.BUILD_NEW_IMAGE, {
                serviceId,
                instanceId,
                serviceName               : serviceData.serviceName,
                originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                originRepositoryNamespace : serviceData.originRepositoryNamespace,
                originPackagePath         : serviceData.originPackagePath,
                startupParams             : data.startupParams,
                networkmode               : data.networkmode,
                ports                     : data.ports
            })
            break
        case CREATED:
             if(data.storageParams){
                RequestData(RequestTypes.REGISTER_STORAGES, {
                    serviceId,
                    instanceId,
                    storageParams: data.storageParams
                })
            } else {
                RequestData(RequestTypes.CREATE_NEW_CONTAINER, _TakeContainerParams())
            }
            break
        case INITIALIZING:
            RequestData(RequestTypes.CONTAINER_DATA, { serviceId, instanceId })
            break
        case RUNNING:
            ChangeStatus(SERVICE_STATE_GROUP, serviceId, RUNNING)
            break
        case STOPPING:
        case STOPPED:
        case TERMINATED:
            if(serviceStatus !== RESTARTING && ListRunningInstances(serviceId).length === 0)
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, status)
            break
        case STARTING:
        case LOADING:
            break
        default:
            console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
    }
        
}

module.exports = CreateInstanceProcessStatusChange