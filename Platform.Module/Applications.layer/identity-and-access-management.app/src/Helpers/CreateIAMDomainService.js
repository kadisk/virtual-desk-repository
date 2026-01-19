const bcrypt = require('bcrypt')

const CreateIAMDomainService = ({ UserModel }) => {

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
    
    return {
        CheckUserExist,
        VerifyPasswordAndGetUser
    }
}

module.exports = CreateIAMDomainService