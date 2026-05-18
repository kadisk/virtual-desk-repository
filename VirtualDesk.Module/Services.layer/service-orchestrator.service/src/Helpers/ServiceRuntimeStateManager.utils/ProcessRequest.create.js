const {
    INITIALIZING,
    CREATING,
    FAILURE,
    FINISHED,
    DECOMMISSIONED,
    TERMINATED
} = require("../../Types/Status.types")

const RequestTypes  = require("../../Types/Request.types")

const {
    SERVICE_STATE_GROUP,
    CONTAINER_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP,
    INSTANCE_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const CreateCreateObjectState = require("./CreateObjectState.create")
const CreateReceiveInspectionData = require("./ReceiveInspectionData.create")

const CreateProcessRequest = ({ getData, stateManager, RequestData}) => async (requestData) => {

    const CreateObjectState     = CreateCreateObjectState(stateManager)
    const ReceiveInspectionData = CreateReceiveInspectionData(stateManager)

    const { ChangeStatus, UpdateData } = stateManager
        
    const { requestType } = requestData

    switch (requestType) {
        case RequestTypes.INSTANCE_DATA_LIST:
            const instanceDataList = await getData(requestType, { serviceId: requestData.serviceId })
            if(instanceDataList.length > 0)
                instanceDataList
                    .forEach(({ id:instanceId , startupParams, ports, networkmode }) => 
                        CreateObjectState(INSTANCE_STATE_GROUP, instanceId, {serviceId: requestData.serviceId, startupParams, ports, networkmode}, INITIALIZING))
            else ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, FINISHED)
            break
        case RequestTypes.IMAGE_BUILD_DATA_LIST:
            const buildDataList = await getData(requestType, { serviceId: requestData.serviceId })
                buildDataList
                    .forEach(({ id:buildId , tag, hashId, instanceId }) => 
                        CreateObjectState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId}, FINISHED))
            break
        case RequestTypes.SERVICE_DATA:
            const serviceData = await getData(requestType, { serviceId: requestData.serviceId })

            UpdateData(SERVICE_STATE_GROUP, requestData.serviceId, { 
                serviceName               : serviceData.serviceName,
                serviceDescription        : serviceData.serviceDescription,
                repositoryCodePath        : serviceData.instanceRepositoryCodePath,
                originRepositoryNamespace : serviceData.originRepositoryNamespace,
                originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                originPackagePath         : serviceData.originPackagePath,
            })

            if(requestData.nextStatus){
                ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, requestData.nextStatus)
            }

            break
        case RequestTypes.CONTAINER_DATA:
            const containerData = await getData(requestType, { instanceId: requestData.instanceId })
            if(containerData){
                CreateObjectState(CONTAINER_STATE_GROUP, containerData.id, {
                    instanceId    : requestData.instanceId,
                    serviceId     : requestData.serviceId,
                    containerName : containerData.containerName,
                    buildId       : containerData.buildId
                }, INITIALIZING)
            } else {
                ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, TERMINATED)
            }
            break
        case RequestTypes.CREATE_NEW_CONTAINER:
            const inspectionData_ = await getData(requestType, requestData)
            ReceiveInspectionData({ containerId: requestData.containerId, inspectionData: inspectionData_ })
            break
        case RequestTypes.CONTAINER_INSPECTION_DATA:
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
            const data = await getData(requestType, requestData)
            CreateObjectState(INSTANCE_STATE_GROUP, data.id, {
                serviceId     : requestData.serviceId, 
                startupParams : data.startupParams,
                storageParams : data.storageParams,
                socketParams  : data.socketParams,
                ports         : data.ports, 
                networkmode   : data.networkmode
            }, CREATING)
            break
        case RequestTypes.REGISTER_NEW_CONTAINER:
            const newContainerData = await getData(requestType, requestData)
           CreateObjectState(CONTAINER_STATE_GROUP, newContainerData.id, {
                instanceId    : requestData.instanceId,
                serviceId     : requestData.serviceId,
                buildId       : requestData.buildId,
                containerName : newContainerData.containerName
            }, CREATING)
            break
        case RequestTypes.BUILD_NEW_IMAGE:
            const imageBuildData = await getData(requestType, requestData)
            UpdateData(IMAGE_BUILD_HISTORY_STATE_GROUP, requestData.buildId, { hashId: imageBuildData.hashId })
            ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, imageBuildData.instanceId, FINISHED)
            break

        case RequestTypes.REGISTER_BUILD_NEW_IMAGE:
            const newImageBuildData = await getData(requestType, requestData)
            CreateObjectState(IMAGE_BUILD_HISTORY_STATE_GROUP, newImageBuildData.id, { 
                tag        : newImageBuildData.tag, 
                instanceId : requestData.instanceId,
                serviceId  : requestData.serviceId,
            }, CREATING)
            break

        case RequestTypes.MARK_AS_DECOMMISSIONED:
            await getData(requestType, { serviceId: requestData.serviceId })
            ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, DECOMMISSIONED)
            break
        /*case RequestTypes.REGISTER_STORAGES:
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
                        }, CREATING))*/
        default:
            console.warn(`Unknown request type: ${requestType.description}`)
    }

}

module.exports = CreateProcessRequest