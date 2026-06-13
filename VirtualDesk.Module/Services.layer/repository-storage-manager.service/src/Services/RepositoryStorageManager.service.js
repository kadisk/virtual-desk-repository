const { join, resolve} = require("path")
const os = require('os')

const ConvertPathToAbsolutPath = (_path) => join(_path)
    .replace('~', os.homedir())

const InitializeRepositoryPersistentStoreManager = require("../Helpers/InitializeRepositoryPersistentStoreManager")
const CreateItemIndexer                          = require("../Helpers/CreateItemIndexer")
const CreateRepositoryStorageDomainService       = require("../Helpers/CreateRepositoryStorageDomainService")
const PrepareDirPath                             = require("../Helpers/PrepareDirPath")

const GetISODate = () => {
  return new Date().toISOString().replace(/:/g, '-').split('.')[0];
}

const RepositoryStorageManagerService = (params) => {

    const {
        onReady,
        ecosystemDefaultsFileRelativePath,
        importedRepositoriesSourceCodeDirPath,
        uploadDirPath,
        repositoryStorageFilePath,
        ecosystemdataHandlerService,
        extractTarGzLib,
        loadMetatadaDirLib,
        jsonFileUtilitiesLib
    } = params

    const LoadMetadataDir = loadMetatadaDirLib.require("LoadMetadataDir")
    const ExtractTarGz    = extractTarGzLib.require("ExtractTarGz")
    const ReadJsonFile    = jsonFileUtilitiesLib.require("ReadJsonFile")

    const ecosystemDefaultFilePath = resolve(ecosystemdataHandlerService.GetEcosystemDataPath(), ecosystemDefaultsFileRelativePath)

    const absolutRepositoryStorageFilePath = ConvertPathToAbsolutPath(repositoryStorageFilePath)
    const absolutImportedRepositoriesSourceCodeDirPath = ConvertPathToAbsolutPath(importedRepositoriesSourceCodeDirPath)
    const absolutUploadDirPath = ConvertPathToAbsolutPath(uploadDirPath)
    const RepositoryPersistentStoreManager = InitializeRepositoryPersistentStoreManager(absolutRepositoryStorageFilePath)

    const {
        RepositoryNamespace : RepositoryNamespaceModel,
        RepositoryImported  : RepositoryImportedModel,
        RepositoryItem      : RepositoryItemModel
    } = RepositoryPersistentStoreManager.models
    
    const ItemIndexer = CreateItemIndexer({RepositoryItemModel})

    const RepositoryStorageDomainService = CreateRepositoryStorageDomainService({
        RepositoryNamespaceModel,
        RepositoryImportedModel,
        RepositoryItemModel
    })

    const {
        GetPackageId,
        GetPackageById,
        GetRepositoryNamespaceId,
        GetItemById,
        ListLatestPackageItems,
        ListRepositories,
        GetNamespace,
        GetNamespaceByRepositoryId,
        RegisterRepositoryNamespace,
        RegisterRepositoryImported,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetRepositoriesImportedList
    } = RepositoryStorageDomainService

    const _MountPathImportedRepositoriesSourceCodeDirPath = ({repositoryNamespace}) => {
        const repositoriesCodePath = resolve(absolutImportedRepositoriesSourceCodeDirPath, repositoryNamespace+"-"+GetISODate())
        PrepareDirPath(repositoriesCodePath)
        return repositoriesCodePath
    }

    const _Start = async () => {
        await RepositoryPersistentStoreManager.ConnectAndSync()
        onReady()
    }

    const GetTotalNamespace = () =>  RepositoryNamespaceModel.count()

    const ListNamespace = async () => {
        const repositoryNamespaceDataList  = await RepositoryStorageDomainService.ListNamespace()
        
        const repositories = repositoryNamespaceDataList
            .map((repositoryData) => {
                const { id, namespace, createdAt } = repositoryData
                return { id, namespace, createdAt } 
            })

        return repositories
    }

    const ListRepositoriesByNamespace = async (namespaceId) => {
        const repositories = await RepositoryStorageDomainService.ListRepositoriesByNamespace(namespaceId)
        return repositories.map(({ id, createdAt, sourceType, sourceParams }) => ({
            id,
            createdAt,
            sourceType,
            sourceParams
        }))
    }

    const CreateRepository = async ({ namespaceId, repositoryCodePath, sourceType, sourceParams }) => {

        const newRepositoryImported = await RegisterRepositoryImported({ 
                namespaceId,
                repositoryCodePath, 
                sourceType, 
                sourceParams
            })
            
        return newRepositoryImported
    }

    const RegisterImportedRepository = async ({
            namespaceId,
            repositoryCodePath,
            sourceType,
            sourceParams
    }) => {

        const repositoryImportedData = await CreateRepository({
            namespaceId, 
            repositoryCodePath,
            sourceType,
            sourceParams
        })

        ItemIndexer.IndexRepository({
            repositoryId: repositoryImportedData.id,
            repositoryCodePath
        })

        return repositoryImportedData

    }

    const CreateNamespace = async ({ repositoryNamespace }) => {
        const existingNamespaceId = await GetRepositoryNamespaceId(repositoryNamespace)

        if (existingNamespaceId !== undefined) 
            throw new Error('Repository Namespace already exists')

        const newNamespaceData = await RegisterRepositoryNamespace({ namespace: repositoryNamespace })
            
        return newNamespaceData
    }

    const RegisterNamespaceAndRepositoryUploadedAndExtract = async ({ repositoryNamespace, repositoryFilePath }) => {
        
        const namespaceData = await CreateNamespace({ repositoryNamespace })
        
        const repositoryImportedData = await ExtractAndRegisterRepository({ 
            repositoryNamespace,
            namespaceId: namespaceData.id,
            repositoryFilePath
        })

        return {
            repositoryNamespace: namespaceData,
            repositoryImported: repositoryImportedData
        }
    }

    const ExtractAndRegisterRepository = async ({ namespaceId, repositoryNamespace, repositoryFilePath }) => {

        const repositoriesCodePath = _MountPathImportedRepositoriesSourceCodeDirPath({ repositoryNamespace })

        // O caller (webservice em container) envia o caminho relativo ao diretório de upload.
        // O storage manager roda no host, então resolve contra seu próprio uploadDirPath.
        const absolutRepositoryFilePath = join(absolutUploadDirPath, repositoryFilePath)

        const newRepositoryCodePath = await ExtractTarGz(absolutRepositoryFilePath, repositoriesCodePath)

        const repositoryImportedData = await RegisterImportedRepository({
            namespaceId,
            repositoryCodePath: newRepositoryCodePath,
            sourceType:"TAR_GZ_UPLOAD",
            sourceParams: {
                repositoryFilePath
            }
        })

        return repositoryImportedData
    }

    const RegisterNamespaceAndRepositoryCloned = async ({
            repositoryNamespace, 
            repositoryCodePath,
            sourceParams
    }) => {

        const namespaceData = await CreateNamespace({ repositoryNamespace })
        
        const repositoryImportedData = await RegisterImportedRepository({
            namespaceId: namespaceData.id,
            repositoryCodePath,
            sourceType:"GIT_CLONE",
            sourceParams
        })
        
        return {
            repositoryNamespace: namespaceData,
            repositoryImported: repositoryImportedData
        }
    }

    const GetMetadataByPackageId = async (packageId) => { 
        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)

        const packageData = await GetItemById(packageId)

        const packageAbsolutPath = join(packageData.repositoryCodePath, packageData.itemPath)
        console.log(`[INFO] Loading metadata for package item at path: ${packageAbsolutPath}`)

        const metadata = await LoadMetadataDir({
            metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
            path: packageAbsolutPath
        })

        return {
            schema : metadata["startup-params-schema"],
            value  : metadata["startup-params"],
        }

    }

    const ListBootablePackages = async () => {

        const ecosystemDefaults = await ReadJsonFile(ecosystemDefaultFilePath)
        const packageItems  = await ListLatestPackageItems()


        const packageItemsWithMetadataPromises = packageItems
            .map(async (packageItem) => {

                const packageAbsolutPath = join(packageItem.repositoryCodePath, packageItem.itemPath)
                console.log(`[INFO] Loading metadata for package item at path: ${packageAbsolutPath}`)

                const metadata = await LoadMetadataDir({
                    metadataDirName: ecosystemDefaults.REPOS_CONF_DIRNAME_METADATA,
                    path: packageAbsolutPath
                })

                return {
                    ...packageItem,
                    metadata
                }
            })


        const allPackageItems = await Promise.all(packageItemsWithMetadataPromises)
        const bootablePacakgeItems = allPackageItems.filter(({metadata}) => metadata && metadata.boot)
        return bootablePacakgeItems
        
    }

    _Start()

    return {
        GetTotalNamespace, 
        GetPackageId,
        RegisterNamespaceAndRepositoryUploadedAndExtract,
        ExtractAndRegisterRepository,
        RegisterImportedRepository,
        RegisterNamespaceAndRepositoryCloned,
        GetPackageById,
        ListRepositories,
        ListRepositoriesByNamespace,
        ListNamespace,
        GetNamespace,
        GetMetadataByPackageId,
        ListBootablePackages,
        GetRepositoryImported,
        ListItemByRepositoryId,
        GetItemById,
        GetRepositoriesImportedList,
        GetNamespaceByRepositoryId
    }
}

module.exports = RepositoryStorageManagerService
