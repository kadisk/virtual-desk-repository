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

    const GetOrganization = async (organizationId) => {
        const organization = await OrganizationModel.findByPk(organizationId)
        return organization
    }

    const UpdateOrganizationName = async ({ organizationId, name}) => {
        const organization = await OrganizationModel.findByPk(organizationId)
        if (!organization) {
            throw new Error(`Organização com ID "${organizationId}" não encontrada.`)
        }
        organization.name = name
        await organization.save()
        return organization
    }

    const DeleteOrganization = async (organizationId) => {
        const organization = await OrganizationModel.findByPk(organizationId)
        if (!organization) {
            throw new Error(`Organização com ID "${organizationId}" não encontrada.`)
        }
        await organization.destroy()
        return true
    }
    
    return {
        CreateOrganization,
        ListOrganizations,
        GetOrganization,
        UpdateOrganizationName,
        DeleteOrganization
    }
}

module.exports = CreateIAMDomainService