const inquirer = require('inquirer').default
const colors = require('colors')

const ConvertPathToAbsolutPath = require("../Utils/ConvertPathToAbsolutPath")
const MountCommand = require('../Helpers/MountCommand')
const { resolve } = require("path")

const ProvisionServiceCommand = async ({ args, startupParams, params }) => {
    
    const { provisionFilePath } = args

    const { 
        serviceOrchestratorServerManagerUrl,
        serviceOrchestratorSocketPath,
        iamManagerSocketPath,
        iamManagerServerManagerUrl,
        repositoryStorageSocketPath,
        repositoryStorageServerManagerUrl
    } = startupParams

    const {
        jsonFileUtilitiesLib,
        commandExecutorLib
    } = params

    const ReadJsonFile = jsonFileUtilitiesLib.require("ReadJsonFile")
    const absolutProvisionFilePath = resolve(process.cwd(), ConvertPathToAbsolutPath(provisionFilePath))
    const provisionData = await ReadJsonFile(absolutProvisionFilePath)

    colors.setTheme({
        header: ['white', 'bold'],
        title: ['cyan', 'bold'],
        label: ['gray'],
        value: ['white', 'bold'],
        highlight: ['yellow'],
        success: ['green', 'bold'],
        error: ['red', 'bold'],
        warning: ['yellow'],
        port: ['green'],
        url: ['blue'],
        boolean: ['magenta'],
        path: ['cyan']
    })

    console.log('')
    console.log('='.repeat(70).header)
    console.log('PROVISIONAMENTO DE SERVIÇO'.padStart(45).title)
    console.log('='.repeat(70).header)
    
    console.log('INFORMAÇÕES DO SERVIÇO:'.title)
    console.log('-'.repeat(70).label)
    console.log(`${'Nome:'.padEnd(15).label} ${provisionData.serviceName.value}`)
    console.log(`${'Descrição:'.padEnd(15).label} ${provisionData.serviceDescription.value}`)
    console.log(`${'Tipo:'.padEnd(15).label} ${(provisionData.packageType || 'N/A').highlight}`)
    console.log(`${'Namespace:'.padEnd(15).label} ${(provisionData.repositoryNamespace || 'N/A').highlight}`)
    console.log(`${'Caminho:'.padEnd(15).label} ${(provisionData.packagePath || 'N/A').path}`)
    console.log(`${'Network Mode:'.padEnd(15).label} ${provisionData.networkmode.highlight}`)
    
    if (provisionData.startupParams) {
        console.log('')
        console.log('PARÂMETROS DE INICIALIZAÇÃO:'.title)
        console.log('-'.repeat(70).label)
        Object.entries(provisionData.startupParams).forEach(([key, value]) => {
            if (key !== 'password' && key !== 'username') {
                let formattedValue
                let color = 'value'
                
                if (typeof value === 'boolean') {
                    formattedValue = value.toString()
                    color = 'boolean'
                } else if (key.includes('port') || key.includes('Port')) {
                    formattedValue = String(value)
                    color = 'port'
                } else if (key.includes('url') || key.includes('Url') || key.includes('host') || key.includes('Host')) {
                    formattedValue = String(value)
                    color = 'url'
                } else if (key.includes('path') || key.includes('Path') || key.includes('dir') || key.includes('Dir')) {
                    formattedValue = String(value)
                    color = 'path'
                } else {
                    formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
                }

                const valueStr = formattedValue
                const keyLabel = `${key.padEnd(25)}`.label
                
                if (valueStr.length > 45) {
                    console.log(`${keyLabel} ${valueStr.substring(0, 45)[color]}`)
                    let remaining = valueStr.substring(45)
                    while (remaining.length > 0) {
                        console.log(`${''.padEnd(25)} ${remaining.substring(0, 45)[color]}`)
                        remaining = remaining.substring(45)
                    }
                } else {
                    console.log(`${keyLabel} ${valueStr[color]}`)
                }
            }
        })
    }
    
    console.log('-'.repeat(70).label)
    console.log('')

    console.log('AUTENTICAÇÃO REQUERIDA:'.title)
    console.log('-'.repeat(70).label)
    const credentials = await inquirer.prompt([
        {
            type: 'input',
            name: 'username',
            message: 'Username:'.label,
            validate: (input) => input ? true : 'Username é obrigatório'.error
        },
        {
            type: 'password',
            name: 'password',
            message: 'Password:'.label,
            mask: '*',
            validate: (input) => input ? true : 'Password é obrigatório'.error
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Deseja prosseguir com o provisionamento?'.label,
            default: true
        }
    ])

    if (!credentials.confirm) {
        console.log('Provisionamento cancelado pelo usuário.'.warning)
        return
    }

    const IAMCommand = MountCommand({ 
        serverManagerUrl: iamManagerServerManagerUrl,
        socketPath: iamManagerSocketPath, 
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.IAMAppInstance.IdentityManagement
    })

    const { username, password } = credentials

    const userInfo = await IAMCommand((API) => API.VerifyPasswordAndGetUser({ username, password }))

    if (!userInfo) throw new Error('Falha na autenticação. Verifique suas credenciais e tente novamente.')

    console.log('')
    console.log(`Buscando dados de repositório de origem "${provisionData.repositoryNamespace}"...`.highlight)

    const RepositoryStorageCommand = MountCommand({ 
        serverManagerUrl: repositoryStorageServerManagerUrl,
        socketPath: repositoryStorageSocketPath,
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.RepositoryStorageManagerAppInstance.RepositoryStorageManager
    })

    const repositoriesImportedList = 
        await RepositoryStorageCommand((API) => API.GetRepositoriesImportedList({
            userId: userInfo.id,
            repositoryNamespace: provisionData.repositoryNamespace
        }))


    const repositoryInformation = repositoriesImportedList[0]

    const packageId = await RepositoryStorageCommand((API) => API.GetPackageId({
        repositoryId : repositoryInformation.id,
        packageName  : provisionData.packageName,
        packageType  : provisionData.packageType,
        packagePath  : provisionData.packagePath
    }))

    try {

        const ServiceOrchestratorCommand = MountCommand({ 
            serverManagerUrl: serviceOrchestratorServerManagerUrl,
            socketPath: serviceOrchestratorSocketPath, 
            commandExecutorLib,
            ExtractAPI: (APIs) => APIs.ServiceOrchestratorAppInstance.ServiceManagerInterface
        })

        console.log('')
        console.log('Iniciando provisionamento...'.highlight)

        await ServiceOrchestratorCommand((API) => API.ProvisionService({
            originRepositoryId        : repositoryInformation.id,
            originRepositoryCodePath  : repositoryInformation.repositoryCodePath,
            originPackageId           : packageId,
            originPackageName         : provisionData.packageName,
            originPackageType         : provisionData.packageType,
            originPackagePath         : provisionData.packagePath,
            originRepositoryNamespace : provisionData.repositoryNamespace,
            username                  : credentials.username,
            serviceName               : provisionData.serviceName,
            serviceDescription        : provisionData.serviceDescription,
            startupParams             : provisionData.startupParams,
            ports                     : provisionData.ports,
            networkmode               : provisionData.networkmode,
        }))

        console.log('Provisionamento concluído com sucesso!'.success)
    } catch (error) {
        console.error('Erro durante o provisionamento:'.error, error.message)
        throw error
    }
}

module.exports = ProvisionServiceCommand