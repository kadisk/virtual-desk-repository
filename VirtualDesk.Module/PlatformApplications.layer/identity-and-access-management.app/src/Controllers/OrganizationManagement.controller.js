const OrganizationManagementController = (params) => {

    const { organizationManagerService } = params

    const controllerServiceObject = {
        controllerName         : "OrganizationManagementController",
        CreateOrganization     : organizationManagerService.CreateOrganization,
        ListOrganizations      : organizationManagerService.ListOrganizations,
        GetOrganization        : organizationManagerService.GetOrganization,
        UpdateOrganizationName : organizationManagerService.UpdateOrganizationName,
        DeleteOrganization     : organizationManagerService.DeleteOrganization,
    }
    
    return Object.freeze(controllerServiceObject)
}

module.exports = OrganizationManagementController