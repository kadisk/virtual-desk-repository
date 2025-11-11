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
    
    return {
        CreateOrganization
    }
}

module.exports = CreateIAMDomainService