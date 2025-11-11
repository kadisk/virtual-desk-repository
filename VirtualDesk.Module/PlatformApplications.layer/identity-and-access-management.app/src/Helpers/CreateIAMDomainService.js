const CreateIAMDomainService = ({
        OrganizationModel,
        AccountModel,
        UserModel,
        ServiceIdentityModel,
        DeviceModel
    }) => {


    const CreateOrganization = async (name) => {
        const organization = await OrganizationModel.create({ name })
        return organization
    }

    const ListOrganizations = async () => {
        const organizations = await OrganizationModel.findAll()
        return organizations
    }
    
    return {
        CreateOrganization,
        ListOrganizations
    }
}

module.exports = CreateIAMDomainService