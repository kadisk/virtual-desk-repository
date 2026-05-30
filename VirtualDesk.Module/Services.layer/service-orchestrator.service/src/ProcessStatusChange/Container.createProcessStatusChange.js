
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
    INITIATE,
    STARTING,
    STOPPING,
    STOPPED,
    RUNNING,
    TERMINATED,
    HYDRATE_DATA,
    HYDRATING_DATA,
    DATA_HYDRATED
} = StatusTypes

const CreateContainerProcessStatusChange = ({ stateManager, RequestData }) => 
    (containerId) => {

        const { GetState, ChangeStatus } = stateManager

        const { status, data:containerData } = GetState(CONTAINER_STATE_GROUP, containerId)
        const { data: imageData } = GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, containerData.buildId)
        const { status:instanceStatus, data:instanceData } = GetState(INSTANCE_STATE_GROUP, containerData.instanceId)

        console.log(`CONTAINER[${containerId}] STATUS CHANGE ${status.description}`)

        switch (status) {
            case HYDRATE_DATA:
                ChangeStatus(CONTAINER_STATE_GROUP, containerId, HYDRATING_DATA)
                RequestData(RequestTypes.FETCH_CONTAINER_INSPECTION_DATA, { 
                    serviceId     : containerData.serviceId,
                    instanceId    : containerData.instanceId,
                    containerId,
                    containerName : containerData.containerName
                })
                break
            case DATA_HYDRATED:
                const { inspectionData } = containerData
                if(inspectionData){
                    const { State } = containerData.inspectionData
                    if (State.Running) {
                        ChangeStatus(CONTAINER_STATE_GROUP, containerId, RUNNING)
                    } else if (State.Status === "created") {
                        ChangeStatus(CONTAINER_STATE_GROUP, containerId, CREATED)
                    }else if (State.Status === "exited") {
                        ChangeStatus(CONTAINER_STATE_GROUP, containerId, STOPPED)
                    } else {
                        ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
                    }
                } else {
                    ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
                }
                
                break
            case STARTING:
            case INITIATE:
                ChangeStatus(CONTAINER_STATE_GROUP, containerId, HYDRATE_DATA)
                break
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
                        containerHashId: containerData.inspectionData.Id
                    })
                }
                break
            case RUNNING:
            case STOPPING:
            case TERMINATED:
                ChangeStatus(INSTANCE_STATE_GROUP, containerData.instanceId, status)
                break
            case STOPPED:
                //TODO Rever essa regra
                if(instanceStatus === TERMINATED) {
                    RequestData(RequestTypes.REMOVE_CONTAINER, { 
                        instanceId      : instanceData.instanceId,
                        containerHashId : instanceData.Id
                    })
                } else ChangeStatus(INSTANCE_STATE_GROUP, containerData.instanceId, STOPPED)
                break
            default:
                console.warn(`Container ${containerId} has an unknown status: ${status.description}`)
        }
    }

module.exports = CreateContainerProcessStatusChange