const MountCommand = require('../Helpers/MountCommand')

const RegisterHostMountCommand = async ({ args, startupParams, params }) => {

    const { namespace, hostPath } = args

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

    try {
        const result = await ServiceOrchestratorCommand((API) => API.RegisterHostMount({ namespace, hostPath }))
        console.log(`HostMount registrado: [${result.hostMountId}] ${result.namespace} -> ${result.hostPath} (${result.type})`)
    } catch (error) {
        console.error(`Erro ao registrar host mount: ${error.message}`)
    }
}

module.exports = RegisterHostMountCommand
