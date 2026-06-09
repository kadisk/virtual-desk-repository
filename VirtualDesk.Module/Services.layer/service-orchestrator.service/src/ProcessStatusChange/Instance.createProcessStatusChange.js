
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateListRunningInstances = require("../Helpers/ServiceRuntimeStateManager.utils/ListRunningInstances.create")

const { 
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP
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
    TERMINATED,
    FAILURE
} = StatusTypes

const CreateInstanceProcessStatusChange = ({ stateManager, RequestData }) => (instanceId) => {

    const { 
        GetState, 
        ChangeStatus, 
        TakeDataProperty,
        HasExecutedStatusSequence
    } = stateManager

    const ListRunningInstances = CreateListRunningInstances(stateManager)

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
                RequestData(RequestTypes.REGISTER_BUILD_NEW_IMAGE, {
                    serviceId: instanceData.serviceId,
                    instanceId,
                    serviceName : serviceData.serviceName,
                    repositoryNamespace : serviceData.originRepositoryNamespace
                })
            } else if(instanceData.storageParams) {
                ChangeStatus(INSTANCE_STATE_GROUP, instanceId, WAITING)
                const registeredParameters = new Set()

                Object.entries(storageDataParams.storageParams)
                    .forEach(([parameter, { namespace, filename }]) => {
                        if (registeredParameters.has(parameter)) {
                            return
                        }

                        registeredParameters.add(parameter)

                        RequestData(RequestTypes.REGISTER_STORAGE_PARAM, { 
                            instanceId, 
                            parameter, 
                            namespace 
                        })
                    })
            }
            break
        case CREATING:
            
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
            if(HasExecutedStatusSequence(INSTANCE_STATE_GROUP, instanceId, [ WAITING, CREATING ])){
                const containerDataParams = _TakeContainerDataParams()
                if(containerDataParams) RequestData(RequestTypes.REGISTER_NEW_CONTAINER, containerDataParams)
                else ChangeStatus(INSTANCE_STATE_GROUP, instanceId, FAILURE)
            } else if(HasExecutedStatusSequence(INSTANCE_STATE_GROUP, instanceId, [ WAITING, CREATE ])) {
                //TODO precisa verificar de todos os storages estão prontos
            }
            break
        default:
            console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
    }
        
}

module.exports = CreateInstanceProcessStatusChange