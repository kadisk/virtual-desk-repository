const { join } = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeIAMPersistentStoreManager = require("../Helpers/InitializeIAMPersistentStoreManager")

const CreateIAMDomainService = require("../Helpers/CreateIAMDomainService")

const IdentityAndAccessManager = (params) => {

    const {
        onReady,
        storageFilePath
    } = params

    const absolutServiceStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)

    const IAMPersistentStoreManager = InitializeIAMPersistentStoreManager(absolutServiceStorageFilePath)

    const {
        Organization: OrganizationModel,
        Account: AccountModel,
        User: UserModel,
        ServiceIdentity: ServiceIdentityModel,
        Device: DeviceModel
    } = IAMPersistentStoreManager.models

    const IAMDomainService = CreateIAMDomainService({
        OrganizationModel,
        AccountModel,
        UserModel,
        ServiceIdentityModel,
        DeviceModel
    })

    const _Start = async () => {
        await IAMPersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()

    return {
        CreateOrganization: IAMDomainService.CreateOrganization,
    }

}

module.exports = IdentityAndAccessManager