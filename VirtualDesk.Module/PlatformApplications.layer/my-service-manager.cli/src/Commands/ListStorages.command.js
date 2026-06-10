const Table = require('cli-table')

const MountCommand = require('../Helpers/MountCommand')

const ListStoragesCommand = async ({ args, startupParams, params }) => {

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

    const storageList = await ServiceOrchestratorCommand((API) => API.ListStorages({ serviceId }))

    const table = new Table({
        head: [
            'Status',
            'Storage ID',
            'Service ID',
            'Namespace',
            'Filename',
            'Volume'
        ],
        style: { 'padding-left': 1, 'padding-right': 1 }
    })

    storageList.forEach(storage => {
        const volume = (storage.volumeData && storage.volumeData.Name) || '-'

        table.push([
            storage.status,
            `[${storage.storageId}]`,
            `[${storage.serviceId}]`,
            storage.namespace,
            storage.filename,
            volume
        ])
    })

    console.log(table.toString())
}

module.exports = ListStoragesCommand
