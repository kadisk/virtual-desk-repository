const ServiceManagerInterfaceController = (params) => {

    const {
        servicesOrchestratorService
    } = params

    const {
        ListServices,
        ListProvisionedServices,
        GetService,
        GetNetworksSettings,
        ListImageBuildHistory,
        ListInstances,
        ListStorages,
        ListSockets,
        ListContainers,
        GetServiceStatus,
        StartService,
        StopService,
        GetInstanceStartupParamsData,
        GetInstancePortsData,
        GetNetworkModeData,
        UpdateServicePorts,
        UpdateServiceStartupParams,
        ProvisionService,
        DecommissionService,
        UpdateProvisionService,
        TerminateService
    } = servicesOrchestratorService

    const ServicesStatusChange = async (websocket) => {
        servicesOrchestratorService
            .onChangeServiceStatus(({ serviceId, status }) => {
                websocket.send(JSON.stringify({ serviceId, status }))
            })
    }

    const InstanceListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeInstanceListData(serviceId, (instanceList) => {
                websocket.send(JSON.stringify(instanceList))
            })
    }

    const StorageListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeStorageListData(serviceId, (storageList) => {
                websocket.send(JSON.stringify(storageList))
            })
    }

    const SocketListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeSocketListData(serviceId, (socketList) => {
                websocket.send(JSON.stringify(socketList))
            })
    }

    const ContainerListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeContainerListData(serviceId, (containerList) => {
                websocket.send(JSON.stringify(containerList))
            })
    }

    const ImageBuildHistoryListChange = async (websocket, serviceId) => {
        servicesOrchestratorService
            .onChangeImageBuildHistoryListData(serviceId, (imageBuildHistoryList) => {
                websocket.send(JSON.stringify(imageBuildHistoryList))
            })
    }

    const controllerServiceObject = {
        controllerName: "ServiceManagerInterfaceController",
        ListServices,
        ListProvisionedServices,
        GetService,
        GetNetworksSettings,
        ListImageBuildHistory,
        ListInstances,
        ListStorages,
        ListSockets,
        ListContainers,
        ServicesStatusChange,
        InstanceListChange,
        StorageListChange,
        SocketListChange,
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
        UpdateProvisionService,
        DecommissionService,
        TerminateService
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceManagerInterfaceController