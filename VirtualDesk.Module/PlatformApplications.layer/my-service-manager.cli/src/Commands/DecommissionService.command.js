const colors = require('colors')
const readline = require('node:readline/promises')
const { stdin: input, stdout: output } = require('node:process')

const MountCommand = require('../Helpers/MountCommand')

const AskForDecommissionConfirmation = async () => {
    const rl = readline.createInterface({ input, output })
    try {
        const answer = await rl.question(
            colors.yellow('Confirma o descomissionamento deste serviço? (s/N): ')
        )

        return ['s', 'sim', 'y', 'yes'].includes(String(answer || '').trim().toLowerCase())
    } finally {
        rl.close()
    }
}

const PrintServiceInfo = (info) => {
    const labelWidth = 26
    const label = (text) => colors.cyan.bold(text.padEnd(labelWidth))
    const value = (text) => colors.white(text)

    const printLine = (l, v) =>
        console.log(label(l) + value(v))

    const title = 'Service to be Decommissioned'
    const totalWidth = labelWidth + 40
    const titlePad = Math.floor((totalWidth - title.length) / 2)

    console.log('\n' + colors.bold(' '.repeat(titlePad) + title + ' '.repeat(titlePad)))
    console.log(colors.gray('-'.repeat(totalWidth)))

    printLine('Service ID:', String(info.id ?? info.serviceId ?? ''))
    printLine('Service Name:', info.serviceName)
    printLine('Repository Namespace:', info.originRepositoryNamespace)

    console.log(colors.gray('-'.repeat(totalWidth)) + '\n')
}

const DecommissionServiceCommand = async ({ args, startupParams, params }) => {

    const { serviceId } = args

    const { 
        serviceOrchestratorServerManagerUrl,
        serviceOrchestratorSocketPath
    } = startupParams

    const {
        commandExecutorLib
    } = params

    const ServiceOrchestratorCommand = MountCommand({ 
        serverManagerUrl: serviceOrchestratorServerManagerUrl,
        socketPath: serviceOrchestratorSocketPath,
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.ServiceOrchestratorAppInstance.ServiceManagerInterface
    })

    const services = await ServiceOrchestratorCommand((API) => API.ListServices())
    const serviceInfo = Array.isArray(services)
        ? services.find((item) => String(item.id ?? item.serviceId) === String(serviceId))
        : null

    if (!serviceInfo) {
        console.error(colors.red.bold(`Serviço com ID ${serviceId} não foi encontrado.`))
        return
    }

    PrintServiceInfo(serviceInfo)

    const confirmed = await AskForDecommissionConfirmation()
    if (!confirmed) {
        console.log(colors.yellow('Operação cancelada pelo usuário.'))
        return
    }

    try {
        await ServiceOrchestratorCommand((API) => API.DecommissioningService({ serviceId }))
        console.log(colors.green.bold('Serviço descomissionado com sucesso!'))
    } catch (error) {
        console.error(colors.red.bold(`Não foi possível descomissionar o serviço ${serviceId}.`))
        return
    }
}

module.exports = DecommissionServiceCommand
