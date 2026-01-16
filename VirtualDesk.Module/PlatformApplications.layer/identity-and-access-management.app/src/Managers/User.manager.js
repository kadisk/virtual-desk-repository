const CreateUserDomainService = require("../Helpers/CreateUserDomainService")

const UserManager = (params) => {

    const {
        onReady,
        iamPersistentStoreManagerService
    } = params

    const { UserModel } = iamPersistentStoreManagerService

    const UserDomainService = CreateUserDomainService({ UserModel})

    const _Start = async () => {
        onReady()
    }

    _Start()

    return {
        CreateUser : UserDomainService.CreateUser,
        ListUsers  : UserDomainService.ListUsers,
        GetUser    : UserDomainService.GetUser,
    }

}

module.exports = UserManager