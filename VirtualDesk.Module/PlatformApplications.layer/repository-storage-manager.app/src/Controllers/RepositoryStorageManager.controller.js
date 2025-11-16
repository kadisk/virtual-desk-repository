const RepositoryStorageManagerController = (params) => {

    const { 
        repositoryStorageManagerService 
    } = params

    const {
        GetPackageId,
        GetTotalNamespaceByUserId,
        ListRepositories,
        ListRepositoryNamespace,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        GetNamespace,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetMetadataByPackageId,
        ListBootablePackages,
        ListRepositoriesByUserId,
        GetPackageById,
        GetRepositoriesImportedList,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetNamespaceByRepositoryId,
        GetItemById
    } = repositoryStorageManagerService

    const controllerServiceObject = {
        controllerName: "RepositoryStorageManagerController",
        GetPackageId,
        GetTotalNamespaceByUserId,
        ListRepositories,
        ListRepositoryNamespace,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        GetNamespace,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetMetadataByPackageId,
        ListBootablePackages,
        ListRepositoriesByUserId,
        GetPackageById,
        GetRepositoriesImportedList,
        ListItemByRepositoryId,
        GetNamespaceByRepositoryId,
        GetRepositoryImported,
        GetItemById
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryStorageManagerController