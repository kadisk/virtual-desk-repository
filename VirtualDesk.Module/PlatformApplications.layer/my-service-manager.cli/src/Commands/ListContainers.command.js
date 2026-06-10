const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListContainersCommand = async ({ args, startupParams, params }) => {

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

    const containerList = await ServiceOrchestratorCommand((API) => API.ListContainers({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Container ID',
            'Instance ID',
            'Build ID',
            'Container Name',
            'Hash'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    containerList.forEach(container => {
        const hash = (container.inspectionData && container.inspectionData.Id)
            ? container.inspectionData.Id.substring(0, 12)
            : '-'

        table.push([
            container.status,
            `[${container.containerId}]`,
            `[${container.instanceId}]`,
            `[${container.buildId}]`,
            container.containerName,
            hash
        ])
    })

    console.log(table.toString())
}

module.exports = ListContainersCommand
