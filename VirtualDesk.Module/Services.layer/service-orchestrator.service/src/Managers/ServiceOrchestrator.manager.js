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
        SocketParam         : SocketParamModel,
        Storage             : StorageModel,
        StorageParam        : StorageParamModel,
        HostMount           : HostMountModel,
        HostMountParam      : HostMountParamModel,
        Container           : ContainerModel,
        ContainerEventLog   : ContainerEventLogModel
    } = MyServicesPersistentStoreManager.models

    const MyWorkspaceDomainService = CreateMyWorkspaceDomainService({
        ServiceModel,
        ImageBuildHistoryModel,
        InstanceModel,
        SocketModel,
        SocketParamModel,
        StorageModel,
        StorageParamModel,
        HostMountModel,
        HostMountParamModel,
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
        ListStoragesParam,
        ListSockets,
        ListSocketsParam,
        ListHostMounts,
        ListHostMountsParam,
        LoadHostMountInStateManagement,
        ListRunningInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeStorageListData,
        onChangeStorageParamListData,
        onChangeSocketListData,
        onChangeSocketParamListData,
        onChangeHostMountListData,
        onChangeHostMountParamListData,
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
                case RequestTypes.FETCH_STORAGE_DATA_LIST:
                    return await MyWorkspaceDomainService.ListStoragesByServiceId(data.serviceId)
                case RequestTypes.FETCH_STORAGE_PARAM_DATA_LIST:
                    return await MyWorkspaceDomainService.ListStorageParamsByInstanceId(data.instanceId)
                case RequestTypes.FETCH_SOCKET_DATA_LIST:
                    return await MyWorkspaceDomainService.ListSocketsByServiceId(data.serviceId)
                case RequestTypes.FETCH_SOCKET_PARAM_DATA_LIST:
                    return await MyWorkspaceDomainService.ListSocketParamsByInstanceId(data.instanceId)
                case RequestTypes.FETCH_HOST_MOUNT_PARAM_DATA_LIST:
                    return await MyWorkspaceDomainService.ListHostMountParamsByInstanceId(data.instanceId)
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
                        serviceId       : data.serviceId,
                        startupParams   : data.startupParams,
                        socketParams    : data.socketParams,
                        storageParams   : data.storageParams,
                        hostMountParams : data.hostMountParams,
                        networkmode     : data.networkmode,
                        ports           : data.ports
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
                case RequestTypes.REGISTER_SOCKET:
                    return await MyWorkspaceDomainService
                        .RegisterSocket({
                            instanceId: data.instanceId,
                            namespace: data.namespace,
                            socketPath: data.socketPath
                        })
                case RequestTypes.CREATE_NEW_SOCKET_VOLUME:
                    return await CreateNewVolume({
                        volumeName: data.volumeName,
                        labels: data.labels
                    })
                case RequestTypes.REGISTER_SOCKET_PARAM:
                    return await MyWorkspaceDomainService
                        .RegisterSocketParam({
                            namespace: data.namespace,
                            parameter: data.parameter,
                            instanceId: data.instanceId
                        })
                case RequestTypes.UPDATE_SOCKET_PARAM_SOCKET_ID:
                    return await MyWorkspaceDomainService
                        .UpdateSocketParamSocketId({
                            socketParamId: data.socketParamId,
                            socketId: data.socketId
                        })
                case RequestTypes.REGISTER_HOST_MOUNT_PARAM:
                    return await MyWorkspaceDomainService
                        .RegisterHostMountParam({
                            namespace: data.namespace,
                            parameter: data.parameter,
                            instanceId: data.instanceId
                        })
                case RequestTypes.UPDATE_HOST_MOUNT_PARAM_HOST_MOUNT_ID:
                    return await MyWorkspaceDomainService
                        .UpdateHostMountParamHostMountId({
                            hostMountParamId: data.hostMountParamId,
                            hostMountId: data.hostMountId
                        })
                default:
                    console.warn(`Unknown request type: ${requestType.description}`)
            }
        })

        await InitializeAllHostMounts()
        await InitializeAllServiceStateManagement()
        onReady()

    }

    const InitializeAllServiceStateManagement = async  () => {
        const serviceIds = await MyWorkspaceDomainService.ListAllServiceId()
        serviceIds.forEach(serviceId => LoadServiceInStateManagement(serviceId))
    }

    const InitializeAllHostMounts = async () => {
        const hostMounts = await MyWorkspaceDomainService.ListHostMounts()
        hostMounts.forEach(({ id, namespace, hostPath, type }) =>
            LoadHostMountInStateManagement(id, { namespace, hostPath, type }))
    }

    const RegisterHostMount = async ({ namespace, hostPath }) => {
        const existing = await MyWorkspaceDomainService.GetHostMountByNamespace(namespace)
        if (existing) {
            throw new Error(`HostMount com namespace "${namespace}" já existe`)
        }

        let type = "unknown"
        try {
            const stats = require("fs").statSync(hostPath)
            type = stats.isDirectory() ? "directory" : (stats.isFile() ? "file" : "other")
        } catch (e) {
            console.warn(`HostMount "${namespace}": caminho "${hostPath}" não existe ainda no host`)
        }

        const hostMountData = await MyWorkspaceDomainService.RegisterHostMount({ namespace, hostPath, type })
        LoadHostMountInStateManagement(hostMountData.id, { namespace, hostPath, type })
        return { hostMountId: hostMountData.id, namespace, hostPath, type }
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
        hostMountParams,
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
            hostMountParams,
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
        ListStorageParams: ListStoragesParam,
        ListSockets,
        ListSocketParams: ListSocketsParam,
        ListHostMounts,
        ListHostMountParams: ListHostMountsParam,
        RegisterHostMount,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeStorageListData,
        onChangeStorageParamListData,
        onChangeSocketListData,
        onChangeSocketParamListData,
        onChangeHostMountListData,
        onChangeHostMountParamListData,
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