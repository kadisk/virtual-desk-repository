const colors = require('colors')
const readline = require('readline')

const ConvertPathToAbsolutPath = require("../Utils/ConvertPathToAbsolutPath")
const MountCommand = require('../Helpers/MountCommand')
const { resolve } = require("path")

const ProvisionServiceCommand = async ({ args, startupParams, params }) => {
    
    const { provisionFilePath } = args

    const { 
        serviceOrchestratorServerManagerUrl,
        serviceOrchestratorSocketPath,
        repositoryStorageSocketPath,
        repositoryStorageServerManagerUrl
    } = startupParams

    const {
        jsonFileUtilitiesLib,
        commandExecutorLib
    } = params

    const ReadJsonFile = jsonFileUtilitiesLib.require("ReadJsonFile")
    const absolutProvisionFilePath = resolve(process.cwd(), ConvertPathToAbsolutPath(provisionFilePath))

    colors.setTheme({
        header: ['white', 'bold'],
        title: ['cyan', 'bold'],
        label: ['gray'],
        value: ['white', 'bold'],
        highlight: ['yellow'],
        alertPath: ['yellow', 'bold'],
        success: ['green', 'bold'],
        error: ['red', 'bold'],
        warning: ['yellow'],
        port: ['green'],
        url: ['blue'],
        boolean: ['magenta'],
        path: ['cyan']
    })

    const provisionData = await ReadJsonFile(absolutProvisionFilePath)

    if(!provisionData){
        console.error('\nErro ao obter os dados de provisionamento.'.error)
        console.error('Arquivo de provisionamento: '.error + absolutProvisionFilePath.alertPath)
        return
    }

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
    
    const renderParamsSection = (title, params) => {
        if (params) {
            console.log('')
            console.log(`${title}:`.title)
            console.log('-'.repeat(70).label)
            Object.entries(params).forEach(([key, value]) => {
                if (key !== 'password' && key !== 'username') {
                    if (typeof value === 'object' && value !== null) {
                        console.log(`${key.padEnd(25).label}`)
                        Object.entries(value).forEach(([subKey, subValue]) => {
                            let subFormattedValue
                            let subColor = 'value'
                            
                            if (typeof subValue === 'boolean') {
                                subFormattedValue = subValue.toString()
                                subColor = 'boolean'
                            } else if (subKey.includes('port') || subKey.includes('Port')) {
                                subFormattedValue = String(subValue)
                                subColor = 'port'
                            } else if (subKey.includes('url') || subKey.includes('Url') || subKey.includes('host') || subKey.includes('Host')) {
                                subFormattedValue = String(subValue)
                                subColor = 'url'
                            } else if (subKey.includes('path') || subKey.includes('Path') || subKey.includes('dir') || subKey.includes('Dir')) {
                                subFormattedValue = String(subValue)
                                subColor = 'path'
                            } else if (subKey === 'namespace') {
                                subFormattedValue = String(subValue)
                                subColor = 'highlight'
                            } else {
                                subFormattedValue = String(subValue)
                            }

                            console.log(`${''.padEnd(27)} ${subKey}: ${subFormattedValue[subColor]}`)
                        })
                    } else {
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
                            formattedValue = String(value)
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
                }
            })
        }
    }

    renderParamsSection('PARÂMETROS DE INICIALIZAÇÃO', provisionData.startupParams)
    renderParamsSection('PARÂMETROS DE SOCKET', provisionData.socketParams)
    renderParamsSection('PARÂMETROS DE STORAGE', provisionData.storageParams)
    
    console.log('-'.repeat(70).label)
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
            repositoryNamespace: provisionData.repositoryNamespace
        }))

    if (!Array.isArray(repositoriesImportedList) || repositoriesImportedList.length === 0) {
        const repositoryNamespace = provisionData.repositoryNamespace || 'N/A'
        const coloredMessage = `Repository namespace ${`"${repositoryNamespace}"`.highlight} não localizado entre os repositórios importados.\nVerifique se o namespace informado está correto e se o repositório de origem foi importado com sucesso para o sistema.\n\n\n`.error
        console.error('\n\n\nErro durante o provisionamento:'.error, coloredMessage)
        return
    }

    const repositoryInformation = repositoriesImportedList[0]

    console.log('')
    console.log('CONFIRMAÇÃO DE PROVISIONAMENTO:'.title)
    console.log('-'.repeat(70).label)
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    const answer = await new Promise(resolve => {
        rl.question('Deseja prosseguir com o provisionamento? (s/n): ', resolve)
    })
    rl.close()
    if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'sim') {
        console.log('Provisionamento cancelado.'.warning)
        return
    }

    try {

        console.log('')
        console.log('Iniciando provisionamento...'.highlight)

        const ServiceOrchestratorCommand = MountCommand({ 
            serverManagerUrl: serviceOrchestratorServerManagerUrl,
            socketPath: serviceOrchestratorSocketPath, 
            commandExecutorLib,
            ExtractAPI: (APIs) => APIs.ServiceOrchestratorAppInstance.ServiceManagerInterface
        })

        await ServiceOrchestratorCommand((API) => API.ProvisionService({
            originRepositoryCodePath  : repositoryInformation.repositoryCodePath,
            originPackagePath         : provisionData.packagePath,
            originRepositoryNamespace : provisionData.repositoryNamespace,
            serviceName               : provisionData.serviceName,
            serviceDescription        : provisionData.serviceDescription,
            startupParams             : provisionData.startupParams,
            socketParams              : provisionData.socketParams,
            storageParams             : provisionData.storageParams,
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