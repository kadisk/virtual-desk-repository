
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateListRunningInstances = require("../Helpers/ServiceRuntimeStateManager.utils/ListRunningInstances.create")

const { 
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const {
    INITIATE,
    INITIALIZING,
    WAITING,
    CREATING,
    CREATED,
    RESTARTING,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED
} = StatusTypes

const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const { GetState, ChangeStatus, TakeDataProperty } = stateManager

    const ListRunningInstances = CreateListRunningInstances(stateManager)

    const { status, data: instanceData } = GetState(INSTANCE_STATE_GROUP, instanceId)
    const { status:serviceStatus, data: serviceData } = GetState(SERVICE_STATE_GROUP, instanceData.serviceId)

    console.log(`INSTANCE [${instanceId}] STATUS CHANGE ${status.description}`)

    switch (status) {

        case INITIATE:
            ChangeStatus(INSTANCE_STATE_GROUP, instanceId, INITIALIZING)
            break
        case CREATING:
            if(!instanceData.storageParams){
                RequestData(RequestTypes.REGISTER_BUILD_NEW_IMAGE, {
                    serviceId: instanceData.serviceId,
                    instanceId,
                    serviceName : serviceData.serviceName,
                    repositoryNamespace : serviceData.originRepositoryNamespace
                })
            } else {
                ChangeStatus(INSTANCE_STATE_GROUP, instanceId, WAITING)
            }
            
            break
        case CREATED:
            break
        case INITIALIZING:
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
            break
        default:
            console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
    }
        
}

module.exports = CreateInstanceProcessStatusChange