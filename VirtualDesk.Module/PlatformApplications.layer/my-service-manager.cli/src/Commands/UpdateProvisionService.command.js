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


    const ServiceOrchestratorCommand = MountCommand({ 
        serverManagerUrl: serviceOrchestratorServerManagerUrl,
        socketPath: serviceOrchestratorSocketPath, 
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.ServiceOrchestratorAppInstance.ServiceManagerInterface
    })

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

    console.log('INFORMAÇÕES DO SERVIÇO ENCONTRADO:'.title)
    console.log('-'.repeat(70).label)
    console.log(`${'ID:'.padEnd(22).label} ${String(serviceInformation.serviceId || 'N/A').value}`)
    console.log(`${'Nome:'.padEnd(22).label} ${String(serviceInformation.serviceName || 'N/A').value}`)
    console.log(`${'Descrição:'.padEnd(22).label} ${String(serviceInformation.serviceDescription || 'N/A').value}`)
    console.log(`${'Namespace origem:'.padEnd(22).label} ${String(serviceInformation.originRepositoryNamespace || 'N/A').highlight}`)
    console.log(`${'Pacote origem:'.padEnd(22).label} ${String(serviceInformation.originPackagePath || 'N/A').path}`)
    console.log(`${'Repo origem:'.padEnd(22).label} ${String(serviceInformation.originRepositoryCodePath || 'N/A').path}`)
    console.log(`${'Instância:'.padEnd(22).label} ${String(serviceInformation.instanceRepositoryCodePath || 'N/A').path}`)
    console.log('-'.repeat(70).label)
    console.log('')

    console.log(`Carregando dados de provisionamento do arquivo "${provisionFilePath}"...`.highlight)
    console.log(`${'Arquivo:'.padEnd(22).label} ${absolutProvisionFilePath.alertPath}`)

    console.log('')
    console.log('DADOS DE PROVISIONAMENTO PARA ATUALIZAÇÃO:'.title)
    console.log('-'.repeat(70).label)
    console.log(`${'Nome:'.padEnd(22).label} ${String(provisionData.serviceName || 'N/A').value}`)
    console.log(`${'Descrição:'.padEnd(22).label} ${String(provisionData.serviceDescription || 'N/A').value}`)
    console.log(`${'Tipo:'.padEnd(22).label} ${String(provisionData.packageType || 'N/A').highlight}`)
    console.log(`${'Namespace:'.padEnd(22).label} ${String(provisionData.repositoryNamespace || 'N/A').highlight}`)
    console.log(`${'Pacote:'.padEnd(22).label} ${String(provisionData.packageName || 'N/A').value}`)
    console.log(`${'Caminho:'.padEnd(22).label} ${String(provisionData.packagePath || 'N/A').path}`)
    console.log(`${'Network Mode:'.padEnd(22).label} ${String(provisionData.networkmode || 'N/A').highlight}`)

    if (provisionData.startupParams) {
        console.log('')
        console.log('PARÂMETROS DE INICIALIZAÇÃO (NOVOS):'.title)
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

    if (Array.isArray(provisionData.ports)) {
        const portsValue = provisionData.ports.length > 0
            ? JSON.stringify(provisionData.ports)
            : '[]'

        console.log(`${'Ports:'.padEnd(22).label} ${portsValue.port}`)
    }

    console.log('-'.repeat(70).label)
    console.log('')
}

module.exports = UpdateProvisionServiceCommand
