const MountCommand = require('../Helpers/MountCommand')

const StartServiceCommand = async ({ args, startupParams, params }) => {

    const { serviceId } = args

    const ServiceOrchestratorCommand = MountCommand({ 
        serverManagerUrl: serviceOrchestratorServerManagerUrl,
        socketPath: serviceOrchestratorSocketPath, 
        commandExecutorLib,
        ExtractAPI: (APIs) => APIs.ServiceOrchestratorAppInstance.ServiceManagerInterface
    })

    await ServiceOrchestratorCommand((API) => API.StartService({ serviceId }))
    
}

module.exports = StartServiceCommand
