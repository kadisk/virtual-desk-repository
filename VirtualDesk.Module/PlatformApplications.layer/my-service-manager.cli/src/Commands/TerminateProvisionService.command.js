const colors = require('colors')
const readline = require('node:readline/promises')
const { stdin: input, stdout: output } = require('node:process')

const MountCommand = require('../Helpers/MountCommand')

const AskForTerminationConfirmation = async () => {
    const rl = readline.createInterface({ input, output })
    try {
        const answer = await rl.question(
            colors.yellow('Confirma a finalização deste serviço? (s/N): ')
        )

        return ['s', 'sim', 'y', 'yes'].includes(
            String(answer || '').trim().toLowerCase()
        )
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

    const title = 'Informações do serviço que será terminado'
    const totalWidth = labelWidth + 40
    const titlePad = Math.floor((totalWidth - title.length) / 2)

    console.log('\n' + colors.bold(' '.repeat(titlePad) + title + ' '.repeat(titlePad)))
    console.log(colors.gray('-'.repeat(totalWidth)))

    printLine('Service ID:', info.serviceId ?? info.id ?? '')
    printLine('Service Name:', info.serviceName)
    printLine('Service Description:', info.serviceDescription)
    printLine('Instance Repo Code Path:', info.instanceRepositoryCodePath)
    printLine('Repository Namespace:', info.originRepositoryNamespace)
    printLine('Repository Code Path:', info.originRepositoryCodePath)
    printLine('Package Path:', info.originPackagePath)

    console.log(colors.gray('-'.repeat(totalWidth)) + '\n')
}

const TerminateProvisionServiceCommand = async ({ args, startupParams, params }) => {

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

    const serviceInfo = await ServiceOrchestratorCommand((API) =>
        API.GetService({ serviceId })
    )

    if (!serviceInfo) {
        console.error(colors.red.bold(`Serviço com ID ${serviceId} não foi encontrado.`))
        return
    }

    PrintServiceInfo(serviceInfo)

    const confirmed = await AskForTerminationConfirmation()
    if (!confirmed) {
        console.log(colors.yellow('Operação cancelada pelo usuário.'))
        return
    }

    try {
        await ServiceOrchestratorCommand((API) =>
            API.TerminateService({ serviceId })
        )

        console.log(colors.green.bold('Serviço finalizado com sucesso!'))
    } catch (error) {
        console.error(
            colors.red.bold(`Não foi possível finalizar o serviço ${serviceId}.`)
        )
    }
}

module.exports = TerminateProvisionServiceCommand