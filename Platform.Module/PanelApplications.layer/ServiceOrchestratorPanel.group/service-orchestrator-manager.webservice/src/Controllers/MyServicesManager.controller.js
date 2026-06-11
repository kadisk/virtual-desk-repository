const MyServicesManagerController = (params) => {

    const {
        serviceOrchestratorSocketPath,
        serviceOrchestratorServerManagerUrl,
        repositoryStorageSocketPath,
        repositoryStorageServerManagerUrl,
        commandExecutorLib
    } = params
    
    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const ServiceOrchestratorCommand = async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .ServiceOrchestratorAppInstance
            .ServiceManagerInterface
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: serviceOrchestratorServerManagerUrl,
            mainApplicationSocketPath: serviceOrchestratorSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const RepositoryStorageCommand = async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .RepositoryStorageManagerAppInstance
            .RepositoryStorageManager
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: repositoryStorageServerManagerUrl,
            mainApplicationSocketPath: repositoryStorageSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const ServiceManagerSocketBridgeCommand = (websocket, GetSocket) => {
        ServiceOrchestratorCommand((API) => {
            const socket =  GetSocket(API)
            socket.onmessage = (event) => {
                const {data} = event
                websocket.send(data)
            }
        })
    }

    const ListProvisionedServices = ( ) => {
        return ServiceOrchestratorCommand(async (API) => API.ListProvisionedServices())
    }

    const GetServiceData                 = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.GetService({ serviceId }))
    const ListImageBuildHistory          = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListImageBuildHistory({ serviceId }))
    const ListInstances                  = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListInstances({ serviceId }))
    const ListStorages                   = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListStorages({ serviceId }))
    const ListStorageParams              = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListStorageParams({ serviceId }))
    const ListSockets                    = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListSockets({ serviceId }))
    const ListSocketParams               = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListSocketParams({ serviceId }))
    const ListContainers                 = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.ListContainers({ serviceId }))
    const StartService                   = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.StartService({ serviceId }))
    const StopService                    = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.StopService({ serviceId }))
    const GetServiceStatus               = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.GetServiceStatus({ serviceId }))
    const GetNetworksSettings            = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.GetNetworksSettings({ serviceId }))
    const GetInstanceStartupParamsData   = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.GetInstanceStartupParamsData({ serviceId }))
    const GetInstancePortsData           = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.GetInstancePortsData({ serviceId }))
    const GetNetworkModeData             = ( serviceId )                  => ServiceOrchestratorCommand((API) => API.GetNetworkModeData({ serviceId }))
    const UpdateServicePorts             = ({ serviceId, ports })         => ServiceOrchestratorCommand((API) => API.UpdateServicePorts({ serviceId, ports }))
    const UpdateServiceStartupParams     = ({ serviceId, startupParams }) => ServiceOrchestratorCommand((API) => API.UpdateServiceStartupParams({ serviceId, startupParams }))

    const ServicesStatusChange        = (websocket)            => ServiceManagerSocketBridgeCommand(websocket, (API) => API.ServicesStatusChange())
    const InstanceListChange          = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.InstanceListChange({serviceId}))
    const StorageListChange           = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.StorageListChange({serviceId}))
    const StorageParamListChange      = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.StorageParamListChange({serviceId}))
    const SocketListChange            = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.SocketListChange({serviceId}))
    const SocketParamListChange       = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.SocketParamListChange({serviceId}))
    const ContainerListChange         = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.ContainerListChange({serviceId}))
    const ImageBuildHistoryListChange = (websocket, serviceId) => ServiceManagerSocketBridgeCommand(websocket, (API) => API.ImageBuildHistoryListChange({serviceId}))

    const ProvisionService = async ({
        packageId,
        serviceName,
        serviceDescription,
        startupParams,
        socketParams,
        storageParams,
        ports,
        networkmode
    }) => {

        const packageData = await RepositoryStorageCommand((API) => API.GetPackageById({ packageId }))
        
        const { 
            repositoryNamespace,
            repositoryCodePath,
            packagePath
        } = packageData

        await ServiceOrchestratorCommand((API) => 
            API.ProvisionService({
                serviceName,
                serviceDescription,
                originRepositoryNamespace: repositoryNamespace,
                originRepositoryCodePath: repositoryCodePath,
                originPackagePath: packagePath,
                startupParams, 
                socketParams,
                storageParams,
                ports,
                networkmode
            }))
    }

    const controllerServiceObject = {
        controllerName: "MyServicesManagerController",
        ListProvisionedServices,
        GetServiceData,
        GetNetworksSettings,
        ListImageBuildHistory,
        ListInstances,
        ListStorages,
        ListStorageParams,
        ListSockets,
        ListSocketParams,
        ListContainers,
        ServicesStatusChange,
        InstanceListChange,
        StorageListChange,
        StorageParamListChange,
        SocketListChange,
        SocketParamListChange,
        ContainerListChange,
        ImageBuildHistoryListChange,
        GetServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts,
        UpdateServiceStartupParams,
        ProvisionService,
        ///GetContainerLogs: (serviceId, containerId) => ServiceOrchestratorCommand((API) => API.GetContainerLogs({ serviceId, containerId }))
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = MyServicesManagerController