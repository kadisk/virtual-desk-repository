const MountCommandService = require("../Helpers/MountCommandService")

const OrganizationsController = (params) => {

	const {
		iamManagerServerManagerUrl,
		iamManagerSocketPath,
		commandExecutorLib
	} = params

	const IAMCommand = MountCommandService({ 
        serverManagerUrl: iamManagerServerManagerUrl,
        socketPath: iamManagerSocketPath, 
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.IAMAppInstance.IdentityManagement
    })

    const ListOrganizations = async () => {
		const organizations = await IAMCommand((API) => API.ListOrganizations())

        return organizations
    }

    const controllerServiceObject = {
        controllerName   : "OrganizationsController",
        ListOrganizations
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = OrganizationsController