const colors = require('colors')

const ConvertPathToAbsolutPath = require("../Utils/ConvertPathToAbsolutPath")
const MountCommand = require('../Helpers/MountCommand')
const { resolve } = require("path")

const UpdateProvisionServiceCommand = async ({ args, startupParams, params }) => {

    const { serviceId, provisionFilePath } = args

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
            muted: ['gray'],
            value: ['white', 'bold'],
            highlight: ['yellow'],
            updated: ['yellow', 'bold'],
            alertPath: ['yellow', 'bold'],
            success: ['green', 'bold'],
            error: ['red', 'bold'],
            warning: ['yellow'],
            port: ['green'],
            url: ['blue'],
            boolean: ['magenta'],
            path: ['cyan']
        })
    
    
    const RepositoryStorageCommand = MountCommand({ 
        serverManagerUrl: repositoryStorageServerManagerUrl,
        socketPath: repositoryStorageSocketPath,
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.RepositoryStorageManagerAppInstance.RepositoryStorageManager
    })

    const ServiceOrchestratorCommand = MountCommand({ 
        serverManagerUrl: serviceOrchestratorServerManagerUrl,
        socketPath: serviceOrchestratorSocketPath, 
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.ServiceOrchestratorAppInstance.ServiceManagerInterface
    })

    console.log('')
    console.log(`Carregando arquivo de provisionamento: `.highlight + `${absolutProvisionFilePath}`.path + '...'.highlight)
    console.log('')

    const provisionData = await ReadJsonFile(absolutProvisionFilePath)

    if(!provisionData){
        console.error('\nErro ao obter os dados de provisionamento.'.error)
        console.error('Arquivo de provisionamento: '.error + absolutProvisionFilePath.alertPath)
        return
    }

    console.log(`Buscando dados de repositório de origem "${provisionData.repositoryNamespace}"...`.highlight)

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
    
    console.log(`\nBuscando serviço "${serviceId}"...`.highlight)

    const serviceInformation = 
    await ServiceOrchestratorCommand((API) => API.GetService({
        serviceId
    }))

    if (!serviceInformation) {
        console.error(`Serviço com ID "${serviceId}" não encontrado.`.error)
        return
    }

    console.log('')
    console.log('='.repeat(70).header)
    console.log('ATUALIZAÇÃO DE SERVIÇO'.padStart(41).title)
    console.log('='.repeat(70).header)


    const printComparedField = ({ label, currentValue, nextValue, currentColor = 'value', nextColor = 'updated', unchangedColor = 'muted' }) => {
        if (currentValue === nextValue) {
            console.log(`${`${label}`.padEnd(15).label} ${currentValue[unchangedColor]}`)
            return
        }

        console.log(`${`${label}`.padEnd(15).label} ${currentValue[currentColor]} ${'->'.label} ${nextValue[nextColor]}`)
    }

    const formatStartupParamValue = (key, value) => {
        if (value === undefined || value === null) {
            return { formattedValue: '', color: 'value' }
        }

        if (typeof value === 'boolean') {
            return { formattedValue: value.toString(), color: 'boolean' }
        }

        if (key.includes('port') || key.includes('Port')) {
            return { formattedValue: String(value), color: 'port' }
        }

        if (key.includes('url') || key.includes('Url') || key.includes('host') || key.includes('Host')) {
            return { formattedValue: String(value), color: 'url' }
        }

        if (key.includes('path') || key.includes('Path') || key.includes('dir') || key.includes('Dir')) {
            return { formattedValue: String(value), color: 'path' }
        }

        return {
            formattedValue: typeof value === 'object' ? JSON.stringify(value) : String(value),
            color: 'value'
        }
    }

    printComparedField({
        label: 'Nome:',
        currentValue: serviceInformation.serviceName,
        nextValue: provisionData.serviceName
    })
    printComparedField({
        label: 'Descrição:',
        currentValue: serviceInformation.serviceDescription,
        nextValue: provisionData.serviceDescription
    })
    printComparedField({
        label: 'Namespace origem:',
        currentValue: serviceInformation.originRepositoryNamespace,
        nextValue: provisionData.repositoryNamespace,
        currentColor: 'highlight'
    })
    printComparedField({
        label: 'Repo origem:',
        currentValue: serviceInformation.originRepositoryCodePath,
        nextValue: repositoryInformation.repositoryCodePath,
        currentColor: 'path',
        nextColor: 'updated'
    })
    printComparedField({
        label: 'Pacote origem:',
        currentValue: serviceInformation.originPackagePath,
        nextValue: provisionData.packagePath,
        currentColor: 'path',
        nextColor: 'updated'
    })
    
    console.log('-'.repeat(70).label)

    if (provisionData.startupParams) {
        console.log('')
        console.log('PARÂMETROS DE INICIALIZAÇÃO:'.title)
        console.log('-'.repeat(70).label)

        Object.entries(provisionData.startupParams).forEach(([key, value]) => {
            if (key !== 'password' && key !== 'username') {
                const nextParam = formatStartupParamValue(key, value)
                const keyLabel = `${key.padEnd(25)}`.label

                if (nextParam.formattedValue.length > 45) {
                    console.log(`${keyLabel} ${nextParam.formattedValue.substring(0, 45)[nextParam.color]}`)
                    let remaining = nextParam.formattedValue.substring(45)
                    while (remaining.length > 0) {
                        console.log(`${''.padEnd(25)} ${remaining.substring(0, 45)[nextParam.color]}`)
                        remaining = remaining.substring(45)
                    }
                } else {
                    console.log(`${keyLabel} ${nextParam.formattedValue[nextParam.color]}`)
                }
            }
        })
    }

    console.log('-'.repeat(70).label)
    console.log('')
}

module.exports = UpdateProvisionServiceCommand
