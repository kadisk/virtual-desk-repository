const { join } = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeIAMPersistentStoreManager = require("../Helpers/InitializeIAMPersistentStoreManager")

const IAMPersistentStoreManager = (params) => {

    const {
        onReady,
        storageFilePath
    } = params

    const absolutServiceStorageFilePath = ConvertPathToAbsolutPath(storageFilePath)

    const IAMPersistentStoreManager = InitializeIAMPersistentStoreManager(absolutServiceStorageFilePath)

    const {
        Organization: OrganizationModel,
        User: UserModel,
        ServiceIdentity: ServiceIdentityModel,
        Device: DeviceModel
    } = IAMPersistentStoreManager.models



    const _Start = async () => {
        await IAMPersistentStoreManager.ConnectAndSync()
        onReady()
    }

    _Start()

    return {
        OrganizationModel,
        UserModel,
        ServiceIdentityModel,
        DeviceModel
    }

}

module.exports = IAMPersistentStoreManager