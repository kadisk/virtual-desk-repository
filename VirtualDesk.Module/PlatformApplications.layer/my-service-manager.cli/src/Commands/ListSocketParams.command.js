const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListSocketParamsCommand = async ({ args, startupParams, params }) => {

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

    const socketParamList = await ServiceOrchestratorCommand((API) => API.ListSocketParams({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Socket Param ID',
            'Instance ID',
            'Socket ID',
            'Namespace',
            'Parameter'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    socketParamList.forEach(socketParam => {
        const socketId = (socketParam.socketId !== undefined && socketParam.socketId !== null)
            ? `[${socketParam.socketId}]`
            : '-'

        table.push([
            socketParam.status,
            `[${socketParam.socketParamId}]`,
            `[${socketParam.instanceId}]`,
            socketId,
            socketParam.namespace,
            socketParam.parameter
        ])
    })

    console.log(table.toString())
}

module.exports = ListSocketParamsCommand
