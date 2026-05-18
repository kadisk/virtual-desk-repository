
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
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED
} = StatusTypes

const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const { GetState, ChangeStatus, TakeDataProperty } = stateManager

    const ListRunningInstances = CreateListRunningInstances(stateManager)

    const { status, data } = GetState(INSTANCE_STATE_GROUP, instanceId)
    const { serviceId } = data
    const { status:serviceStatus, data: serviceData } = GetState(SERVICE_STATE_GROUP, serviceId)

    switch (status) {
        case CREATING:
            RequestData(RequestTypes.REGISTER_BUILD_NEW_IMAGE, {
                serviceId,
                instanceId,
                serviceName : serviceData.serviceName,
                repositoryNamespace : serviceData.originRepositoryNamespace
            })

            if(data.storageParams){
                const storageList = Object
                .entries(storageParams)
                .map(([key, { namespace, filename, owner }]) => ({ serviceId, namespace, filename, owner }))
            }
            break
        case CREATED:
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
        default:
            console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
    }
        
}

module.exports = CreateInstanceProcessStatusChange