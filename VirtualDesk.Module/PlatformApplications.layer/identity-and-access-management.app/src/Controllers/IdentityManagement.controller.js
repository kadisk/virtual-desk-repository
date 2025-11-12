const IdentityManagementController = (params) => {

    const { iamManagerService } = params

    const controllerServiceObject = {
        controllerName         : "IdentityManagementController",
        CreateOrganization     : iamManagerService.CreateOrganization,
        ListOrganizations      : iamManagerService.ListOrganizations,
        GetOrganization        : iamManagerService.GetOrganization,
        UpdateOrganizationName : iamManagerService.UpdateOrganizationName,
        DeleteOrganization     : iamManagerService.DeleteOrganization,
    }
    
    return Object.freeze(controllerServiceObject)
}

module.exports = IdentityManagementController