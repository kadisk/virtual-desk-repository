const ContainerManagerController = (params) => {

    const {
        containerManagerService
    } = params

    const controllerServiceObject = {
        controllerName         : "ContainerManagerController",
        ListContainers         : containerManagerService.ListAllContainers,
        ListImages             : containerManagerService.ListAllImages,
        ListNetworks           : containerManagerService.ListAllNetworks,
        InspectNetwork         : containerManagerService.InspectNetwork,
        ListVolumes            : containerManagerService.ListAllVolumes,
        RemoveContainer        : containerManagerService.RemoveContainer,
        StartContainer         : containerManagerService.StartContainer,
        StopContainer          : containerManagerService.StopContainer,
        InspectContainer       : containerManagerService.InspectContainer,
        GetContainerLogHistory : containerManagerService.GetContainerLogHistory,
        InspectNetwork         : containerManagerService.InspectNetwork,
        CreateNewNetwork       : containerManagerService.CreateNewNetwork,
        InspectVolume          : containerManagerService.InspectVolume
    }
    
    return Object.freeze(controllerServiceObject)

}

module.exports = ContainerManagerController