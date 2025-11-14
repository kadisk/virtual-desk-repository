
const MountCommand = require('../Helpers/MountCommand')

const StopServiceCommand = async ({ args, startupParams, params }) => {

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

    await ServiceOrchestratorCommand((API) => API.StopService({ serviceId }))
}

module.exports = StopServiceCommand
