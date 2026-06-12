const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListHostMountsCommand = async ({ startupParams, params }) => {

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

    const hostMountList = await ServiceOrchestratorCommand((API) => API.ListHostMounts())

    const table = new Table({
        head: [
            'Status',
            'Host Mount ID',
            'Namespace',
            'Type',
            'Host Path'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    hostMountList.forEach(hostMount => {
        table.push([
            hostMount.status,
            `[${hostMount.hostMountId}]`,
            hostMount.namespace,
            hostMount.type || '-',
            hostMount.hostPath
        ])
    })

    console.log(table.toString())
}

module.exports = ListHostMountsCommand
