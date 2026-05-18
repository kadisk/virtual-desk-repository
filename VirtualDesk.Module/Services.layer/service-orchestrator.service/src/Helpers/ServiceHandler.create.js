const { join, resolve} = require("path")

const PrepareDirPath = require("../Utils/PrepareDirPath")
const CopyDirRepository = require("../Utils/CopyDirRepository")
const GetContextTarStream = require("../Utils/GetContextTarStream")

const GetISODate = () => {
  return new Date().toISOString().replace(/:/g, '-').split('.')[0];
}

const CreateServiceHandler = ({
    absolutInstanceDataDirPath,
    MyWorkspaceDomainService,
    BuildImageFromDockerfileString,
    CreateNewContainer
}) => {

    const CreateContainer = async ({
        containerName,
        imageName,
        ports = [],
        networkmode
    }) => {

        const _RemapPort = (ports) => ports.map(({ servicePort, hostPort }) => ({ containerPort:servicePort, hostPort }))

        const containerInfo = await CreateNewContainer({
            imageName,
            containerName,
            ports: _RemapPort(ports),
            networkmode
        })

        return containerInfo

    }

    const CreateService = async ({
        serviceName,
        serviceDescription,
        originRepositoryNamespace,
        originRepositoryCodePath,
        originPackagePath
    }) => {

        const instanceRepositoryCodePath = resolve(absolutInstanceDataDirPath, serviceName+"-"+GetISODate())
        
        PrepareDirPath(instanceRepositoryCodePath)

        const serviceData = await MyWorkspaceDomainService
            .RegisterServiceProvisioning({
                serviceName,
                serviceDescription,
                instanceRepositoryCodePath,
                originRepositoryNamespace,
                originRepositoryCodePath,
                originPackagePath
        })
        await CopyDirRepository(originRepositoryCodePath, instanceRepositoryCodePath)
        return serviceData
    }

    const UpdateService = async ({
        serviceId,
        serviceName,
        serviceDescription,
        originRepositoryNamespace,
        originRepositoryCodePath,
        originPackagePath
    }) => {

        const instanceRepositoryCodePath = resolve(absolutInstanceDataDirPath, serviceName+"-"+GetISODate())
        
        PrepareDirPath(instanceRepositoryCodePath)

        const serviceData = await MyWorkspaceDomainService
            .UpdateServiceProvisioning({
                serviceId,
                serviceName,
                serviceDescription,
                originRepositoryNamespace,
                originRepositoryCodePath,
                originPackagePath
            })

        await CopyDirRepository(originRepositoryCodePath, instanceRepositoryCodePath)
        return serviceData
    }

    const CreateInstance = async({
        serviceId,
        startupParams,
        socketParams,
        storageParams,
        ports,
        networkmode
    }) => {

        const instanceData = await MyWorkspaceDomainService
            .RegisterInstanceCreation({
                serviceId,
                startupParams,
                socketParams,
                storageParams,
                ports,
                networkmode
            })

        return instanceData
    }

    const BuildImage = async ({
        buildId,
        imageTagName,
        repositoryCodePath,
        repositoryNamespace,
        packagePath,
        startupParams
    }) => {

        const buildargs = {
            REPOSITORY_NAMESPACE: repositoryNamespace
        }

        const packageAbsolutPath = join(repositoryCodePath, packagePath)

        const contextTarStream = GetContextTarStream({
            repositoryPathForCopy: repositoryCodePath,
            packagePathForCopy: packageAbsolutPath,
            startupParams
        })
        
        const _handleData = chunk => {
            try {
                const lines = chunk.toString().split('\n').filter(Boolean)
        
                for (const line of lines) {
                    const parsed = JSON.parse(line)
        
                    if (parsed.stream) {
                        console.log(parsed.stream)
                    } else if (parsed.status) {
                        console.log(`[STATUS] ${parsed.status}`)
                    } else if (parsed.error) {
                        console.log(parsed.error)
                    } else {
                        console.log(`[OTHER] ${line}`)
                    }
                }
        
            } catch (err) {
                console.error('Failed to parse Docker output chunk:', chunk.toString())
            }
        }
        
        const imageInfo = await BuildImageFromDockerfileString({
            buildargs,
            contextTarStream,
            imageTagName,
            onData: _handleData
        })

        const buildData = await MyWorkspaceDomainService
            .UpdateHashIdImage(buildId, imageInfo.Id)


        return buildData
    }

    /*const RegisterStorages = async ({
        serviceId,
        storageParams
    }) => {

        const storageList = Object
            .entries(storageParams)
            .map(([key, { namespace, filename }]) => ({ namespace, filename }))

        const storageListData = await MyWorkspaceDomainService
                    .RegisterStorages({
                        serviceId,
                        storageList
                    })

        return storageListData
    }*/

    return {
        UpdateService,
        CreateService,
        CreateInstance,
        BuildImage,
        CreateContainer
        //RegisterStorages
    }
}

module.exports = CreateServiceHandler