const IdentityManagementController = (params) => {

    const {
        iamManagerService: {
            CreateOrganization,
            ListOrganizations
        }
    } = params

    const controllerServiceObject = {
        controllerName: "IdentityManagementController",
        CreateOrganization,
        ListOrganizations
    }
    
    return Object.freeze(controllerServiceObject)
}

module.exports = IdentityManagementController