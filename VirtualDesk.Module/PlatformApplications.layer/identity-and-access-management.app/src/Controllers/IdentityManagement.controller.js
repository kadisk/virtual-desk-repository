const ServiceManagerInterfaceController = (params) => {

    const {
        iamManagerService
    } = params

    const CreateOrganization = (name) => {
        return iamManagerService.CreateOrganization(name)
    }

    const controllerServiceObject = {
        controllerName: "ServiceManagerInterfaceController",
        CreateOrganization
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = ServiceManagerInterfaceController