const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListHostMountParamsCommand = async ({ args, startupParams, params }) => {

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

    const hostMountParamList = await ServiceOrchestratorCommand((API) => API.ListHostMountParams({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Host Mount Param ID',
            'Instance ID',
            'Host Mount ID',
            'Namespace',
            'Parameter'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    hostMountParamList.forEach(hostMountParam => {
        const hostMountId = (hostMountParam.hostMountId !== undefined && hostMountParam.hostMountId !== null)
            ? `[${hostMountParam.hostMountId}]`
            : '-'

        table.push([
            hostMountParam.status,
            `[${hostMountParam.hostMountParamId}]`,
            `[${hostMountParam.instanceId}]`,
            hostMountId,
            hostMountParam.namespace,
            hostMountParam.parameter
        ])
    })

    console.log(table.toString())
}

module.exports = ListHostMountParamsCommand
