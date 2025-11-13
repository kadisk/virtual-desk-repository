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
        User: UserModel,
        ServiceIdentity: ServiceIdentityModel,
        Device: DeviceModel
    } = IAMPersistentStoreManager.models

    const IAMDomainService = CreateIAMDomainService({
        OrganizationModel,
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
        CreateOrganization       : IAMDomainService.CreateOrganization,
        ListOrganizations        : IAMDomainService.ListOrganizations,
        GetOrganization          : IAMDomainService.GetOrganization,
        UpdateOrganizationName   : IAMDomainService.UpdateOrganizationName,
        DeleteOrganization       : IAMDomainService.DeleteOrganization,
        CreateUser               : IAMDomainService.CreateUser,
        ListUsers                : IAMDomainService.ListUsers,
        VerifyPasswordAndGetUser : IAMDomainService.VerifyPasswordAndGetUser,
    }

}

module.exports = IdentityAndAccessManager