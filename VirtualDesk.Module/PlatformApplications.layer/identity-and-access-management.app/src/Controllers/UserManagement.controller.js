const UserManagementController = (params) => {

    const { userManagerService } = params

    const controllerServiceObject = {
        controllerName : "UserManagementController",
        CreateUser     : userManagerService.CreateUser,
        ListUsers      : userManagerService.ListUsers,
        GetUser        : userManagerService.GetUser
    }
    
    return Object.freeze(controllerServiceObject)
}

module.exports = UserManagementController