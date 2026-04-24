
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateListRunningInstances = require("../Helpers/ServiceRuntimeStateManager.utils/ListRunningInstances.create")

const { 
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const {
    CREATING,
    CREATED,
    RESTARTING,
    WAITING,
    LOADING,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED
} = StatusTypes

const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const ListRunningInstances = CreateListRunningInstances(stateManager)

    const { status, data } = stateManager.GetState(INSTANCE_STATE_GROUP, instanceId)
    const { serviceId } = data
    const { status:serviceStatus, data: serviceData } = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)

    switch (status) {
        case CREATING:
            if(serviceData.serviceName){
                RequestData(RequestTypes.REGISTER_STORAGES, {
                    serviceId,
                    instanceId,
                    storageParams: data.storageParams
                })
            } else setImmediate(() => CreateInstanceProcessStatusChange({ stateManager, RequestData, ListRunningInstances })(instanceId)) 
            break
        case CREATED:
            if(serviceData.serviceName){
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
            } else setImmediate(() => CreateInstanceProcessStatusChange({ stateManager, RequestData, ListRunningInstances })(instanceId))
            break
        case WAITING:
            RequestData(RequestTypes.CONTAINER_DATA, { serviceId, instanceId })
            break
        case RUNNING:
            stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, RUNNING)
            break
        case STOPPING:
        case STOPPED:
        case TERMINATED:
            if(serviceStatus !== RESTARTING && ListRunningInstances(serviceId).length === 0)
                stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, status)
            break
        case STARTING:
        case LOADING:
            break
        default:
            console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
    }
        
}

module.exports = CreateInstanceProcessStatusChange