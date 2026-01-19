const bcrypt = require('bcrypt')

const CreateUserDomainService = ({ UserModel }) => {

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

    const GetUser = async (userId) => {
        const user  = await UserModel.findOne({
            attributes: { exclude: ['passwordHash'] },
            where: { id:userId }
        })
        return user
    }
    
    return {
        CreateUser,
        ListUsers,
        GetUser
    }
}

module.exports = CreateUserDomainService