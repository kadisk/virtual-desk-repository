const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListServicesCommand = async ({ startupParams, params }) => {

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

    const serviceInfoList = await ServiceOrchestratorCommand((API) => API.ListServices())

    const table = new Table({
        head: [
            'Status',
            '[ID] Service',
            'Repository Namespace'
        ]
    })

    serviceInfoList.forEach(service => {
        table.push([
            service.status,
            `[${service.serviceId}] ${service.serviceName}`,
            `${service.originRepositoryNamespace}`
        ])
    })

    console.log(table.toString())
}

module.exports = ListServicesCommand