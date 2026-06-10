const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListStorageParamsCommand = async ({ args, startupParams, params }) => {

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

    const storageParamList = await ServiceOrchestratorCommand((API) => API.ListStorageParams({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Storage Param ID',
            'Instance ID',
            'Storage ID',
            'Namespace',
            'Parameter'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    storageParamList.forEach(storageParam => {
        const storageId = (storageParam.storageId !== undefined && storageParam.storageId !== null)
            ? `[${storageParam.storageId}]`
            : '-'

        table.push([
            storageParam.status,
            `[${storageParam.storageParamId}]`,
            `[${storageParam.instanceId}]`,
            storageId,
            storageParam.namespace,
            storageParam.parameter
        ])
    })

    console.log(table.toString())
}

module.exports = ListStorageParamsCommand
