
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const { 
    INSTANCE_STATE_GROUP,
    CONTAINER_STATE_GROUP
 } = ItemGroupTypes

const {
    WAITING,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED
} = StatusTypes

const CreateContainerProcessStatusChange = ({ stateManager, RequestData }) => 
    (containerId) => {
        const { status, data } = stateManager.GetState(CONTAINER_STATE_GROUP, containerId)
        switch (status) {
            case WAITING:
                RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId     : data.serviceId,
                        instanceId    : data.instanceId,
                        containerId,
                        containerName : data.containerName
                    })
                break
            case STARTING:
                RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId     : data.serviceId,
                        instanceId    : data.instanceId,
                        containerId,
                        containerName : data.containerName
                    })
                break
            case RUNNING:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, RUNNING)
                break
            case STOPPING:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, STOPPING)
                break
            case STOPPED:
                const { status:instanceStatus, data:instanceData } = stateManager.GetState(INSTANCE_STATE_GROUP, data.instanceId)
                if(instanceStatus === TERMINATED) {
                    RequestData(RequestTypes.REMOVE_CONTAINER, { 
                        instanceId      : instanceData.instanceId,
                        containerHashId : instanceData.Id
                    })
                } else stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, STOPPED)
                break
            case TERMINATED:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, TERMINATED)
                break
            default:
                console.warn(`Container ${containerId} has an unknown status: ${status.description}`)
        }
    }

module.exports = CreateContainerProcessStatusChange