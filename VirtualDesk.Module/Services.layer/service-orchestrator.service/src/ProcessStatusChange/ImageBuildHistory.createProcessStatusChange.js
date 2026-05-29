
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateFilterInstancesState = require("../Helpers/ServiceRuntimeStateManager.utils/FilterInstancesState.create")

const { 
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP
 } = ItemGroupTypes

const {
    CREATING,
    RESTARTING,
    WAITING,
    FINISHED
} = StatusTypes

const CreateImageBuildHistoryProcessStatusChange = ({ stateManager, RequestData }) => 
    (buildId) => {

        const { GetState, ChangeStatus, SetDataProperty} = stateManager

        const ListInstancesState = CreateFilterInstancesState(stateManager)

        const { status, data: imageData } = GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId)
        const { status: statusService, data:serviceData }  = GetState(SERVICE_STATE_GROUP, imageData.serviceId)
        const { status:instanceStatus, data:instanceData } = GetState(INSTANCE_STATE_GROUP, imageData.instanceId) || {}

        console.log(`IMAGE BUILD [${buildId}] STATUS CHANGE ${status.description}`)

        switch (status) {
            case CREATING:
                RequestData(RequestTypes.BUILD_NEW_IMAGE, {
                    buildId,             
                    imageTagName              : imageData.tag,
                    serviceName               : serviceData.serviceName,
                    originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                    originRepositoryNamespace : serviceData.originRepositoryNamespace,
                    originPackagePath         : serviceData.originPackagePath,
                    startupParams             : instanceData.startupParams
                })
                break
            case WAITING:
                break
            case FINISHED:
                if(instanceStatus === CREATING){
                    if(statusService === RESTARTING){
                        //ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, WAITING)
                    } else {
                        RequestData(RequestTypes.REGISTER_NEW_CONTAINER, { 
                            containerName : `container_${serviceData.serviceName}-${buildId}`,
                            buildId,
                            instanceId  : imageData.instanceId,
                        })
                    }
                }
                break
            default:
        }
    }

module.exports = CreateImageBuildHistoryProcessStatusChange