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

    const CreateUser = async ({ name, username, email, password }) => {
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await UserModel.create({ name, username, email, passwordHash })
        const safeUser = typeof user.toJSON === 'function' ? user.toJSON() : { ...user }
        delete safeUser.passwordHash    
        return safeUser
    }

    const ListUsers = async () => {
        const users = await UserModel.findAll({
            attributes: { exclude: ['passwordHash'] }
        })
        return users
    }

    const CheckUserExist = async ({ email , username }) => {
        const existingUser = await UserModel.findOne({
            where: {
                [Sequelize.Op.or]: [{ email }, { username }]
            }
        })
        return !!existingUser
    }

    const GetUserByUsername = async (username) => {
        const user = await UserModel.findOne({ where: { username } })
        return user
    }

    const VerifyPasswordAndGetUser = async ({ username, password }) => {
        try {
            
            const user = await GetUserByUsername(username)
            if (!user) return null

            const match = await bcrypt.compare(password, user.passwordHash)
            if (!match) return null

            const safeUser = typeof user.toJSON === 'function' ? user.toJSON() : { ...user }
            delete safeUser.passwordHash    
            return safeUser
        } catch (error) {
            console.error('Error verifying password:', error)
            throw error
        }
    }

    const GetUser = async (userId) => {
        const user  = await UserModel.findOne({
            attributes: { exclude: ['passwordHash'] },
            where: { id:userId }
        })
        return user
    }
    
    return {
        CreateOrganization,
        ListOrganizations,
        GetOrganization,
        UpdateOrganizationName,
        DeleteOrganization,
        CreateUser,
        ListUsers,
        CheckUserExist,
        VerifyPasswordAndGetUser,
        GetUser
    }
}

module.exports = CreateIAMDomainService