
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const { 
    IMAGE_BUILD_HISTORY_STATE_GROUP,
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    CONTAINER_STATE_GROUP
 } = ItemGroupTypes

const {
    CREATING,
    CREATED,
    INITIALIZING,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED
} = StatusTypes

const CreateContainerProcessStatusChange = ({ stateManager, RequestData }) => 
    (containerId) => {

        const { GetState, ChangeStatus } = stateManager

        const { status, data:containerData } = GetState(CONTAINER_STATE_GROUP, containerId)
        const { data: imageData } = GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, containerData.buildId)
        const { status:instanceStatus, data:instanceData } = GetState(INSTANCE_STATE_GROUP, containerData.instanceId)

        
        switch (status) {
            case CREATING:
                RequestData(RequestTypes.CREATE_NEW_CONTAINER, { 
                    containerId,
                    containerName : containerData.containerName,
                    imageName   : imageData.tag,
                    networkmode : instanceData.networkmode,
                    ports       : instanceData.ports
                })
                break
            case CREATED:
                if(instanceStatus === CREATING){
                    RequestData(RequestTypes.START_CONTAINER, {
                        containerHashId: containerData.Id
                    })
                }
                break
            case INITIALIZING:
            case STARTING:
                RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                    serviceId     : containerData.serviceId,
                    instanceId    : containerData.instanceId,
                    containerId,
                    containerName : containerData.containerName
                })
                break
            case RUNNING:
                ChangeStatus(INSTANCE_STATE_GROUP, containerData.instanceId, RUNNING)
                break
            case STOPPING:
                ChangeStatus(INSTANCE_STATE_GROUP, containerData.instanceId, STOPPING)
                break
            case STOPPED:
                if(instanceStatus === TERMINATED) {
                    RequestData(RequestTypes.REMOVE_CONTAINER, { 
                        instanceId      : instanceData.instanceId,
                        containerHashId : instanceData.Id
                    })
                } else ChangeStatus(INSTANCE_STATE_GROUP, containerData.instanceId, STOPPED)
                break
            case TERMINATED:
                ChangeStatus(INSTANCE_STATE_GROUP, containerData.instanceId, TERMINATED)
                break
            default:
                console.warn(`Container ${containerId} has an unknown status: ${status.description}`)
        }
    }

module.exports = CreateContainerProcessStatusChange