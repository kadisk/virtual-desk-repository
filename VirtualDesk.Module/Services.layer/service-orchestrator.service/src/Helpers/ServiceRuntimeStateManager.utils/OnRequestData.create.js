const {
    CREATING,
    CREATED,
    UPDATED,
    WAITING,
    LOADING,
    STARTING,
    FAILURE,
    FINISHED,
    DECOMMISSIONED 
} = require("../Types/Status.types")

const RequestTypes  = require("../Types/Request.types")

const {
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP
} = require("../Types/ItemGroup.types")

const CreateAddNewState = require("./AddNewState.create")
const CreateAddNewContainerState = require("./AddNewContainerState.create")
const CreateAddNewBuildState = require("./AddNewBuildState.create")
const CreateSwapRunningInstance = require("./SwapRunningInstance.create")
const CreateReceiveInspectionData = require("./ReceiveInspectionData.create")

const CreateOnRequestData = ({ eventEmitter, stateManager }) => (getData) => {

    const SwapRunningInstance = CreateSwapRunningInstance(stateManager)
    const AddNewState = CreateAddNewState(stateManager)
    const AddNewContainerState = CreateAddNewContainerState(stateManager)
    const AddNewBuildState = CreateAddNewBuildState(stateManager)
    const ReceiveInspectionData = CreateReceiveInspectionData(stateManager)

    eventEmitter.on(REQUEST_EVENT, async (requestData) => {
        
        const { requestType } = requestData

        switch (requestType) {
            case RequestTypes.INSTANCE_DATA_LIST:
                stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                const instanceDataList = await getData(requestType, { serviceId: requestData.serviceId })
                if(instanceDataList.length > 0)
                    instanceDataList
                        .forEach(({ id:instanceId , startupParams, ports, networkmode }) => 
                            AddNewState(INSTANCE_STATE_GROUP, instanceId, {serviceId: requestData.serviceId, startupParams, ports, networkmode}, WAITING))
                break
            case RequestTypes.IMAGE_BUILD_DATA_LIST:
                const buildDataList = await getData(requestType, { serviceId: requestData.serviceId })
                    buildDataList
                        .forEach(({ id:buildId , tag, hashId, instanceId }) => AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId}))
                break
            case RequestTypes.SERVICE_DATA:
                stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                const serviceData = await getData(requestType, { serviceId: requestData.serviceId })

                stateManager.UpdateData(SERVICE_STATE_GROUP, requestData.serviceId, { 
                    serviceName               : serviceData.serviceName,
                    serviceDescription        : serviceData.serviceDescription,
                    repositoryCodePath        : serviceData.instanceRepositoryCodePath,
                    originRepositoryNamespace : serviceData.originRepositoryNamespace,
                    originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                    originPackagePath         : serviceData.originPackagePath,
                })
                stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, requestData.nextStatus)
                if(requestData.nextStatus === UPDATED){
                    SwapRunningInstance(requestData.serviceId, requestData.instanceParams)
                }
                break
            case RequestTypes.CONTAINER_DATA:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                const containerData = await getData(requestType, { instanceId: requestData.instanceId })
                if(containerData){
                    const { id:containerId, containerName  } = containerData
                    AddNewContainerState(containerId, { instanceId: requestData.instanceId, serviceId:requestData.serviceId, containerName  })
                }
                break
            case RequestTypes.CONTAINER_INSPECTION_DATA:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                const inspectionData = await getData(requestType, { containerName: requestData.containerName })
                ReceiveInspectionData({ containerId: requestData.containerId, inspectionData })
                break
            case RequestTypes.START_CONTAINER:
            case RequestTypes.STOP_CONTAINER:
            case RequestTypes.REMOVE_CONTAINER:
                try{
                    await getData(requestType, { containerHashId: requestData.containerHashId })
                } catch(e){
                    console.log(e)
                    stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, FAILURE)
                }
                break
            case RequestTypes.CREATE_NEW_INSTANCE:
                const newInstanceData = await getData(requestType, requestData)
                const { 
                    id:_instanceId,
                    startupParams,
                    storageParams,
                    socketParams,
                    ports,
                    networkmode
                } = newInstanceData
                AddNewState(INSTANCE_STATE_GROUP, _instanceId, {
                    serviceId: requestData.serviceId, 
                    startupParams,
                    storageParams,
                    socketParams,
                    ports, 
                    networkmode
                }, CREATING)
                break
            case RequestTypes.CREATE_NEW_CONTAINER:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
                const newContainerData = await getData(requestType, requestData)
                const { id:containerId, containerName  } = newContainerData
                AddNewContainerState(containerId, {
                    instanceId: requestData.instanceId,
                    serviceId:requestData.serviceId,
                    containerName
                })
                stateManager.ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, requestData.buildId, FINISHED)
                break
            case RequestTypes.BUILD_NEW_IMAGE:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
                const newImageBuildData = await getData(requestType, requestData)
                const {
                    id:buildId, tag, hashId, instanceId
                } = newImageBuildData
                AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId})
                break
            case RequestTypes.MARK_AS_DECOMMISSIONED:
                await getData(requestType, { serviceId: requestData.serviceId })
                stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, DECOMMISSIONED)
                break
            case RequestTypes.REGISTER_STORAGES:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, CREATED)
            default:
                console.warn(`Unknown request type: ${requestType.description}`)
        }

    })
}

module.exports = CreateOnRequestData