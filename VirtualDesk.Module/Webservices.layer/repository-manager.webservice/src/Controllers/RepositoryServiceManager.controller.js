const multer = require('multer')
const { join, extname } = require('path')
const fs = require('fs')
const os = require('os')
const git = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const crypto = require('crypto')

const ConvertPathToAbsolutPath = (_path) => join(_path).replace('~', os.homedir())
const GetRequestParams = ({body, params:path, query}) => ({...path, ...body, ...query})

const RepositoryServiceManagerController = (params) => {

    const { 
        uploadDirPath,
        commandExecutorLib,
        repositoryStorageSocketPath,
        repositoryStorageServerManagerUrl,
    } = params

    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    const RepositoryStorageCommand = async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .RepositoryStorageManagerAppInstance
            .RepositoryStorageManager
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: repositoryStorageServerManagerUrl,
            mainApplicationSocketPath: repositoryStorageSocketPath,
            CommandFunction: APICommandFunction
        })
    }

    const uploadAbsolutDirPath = ConvertPathToAbsolutPath(uploadDirPath)

    const ListRepositoriesByNamespace = async (namespaceId) => {
        const repositories = await RepositoryStorageCommand((API) => API.ListRepositoriesByNamespace({ namespaceId }))
        return repositories
    }

    const ListNamespaces = async () => {
        const namespaces = await RepositoryStorageCommand((API) => API.ListNamespace())
        return namespaces
    }

    const CheckRepositoryImported = async () => {
        const repositoryCount = await RepositoryStorageCommand((API) => API.GetTotalNamespace())

        if (repositoryCount > 0) {
            return "READY"
        } else {
            return "NO_REPOSITORIES"
        }
    }

    const UploadProcess = ({
        request, 
        response,
        next,
        onUpload
    }) => {
        
        const repositoriesDirPath = join(uploadAbsolutDirPath, crypto.randomUUID())

        if (!fs.existsSync(repositoriesDirPath)) fs.mkdirSync(repositoriesDirPath, { recursive: true })

        const uploadMiddleware = multer({ dest: repositoriesDirPath })

        uploadMiddleware.single('repositoryFile')(request, response, async (err) => {
            if (err) return next(err)
            if (!request.file) {
                const error = new Error('No file uploaded')
                error.status = 400
                return next(error)
            }
            const allowedFormats = ['.gz', '.zip']
            const fileExt = extname(request.file.originalname).toLowerCase()
            if (!allowedFormats.includes(fileExt)) {
                fs.unlinkSync(request.file.path)
                const error = new Error('Invalid file format')
                error.status = 400
                return next(error)
            }
            const repositoryFilePath = join(repositoriesDirPath, request.file.originalname)
            fs.renameSync(request.file.path, repositoryFilePath)
            const data = await onUpload(repositoryFilePath)
            return response.json(data)
        })
    }
    
    const UploadRepository = (request, response, next) => {

        UploadProcess({
            request, 
            response,
            next,
            onUpload: async (repositoryFilePath) => {
                const params = GetRequestParams(request)

                return await RepositoryStorageCommand((API) => 
                    API.RegisterNamespaceAndRepositoryUploadedAndExtract({
                        repositoryNamespace: params.repositoryNamespace, 
                        repositoryFilePath
                    }))
            }
        })
    }

    const UpdateRepositoryWithUpload = (request, response, next) => {
        UploadProcess({
            request, 
            response,
            next,
            onUpload: async (repositoryFilePath) => {
                const params = GetRequestParams(request)
      
                const namespaceData = await RepositoryStorageCommand((API) => API.GetNamespace({ namespaceId: params.namespaceId }))

                const repositoryImportedData =  await RepositoryStorageCommand((API) => 
                    API.ExtractAndRegisterRepository({ 
                        repositoryNamespace: namespaceData.namespace,
                        namespaceId: namespaceData.id,
                        repositoryFilePath
                    }))
                return {
                    repositoryNamespace: namespaceData,
                    repositoryImported: repositoryImportedData
                }
            }
        })
    }

    const GetRepositoryCodePath = ({
        repositoryNamespace
    }) => {
        return join(uploadAbsolutDirPath, `${repositoryNamespace}-${crypto.randomUUID()}`)
    }

    const Clone = async ({
        repositoryCodePath,
        repositoryGitUrl,
        personalAccessToken
    }) => {
        await git.clone({
            fs,
            http, 
            dir : repositoryCodePath,
            url: repositoryGitUrl,
                onAuth: () => ({
                    username: personalAccessToken,
                    password: ''
                })
        })
    }

    const UpdateRepositoryWithGitClone = async ({
        namespaceId,
        repositoryGitUrl,
        personalAccessToken
    }) => {

        const namespaceData = await RepositoryStorageCommand((API) => API.GetNamespace({ namespaceId }))
        
        const repositoryCodePath = GetRepositoryCodePath({
            repositoryNamespace: namespaceData.namespace})
        await Clone({
            repositoryCodePath,
            repositoryGitUrl,
            personalAccessToken
        })

        const repositoryImportedData = await RepositoryStorageCommand((API) => API.RegisterImportedRepository({
            namespaceId: namespaceData.id,
            repositoryCodePath,
            sourceType:"GIT_CLONE",
            sourceParams:{
                repositoryGitUrl,
                personalAccessToken
            }
        }))

        return {
            repositoryNamespace: namespaceData,
            repositoryImported: repositoryImportedData
        }
    }

    const CloneRepository = async ({
        repositoryNamespace,
        repositoryGitUrl,
        personalAccessToken
    }) => {

        const repositoryCodePath = GetRepositoryCodePath({
            repositoryNamespace
        })

        await Clone({
            repositoryCodePath,
            repositoryGitUrl,
            personalAccessToken
        })

        const data = await RepositoryStorageCommand((API) => API.RegisterNamespaceAndRepositoryCloned({
                repositoryNamespace, 
                repositoryCodePath,
                sourceParams:{
                    repositoryGitUrl,
                    personalAccessToken
                }
        }))
        
        return data
    }

    const ListBootablePackages = () => {
        return RepositoryStorageCommand((API) => API.ListBootablePackages())
    }

    const GetStartupParamsData = async (packageId) => { 
        const metadata = await RepositoryStorageCommand((API) => API.GetMetadataByPackageId({ packageId }))
        return metadata
    }

    const controllerServiceObject = {
        controllerName: "RepositoryServiceManagerController",
        ListNamespaces,
        ListRepositoriesByNamespace,
        CheckRepositoryImported,
        UploadRepository,
        UpdateRepositoryWithUpload,
        CloneRepository,
        UpdateRepositoryWithGitClone,
        ListBootablePackages,
        GetStartupParamsData
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = RepositoryServiceManagerController