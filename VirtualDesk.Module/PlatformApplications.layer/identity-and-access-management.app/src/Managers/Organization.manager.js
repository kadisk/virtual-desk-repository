const CreateOrganizationDomainService = require("../Helpers/CreateOrganizationDomainService")

const OrganizationManager = (params) => {

    const {
        onReady,
        iamPersistentStoreManagerService
    } = params

    const { OrganizationModel } = iamPersistentStoreManagerService

    const OrganizationDomainService = CreateOrganizationDomainService({ OrganizationModel })

    const _Start = async () => {
        onReady()
    }

    _Start()

    return {
        CreateOrganization     : OrganizationDomainService.CreateOrganization,
        ListOrganizations      : OrganizationDomainService.ListOrganizations,
        GetOrganization        : OrganizationDomainService.GetOrganization,
        UpdateOrganizationName : OrganizationDomainService.UpdateOrganizationName,
        DeleteOrganization     : OrganizationDomainService.DeleteOrganization
    }

}

module.exports = OrganizationManager