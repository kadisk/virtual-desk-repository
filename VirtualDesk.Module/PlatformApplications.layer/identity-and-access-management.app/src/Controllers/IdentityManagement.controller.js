const IdentityManagementController = (params) => {

    const { iamManagerService } = params

    const controllerServiceObject = {
        controllerName           : "IdentityManagementController",
        CheckUserExist           : iamManagerService.CheckUserExist,
        VerifyPasswordAndGetUser : iamManagerService.VerifyPasswordAndGetUser
    }
    
    return Object.freeze(controllerServiceObject)
}

module.exports = IdentityManagementController