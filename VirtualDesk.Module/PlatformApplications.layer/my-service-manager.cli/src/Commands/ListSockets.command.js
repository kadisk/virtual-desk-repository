const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListSocketsCommand = async ({ args, startupParams, params }) => {

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

    const socketList = await ServiceOrchestratorCommand((API) => API.ListSockets({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Socket ID',
            'Instance ID',
            'Namespace',
            'Socket Path',
            'Volume'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    socketList.forEach(socket => {
        const volume = (socket.volumeData && socket.volumeData.Name) || '-'

        table.push([
            socket.status,
            `[${socket.socketId}]`,
            `[${socket.instanceId}]`,
            socket.namespace,
            socket.socketPath,
            volume
        ])
    })

    console.log(table.toString())
}

module.exports = ListSocketsCommand
