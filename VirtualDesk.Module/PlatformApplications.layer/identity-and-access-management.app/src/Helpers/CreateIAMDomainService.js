const bcrypt = require('bcrypt')

const CreateIAMDomainService = ({
        OrganizationModel,
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

    const CreateUser = async ({ name, email, password }) => {
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await UserModel.create({ name, email, passwordHash })
        return user
    }

    const ListUsers = async () => {
        const users = await UserModel.findAll()
        return users
    }
    
    return {
        CreateOrganization,
        ListOrganizations,
        GetOrganization,
        UpdateOrganizationName,
        DeleteOrganization,
        CreateUser,
        ListUsers
    }
}

module.exports = CreateIAMDomainService