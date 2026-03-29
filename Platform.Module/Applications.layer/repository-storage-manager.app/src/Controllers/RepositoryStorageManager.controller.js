const RepositoryStorageManagerController = (params) => {

    const { 
        repositoryStorageManagerService 
    } = params

    const {
        GetPackageId,
        GetTotalNamespace,
        ListRepositoriesByNamespace,
        ListNamespace,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        GetNamespace,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetMetadataByPackageId,
        ListBootablePackages,
        ListRepositories,
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
        GetTotalNamespace,
        ListRepositoriesByNamespace,
        ListNamespace,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        GetNamespace,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetMetadataByPackageId,
        ListBootablePackages,
        ListRepositories,
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