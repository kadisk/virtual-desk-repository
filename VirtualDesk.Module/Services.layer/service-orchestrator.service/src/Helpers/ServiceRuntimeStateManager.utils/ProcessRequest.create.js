const {
    CREATING,
    CREATED,
    UPDATED,
    WAITING,
    LOADING,
    STARTING,
    FAILURE,
    FINISHED,
    DECOMMISSIONED,
    TERMINATED
} = require("../../Types/Status.types")

const RequestTypes  = require("../../Types/Request.types")

const {
    SERVICE_STATE_GROUP,
    STORAGE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const CreateCreateObjectState = require("./CreateObjectState.create")
const CreateAddNewContainerState = require("./AddNewContainerState.create")
const CreateAddNewBuildState = require("./AddNewBuildState.create")
const CreateSwapRunningInstance = require("./SwapRunningInstance.create")
const CreateReceiveInspectionData = require("./ReceiveInspectionData.create")

const CreateProcessRequest = ({ getData, stateManager, RequestData}) => async (requestData) => {

    const SwapRunningInstance   = CreateSwapRunningInstance({ stateManager, RequestData })
    const CreateObjectState     = CreateCreateObjectState(stateManager)
    const AddNewContainerState  = CreateAddNewContainerState(stateManager)
    const AddNewBuildState      = CreateAddNewBuildState(stateManager)
    const ReceiveInspectionData = CreateReceiveInspectionData(stateManager)

    const { ChangeStatus, UpdateData } = stateManager
        
    const { requestType } = requestData

    switch (requestType) {
        case RequestTypes.INSTANCE_DATA_LIST:
            ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
            const instanceDataList = await getData(requestType, { serviceId: requestData.serviceId })
            if(instanceDataList.length > 0)
                instanceDataList
                    .forEach(({ id:instanceId , startupParams, ports, networkmode }) => 
                        CreateObjectState(INSTANCE_STATE_GROUP, instanceId, {serviceId: requestData.serviceId, startupParams, ports, networkmode}, WAITING))
            break
        case RequestTypes.IMAGE_BUILD_DATA_LIST:
            const buildDataList = await getData(requestType, { serviceId: requestData.serviceId })
                buildDataList
                    .forEach(({ id:buildId , tag, hashId, instanceId }) => AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId}))
            break
        case RequestTypes.SERVICE_DATA:
            ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
            const serviceData = await getData(requestType, { serviceId: requestData.serviceId })

            UpdateData(SERVICE_STATE_GROUP, requestData.serviceId, { 
                serviceName               : serviceData.serviceName,
                serviceDescription        : serviceData.serviceDescription,
                repositoryCodePath        : serviceData.instanceRepositoryCodePath,
                originRepositoryNamespace : serviceData.originRepositoryNamespace,
                originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                originPackagePath         : serviceData.originPackagePath,
            })
            ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, requestData.nextStatus)
            if(requestData.nextStatus === UPDATED){
                SwapRunningInstance(requestData.serviceId, requestData.instanceParams)
            }
            break
        case RequestTypes.CONTAINER_DATA:
            ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
            const containerData = await getData(requestType, { instanceId: requestData.instanceId })
            if(containerData){
                const { id:containerId, containerName  } = containerData
                AddNewContainerState(containerId, { instanceId: requestData.instanceId, serviceId:requestData.serviceId, containerName  })
            } else {
                ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, TERMINATED)
            }
            break
        case RequestTypes.CONTAINER_INSPECTION_DATA:
            ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
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
                ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, FAILURE)
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
            CreateObjectState(INSTANCE_STATE_GROUP, _instanceId, {
                serviceId: requestData.serviceId, 
                startupParams,
                storageParams,
                socketParams,
                ports, 
                networkmode
            }, CREATING)
            break
        case RequestTypes.CREATE_NEW_CONTAINER:
            ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
            const newContainerData = await getData(requestType, requestData)
            const { id:containerId, containerName  } = newContainerData
            AddNewContainerState(containerId, {
                instanceId: requestData.instanceId,
                serviceId:requestData.serviceId,
                containerName
            })
            ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, requestData.buildId, FINISHED)
            break
        case RequestTypes.BUILD_NEW_IMAGE:
            ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
            const newImageBuildData = await getData(requestType, requestData)
            const {
                id:buildId, tag, hashId, instanceId
            } = newImageBuildData
            AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId})
            break
        case RequestTypes.MARK_AS_DECOMMISSIONED:
            await getData(requestType, { serviceId: requestData.serviceId })
            ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, DECOMMISSIONED)
            break
        case RequestTypes.REGISTER_STORAGES:
            const storageDataList = await getData(requestType, { 
                serviceId: requestData.serviceId,
                instanceId: requestData.instanceId,
                storageParams: requestData.storageParams
            })
            
            storageDataList
                    .forEach(({ id:storageId , namespace, filename }) => 
                        CreateObjectState(STORAGE_STATE_GROUP, storageId, { 
                            serviceId: requestData.serviceId, 
                            instanceId: requestData.instanceId,
                            namespace,
                            filename
                        }, CREATING))
        default:
            console.warn(`Unknown request type: ${requestType.description}`)
    }

}

module.exports = CreateProcessRequest