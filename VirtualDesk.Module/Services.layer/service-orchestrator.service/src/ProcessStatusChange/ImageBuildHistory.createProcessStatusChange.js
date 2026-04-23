
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const { 
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP
 } = ItemGroupTypes

const {
    RESTARTING,
    WAITING,
    STARTING,
    STOPPING,
    RUNNING,
    FINISHED
} = StatusTypes

const CreateImageBuildHistoryProcessStatusChange = ({ stateManager, RequestData, ListInstancesState }) => 
    (buildId) => {

        const { status, data } = stateManager.GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId)
        const { status: statusService, data:serviceData } = stateManager.GetState(SERVICE_STATE_GROUP, data.serviceId)
        const { status:instanceStatus, data:instanceData } = stateManager.GetState(INSTANCE_STATE_GROUP, data.instanceId) || {}

        switch (status) {
            case WAITING:
                const instanceRunningOrStoppingList = ListInstancesState(data.serviceId)
                    .filter(({status}) => status === RUNNING || status === STOPPING)
                
                if(instanceRunningOrStoppingList.length === 0 ){
                    RequestData(RequestTypes.CREATE_NEW_CONTAINER, { 
                        buildId,
                        instanceId  : data.instanceId,
                        tag         : data.tag,
                        serviceId   : data.serviceId,
                        serviceName : serviceData.serviceName,
                        networkmode : instanceData.networkmode,
                        ports       : instanceData.ports
                    })
                    
                } else setTimeout(() => {
                    CreateImageBuildHistoryProcessStatusChange({ stateManager, RequestData, ListInstancesState })(buildId)
                }, 3000)
                break
            case FINISHED:
                if(instanceStatus === STARTING){
                    if(statusService === RESTARTING){
                        stateManager.ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, WAITING)
                    } else {
                        RequestData(RequestTypes.CREATE_NEW_CONTAINER, { 
                            buildId,
                            instanceId  : data.instanceId,
                            tag         : data.tag,
                            serviceId   : data.serviceId,
                            serviceName : serviceData.serviceName,
                            networkmode : instanceData.networkmode,
                            ports       : instanceData.ports
                        })
                    }
                }
                /**/
                break
            default:
        }
    }

module.exports = CreateImageBuildHistoryProcessStatusChange