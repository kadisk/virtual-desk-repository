const MountCommandService = require("../Helpers/MountCommandService")

const UsersController = (params) => {

	const {
		iamManagerServerManagerUrl,
		iamManagerSocketPath,
		commandExecutorLib
	} = params

	const IAMCommand = MountCommandService({ 
        serverManagerUrl: iamManagerServerManagerUrl,
        socketPath: iamManagerSocketPath, 
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.IAMAppInstance.UserManagement
    })

    const ListUsers = async ({ authenticationData }) => {
        const { userId, username } = authenticationData

		const users = await IAMCommand((API) => API.ListUsers())

        return users
    }

    const controllerServiceObject = {
        controllerName   : "UsersController",
        ListUsers
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = UsersController