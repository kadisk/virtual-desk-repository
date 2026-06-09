const {
    INITIATE,
    CREATING,
    FAILURE,
    FINISHED,
    DECOMMISSIONED,
    TERMINATED,
    DATA_HYDRATED,
    UPDATED
} = require("../../Types/Status.types")

const RequestTypes  = require("../../Types/Request.types")

const {
    SERVICE_STATE_GROUP,
    CONTAINER_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    STORAGE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const CreateCreateObjectState = require("./CreateObjectState.create")

const CreateProcessRequest = ({ getData, stateManager, RequestData}) => async (requestData) => {

    const CreateObjectState     = CreateCreateObjectState(stateManager)

    const { ChangeStatus, UpdateData } = stateManager
        
    const { requestType } = requestData

    console.log(`PROCESS REQUEST ${requestType.description}`)

    switch (requestType) {
        case RequestTypes.FETCH_INSTANCE_DATA_LIST:
            const instanceDataList = await getData(requestType, { serviceId: requestData.serviceId })
            if(instanceDataList.length > 0)
                instanceDataList
                    .forEach(({ id:instanceId , startupParams, ports, networkmode }) => 
                        CreateObjectState(INSTANCE_STATE_GROUP, instanceId, {serviceId: requestData.serviceId, startupParams, ports, networkmode}, INITIATE))
            else ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, FINISHED)
            break
        case RequestTypes.FETCH_IMAGE_BUILD_DATA_LIST:
            const buildDataList = await getData(requestType, { serviceId: requestData.serviceId })
                buildDataList
                    .forEach(({ id:buildId , tag, hashId, instanceId }) => 
                        CreateObjectState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId}, FINISHED))
            break
        case RequestTypes.FETCH_SERVICE_DATA:
            const serviceData = await getData(requestType, { serviceId: requestData.serviceId })

            UpdateData(SERVICE_STATE_GROUP, requestData.serviceId, { 
                serviceName               : serviceData.serviceName,
                serviceDescription        : serviceData.serviceDescription,
                repositoryCodePath        : serviceData.instanceRepositoryCodePath,
                originRepositoryNamespace : serviceData.originRepositoryNamespace,
                originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                originPackagePath         : serviceData.originPackagePath,
            })

            ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, DATA_HYDRATED)

            break
        case RequestTypes.FETCH_CONTAINER_DATA:
            const containerData = await getData(requestType, { instanceId: requestData.instanceId })
            if(containerData){
                CreateObjectState(CONTAINER_STATE_GROUP, containerData.id, {
                    instanceId    : requestData.instanceId,
                    serviceId     : requestData.serviceId,
                    containerName : containerData.containerName,
                    buildId       : containerData.buildId
                }, INITIATE)
            } else {
                ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, TERMINATED)
            }
            break
        case RequestTypes.CREATE_NEW_CONTAINER:
        case RequestTypes.FETCH_CONTAINER_INSPECTION_DATA:
            const inspectionData = await getData(requestType, requestData)
            if(inspectionData){
                UpdateData(CONTAINER_STATE_GROUP, requestData.containerId, { inspectionData })
            }  
            ChangeStatus(CONTAINER_STATE_GROUP, requestData.containerId, DATA_HYDRATED)
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
            }, CREATE)
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
        case RequestTypes.REGISTER_STORAGE:

            const storageData = await getData(requestType, { 
                serviceId: requestData.serviceId,
                namespace: requestData.namespace,
                filename: requestData.filename
            })
            
            CreateObjectState(STORAGE_STATE_GROUP, storageData.id, { 
                serviceId: requestData.serviceId, 
                namespace: requestData.namespace,
                filename: requestData.filename
            }, CREATE)
            break
        case RequestTypes.CREATE_NEW_VOLUME:
            const volumeData = await getData(requestType, { 
                volumeName:requestData.volumeName,
                labels: requestData.labels
            })
            UpdateData(STORAGE_STATE_GROUP, requestData.storageId, { volumeData } )
            break
        case RequestTypes.REGISTER_STORAGE_PARAM:
            const storageParamData = await getData(requestType, { 
                instanceId : requestData.instanceId, 
                parameter  : requestData.parameter, 
                namespace  : requestData.namespace
            }) 
            CreateObjectState(STORAGE_PARAM_STATE_GROUP, storageParamData.id, { 
                instanceId : requestData.instanceId, 
                parameter  : requestData.parameter, 
                namespace  : requestData.namespace
            }, CREATE)
            break
        case RequestTypes.UPDATE_STORAGE_PARAM_STORAGE_ID:
            await getData(requestType, {
                storageParamId : requestData.storageParamId,
                storageId      : requestData.storageId
            })
            UpdateData(STORAGE_PARAM_STATE_GROUP, requestData.storageParamId, { storageId: requestData.storageId })
            ChangeStatus(STORAGE_PARAM_STATE_GROUP, requestData.storageParamId, UPDATED)
            break
        default:
            console.warn(`Unknown request type: ${requestType.description}`)
    }

}

module.exports = CreateProcessRequest