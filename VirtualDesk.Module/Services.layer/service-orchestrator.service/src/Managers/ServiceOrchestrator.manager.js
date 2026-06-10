const { join } = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeMyServicesPersistentStoreManager = require("../Helpers/InitializeMyServicesPersistentStoreManager")

const CreateMyWorkspaceDomainService             = require("../Helpers/MyWorkspaceDomainService.create")
const CreateServiceRuntimeStateManager           = require("../Helpers/ServiceRuntimeStateManager.create")

const RequestTypes = require("../Types/Request.types")

const CreateServiceHandler = require("../Helpers/ServiceHandler.create")

const ServiceOrchestratorManager = (params) => {

    const {
        onReady,
        serviceStorageFilePath,
        instanceDataDirPath,
        containerManagerService
    } = params

    const absolutServiceStorageFilePath = ConvertPathToAbsolutPath(serviceStorageFilePath)
    const absolutInstanceDataDirPath    = ConvertPathToAbsolutPath(instanceDataDirPath)

    const MyServicesPersistentStoreManager = InitializeMyServicesPersistentStoreManager(absolutServiceStorageFilePath)

    const {
        Service             : ServiceModel,
        ImageBuildHistory   : ImageBuildHistoryModel,
        Instance            : InstanceModel,
        Socket              : SocketModel,
        Storage             : StorageModel,
        StorageParam        : StorageParamModel,
        Container           : ContainerModel,
        ContainerEventLog   : ContainerEventLogModel
    } = MyServicesPersistentStoreManager.models

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        ServiceModel,
        ImageBuildHistoryModel,
        InstanceModel,
        SocketModel,
        StorageModel,
        StorageParamModel,
        ContainerModel,
        ContainerEventLogModel
    })

    const { 
        BuildImageFromDockerfileString,
        CreateNewContainer,
        CreateNewVolume,
        RemoveContainer,
        InspectContainer,
        RegisterDockerEventListener,
        StartContainer,
        StopContainer
    } = containerManagerService

    const ServiceRuntimeStateManager = CreateServiceRuntimeStateManager()

    const {
        LoadServiceInStateManagement,
        CreateServiceInStateManagement,
        UpdateServiceInStateManagement,
        TriggerDecommissioningProcess,
        SwapRunningInstance,
        GetServiceStatus,
        GetNetworksSettings,
        onChangeServiceStatus,
        onRequestData,
        NotifyContainerActivity,
        NotifyVolumeActivity,
        StartService,
        StopService,
        ListInstances,
        ListStorages,
        ListSockets,
        ListRunningInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeStorageListData,
        onChangeSocketListData,
        onChangeImageBuildHistoryListData
    } = ServiceRuntimeStateManager

    const {
        CreateService,
        UpdateService,
        BuildImage,
        CreateContainer,
        CreateInstance,
        RegisterStorage
    } = CreateServiceHandler({
        absolutInstanceDataDirPath,
        MyWorkspaceDomainService,
        BuildImageFromDockerfileString,
        CreateNewContainer
    })

    const _Start = async () => {
        await MyServicesPersistentStoreManager.ConnectAndSync()

        RegisterDockerEventListener((eventData) => {

            const { Type, Action, Actor } = eventData
            const { ID, Attributes } = Actor

            switch(Type){
                case "container":
                    NotifyContainerActivity({ ID, Action, Attributes })
                    break
                case "network":
                    switch(Action){
                        case "connect":
                            break
                        case "disconnect":
                            break
                        default:
                            //console.log(eventData) 
                    }
                    break
                case "images":
                    switch(Action){
                        case "create":
                            break
                        case "tag":
                            break
                        default:
                            //console.log(eventData) 
                    }
                case "volume":
                    NotifyVolumeActivity({ ID, Action })
                    break
                default:
                    //console.log(eventData) 
            }

        })

        onRequestData(async (requestType, data) => {
            
            switch (requestType) {
                case RequestTypes.FETCH_INSTANCE_DATA_LIST:
                    return await MyWorkspaceDomainService.ListActiveInstancesByServiceId(data.serviceId)
                case RequestTypes.FETCH_IMAGE_BUILD_DATA_LIST:
                    return await MyWorkspaceDomainService.ListImageBuildHistoryByServiceId(data.serviceId)
                case RequestTypes.FETCH_CONTAINER_DATA:
                    return await await MyWorkspaceDomainService.GetContainerInfoByInstanceId(data.instanceId)
                case RequestTypes.FETCH_CONTAINER_INSPECTION_DATA:
                    return await InspectContainer(data.containerName)
                case RequestTypes.START_CONTAINER:
                    await StartContainer(data.containerHashId)
                    break
                case RequestTypes.STOP_CONTAINER:
                    await StopContainer(data.containerHashId)
                    break
                case RequestTypes.REMOVE_CONTAINER:
                    await RemoveContainer(data.containerHashId)
                    break
                case RequestTypes.FETCH_SERVICE_DATA:
                    const serviceData = await GetService(data.serviceId)
                    return serviceData
                case RequestTypes.CREATE_NEW_INSTANCE:
                    const instanceData = await CreateInstance({
                        serviceId     : data.serviceId,
                        startupParams : data.startupParams,
                        socketParams  : data.socketParams,
                        storageParams : data.storageParams,
                        networkmode   : data.networkmode,
                        ports         : data.ports
                    })
                    return instanceData
                case RequestTypes.REGISTER_STORAGE:
                    const storageData = await RegisterStorage({
                        serviceId: data.serviceId,
                        namespace: data.namespace,
                        filename: data.filename
                    })
                    return storageData
                case RequestTypes.BUILD_NEW_IMAGE:
                    const buildData = await BuildImage({
                        buildId              : data.buildId,
                        imageTagName         : data.imageTagName,
                        repositoryCodePath   : data.originRepositoryCodePath,
                        repositoryNamespace  : data.originRepositoryNamespace,
                        packagePath          : data.originPackagePath,
                        startupParams        : data.startupParams,
                        storageVolumeTargets : data.storageVolumeTargets
                    })
                    return buildData
                case RequestTypes.REGISTER_BUILD_NEW_IMAGE:
                    return await MyWorkspaceDomainService
                        .RegisterBuildNewImage({
                            instanceId: data.instanceId,
                            tag: `ecosystem_${data.repositoryNamespace}:${data.serviceName}-${data.serviceId}`.toLowerCase(),
                        })

                case RequestTypes.CREATE_NEW_CONTAINER:
                    return await CreateContainer({
                        containerName : data.containerName,
                        imageName     : data.imageName,
                        networkmode   : data.networkmode,
                        ports         : data.ports,
                        mounts        : data.mounts
                    })
                case RequestTypes.REGISTER_NEW_CONTAINER:
                    return await MyWorkspaceDomainService
                        .RegisterContainer({
                            containerName : data.containerName,
                            instanceId: data.instanceId,
                            buildId: data.buildId
                        })

                case RequestTypes.MARK_AS_DECOMMISSIONED:
                    await MyWorkspaceDomainService.MarkAsDecommissioned(data.serviceId)
                    break
                case RequestTypes.CREATE_NEW_VOLUME:
                    return await CreateNewVolume({
                        volumeName: data.volumeName, 
                        labels: data.labels
                    })
                case RequestTypes.REGISTER_STORAGE_PARAM:
                    return await MyWorkspaceDomainService
                        .RegisterStorageParam({
                            namespace: data.namespace,
                            parameter: data.parameter,
                            instanceId: data.instanceId
                        })
                    break
                case RequestTypes.UPDATE_STORAGE_PARAM_STORAGE_ID:
                    return await MyWorkspaceDomainService
                        .UpdateStorageParamStorageId({
                            storageParamId: data.storageParamId,
                            storageId: data.storageId
                        })
                default:
                    console.warn(`Unknown request type: ${requestType.description}`)
            }
        })

        await InitializeAllServiceStateManagement()
        onReady()

    }

    const InitializeAllServiceStateManagement = async  () => {
        const serviceIds = await MyWorkspaceDomainService.ListAllServiceId()
        serviceIds.forEach(serviceId => LoadServiceInStateManagement(serviceId))
    }

    const ProvisionService = async ({
        serviceName,
        serviceDescription,
        originRepositoryNamespace,
        originRepositoryCodePath,
        originPackagePath,
        startupParams,
        socketParams,
        storageParams,
        ports = [],
        networkmode= "bridge"
    }) => {

        const serviceData = await CreateService({
                serviceName,
                serviceDescription,
                originRepositoryNamespace,
                originRepositoryCodePath,
                originPackagePath
            })

        CreateServiceInStateManagement(serviceData.id, {
            startupParams,
            socketParams,
            storageParams,
            ports,
            networkmode
        })
    }

    const UpdateProvisionService = async ({
        serviceId,
        serviceName,
        serviceDescription,
        originRepositoryNamespace,
        originRepositoryCodePath,
        originPackagePath,
        startupParams,
        socketParams,
        storageParams,
        ports,
        networkmode
    }) => {

        await UpdateService({
            serviceId,
            serviceName,
            serviceDescription,
            originRepositoryNamespace,
            originRepositoryCodePath,
            originPackagePath
        })

        UpdateServiceInStateManagement(serviceId, {
            startupParams,
            socketParams,
            storageParams,
            ports,
            networkmode
        })
        
    }

    const TerminateService = async ({ serviceId }) => {
        
    }

    const _GetProvisionedServiceInfo = (serviceData) => {
        const { 
            id: serviceId,
            serviceName,
            originRepositoryNamespace
        } = serviceData   

        return {
            status : GetServiceStatus(serviceId),
            serviceId,
            serviceName,
            originRepositoryNamespace
        }
    }

    const ListServices = async () => {
        const servicesData = await MyWorkspaceDomainService.ListServices()
        const provisionedServicesData = servicesData
            .map((servicesData) => _GetProvisionedServiceInfo(servicesData))
        return provisionedServicesData
    }

    const ListProvisionedServices = async () => {
        const servicesData = await MyWorkspaceDomainService.ListProvisionedServices()
        const provisionedServicesData = servicesData
            .map((servicesData) => _GetProvisionedServiceInfo(servicesData))
        return provisionedServicesData
    }


    const GetService = async (serviceId) => {
            
        const serviceData = await MyWorkspaceDomainService.GetServiceById(serviceId)

        const {
            serviceName,
            serviceDescription,
            appType,
            instanceRepositoryCodePath,
            originRepositoryNamespace,
            originRepositoryCodePath,
            originPackagePath
        } = serviceData

        return {
            serviceId,
            serviceName,
            serviceDescription,
            appType,
            instanceRepositoryCodePath,
            originRepositoryNamespace,
            originRepositoryCodePath,
            originPackagePath
        }

    }

    const GetInstanceStartupParamsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData?.startupParams || {}
    }

    const GetInstancePortsData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        return instanceData.ports || []
    }

    const GetNetworkModeData = async (serviceId) => {
        const instanceData = await MyWorkspaceDomainService.GetLastInstanceByServiceId(serviceId)
        if(instanceData?.networkmode)
            return instanceData.networkmode
    }

    const _GetFirstRunningInstance = (serviceId) => {
        const runningInstances = ListRunningInstances(serviceId)
        const [ firstInstanceRunning ] = runningInstances
        return firstInstanceRunning
    }

    const UpdateServicePorts = async ({ serviceId, ports }) => {
        const firstInstanceRunning = _GetFirstRunningInstance(serviceId)
        SwapRunningInstance(serviceId, {
            ports,
            startupParams: firstInstanceRunning.startupParams,
            networkmode: firstInstanceRunning.networkmode
        })
    }

    const UpdateServiceStartupParams = async ({ serviceId, startupParams }) => {
        const firstInstanceRunning = _GetFirstRunningInstance(serviceId)
        SwapRunningInstance(serviceId, {
            ports: firstInstanceRunning.ports,
            startupParams,
            networkmode: firstInstanceRunning.networkmode
        })
    }

    _Start()

    return {
        ProvisionService,
        DecommissionService: TriggerDecommissioningProcess,
        ListProvisionedServices,
        GetService,
        ListServices,
        ListInstances,
        ListStorages,
        ListSockets,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeStorageListData,
        onChangeSocketListData,
        onChangeImageBuildHistoryListData,
        GetServiceStatus,
        GetNetworksSettings,
        onChangeServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts,
        UpdateServiceStartupParams,
        UpdateProvisionService,
        TerminateService
    }

}

module.exports = ServiceOrchestratorManager