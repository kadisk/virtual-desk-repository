const jwt = require('jsonwebtoken')
const path = require("path")
const os = require('os')

// Constantes para o usuário padrão
const DEFAULT_USER = 'su'
const DEFAULT_PASSWORD = 'su'
const DEFAULT_EMAIL = 'su@su'

const UserManagementService = (params) => {

    const {
        secretKey,
        onReady,
        iamStorageSocketPath,
        iamStorageServerManagerUrl,
        commandExecutorLib
    } = params

    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const CreateIAMCommand = (apiName) => async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs.IAMAppInstance[apiName]
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: iamStorageServerManagerUrl,
            mainApplicationSocketPath: iamStorageSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const IAMUserManagementCommand =  (CommandFunction) => 
        CreateIAMCommand('UserManagement')(CommandFunction)

    const IAMIdentityManagementCommand =  (CommandFunction) => 
        CreateIAMCommand('IdentityManagement')(CommandFunction)


    const _Start = async () => {
        try {
            const users = await IAMUserManagementCommand((API) => API.ListUsers())

            if (users.length === 0) {
                await IAMUserManagementCommand((API) =>
                    API.CreateUser({
                        name: DEFAULT_USER,
                        username: DEFAULT_USER,
                        email: DEFAULT_EMAIL,
                        password: DEFAULT_PASSWORD
                    })
                )
            }

            onReady()
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }

    _Start()

    const CreateNewUser = async ({ name, username, email, password }) => {
        try {
            const existingUser = await IAMIdentityManagementCommand((API) => API.CheckUserExist({ email , username }))

            if (existingUser) 
                throw new Error('User with the same email or username already exists')
            const newUser = await IAMUserManagementCommand((API) => API.CreateUser({ name, username, email, password }))
            return newUser
        } catch (error) {
            console.error('Error creating user:', error)
            throw error
        }
    }

    const ListUsers = async () => {
        try {
            const users = await IAMUserManagementCommand((API) => API.ListUsers())
            return users
        } catch (error) {
            console.error('Error listing users:', error)
            throw error
        }
    }

    const SignToken = async ({ username, password }) => {
        const user = await IAMIdentityManagementCommand((API) => API.VerifyPasswordAndGetUser({ username, password }))
        if (user){
            const { id, username } = user
            const token = jwt.sign({ userId: id, username }, secretKey, { expiresIn: '1h' })
            return token
        }else {
            return undefined
        }
    }

    const GetUser = async (id) => {
        try {
            const user = await IAMUserManagementCommand((API) => API.GetUser({ userId: id }))
            return user
        } catch (error) {
            console.error('Error getting user:', error)
            throw error
        }
    }
    
    return {
        CreateNewUser,
        ListUsers,
        SignToken,
        GetUser
    }

}

module.exports = UserManagementService