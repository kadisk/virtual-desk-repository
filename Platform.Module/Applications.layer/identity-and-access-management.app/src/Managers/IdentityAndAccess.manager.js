const CreateIAMDomainService = require("../Helpers/CreateIAMDomainService")

const IdentityAndAccessManager = (params) => {

    const {
        onReady,
        iamPersistentStoreManagerService
    } = params

    const { UserModel } = iamPersistentStoreManagerService

    const IAMDomainService = CreateIAMDomainService({ UserModel })

    const _Start = async () => {
        onReady()
    }

    _Start()

    return {
        VerifyPasswordAndGetUser : IAMDomainService.VerifyPasswordAndGetUser,
        CheckUserExist           : IAMDomainService.CheckUserExist
    }

}

module.exports = IdentityAndAccessManager