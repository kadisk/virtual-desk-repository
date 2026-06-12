const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

/**
 * HostMount é independente (não pertence a serviço nem instância) e mapeia um caminho EXTERNO
 * do host (diretório ou arquivo) para dentro do container via bind mount. Como o caminho já
 * existe no host, não há volume a criar: o estado nasce READY. É registrado via CLI.
 * Ciclo: CREATE -> READY (e READY libera os HostMountParams vinculados).
 */

const {
    READY,
    CREATE,
    UPDATED
} = StatusTypes

const {
    HOST_MOUNT_STATE_GROUP,
    HOST_MOUNT_PARAM_STATE_GROUP
 } = ItemGroupTypes

const CreateHostMountProcessStatusChange = ({ stateManager }) =>
    (hostMountId) => {

        const { GetState, ChangeStatus, FilterStatesByPropertyData } = stateManager

        const { status } = GetState(HOST_MOUNT_STATE_GROUP, hostMountId)

        const _MarkLinkedHostMountParamsReady = () => {
            FilterStatesByPropertyData(HOST_MOUNT_PARAM_STATE_GROUP, "hostMountId", hostMountId)
                .filter(hostMountParam => hostMountParam.status === UPDATED)
                .forEach(hostMountParam => ChangeStatus(HOST_MOUNT_PARAM_STATE_GROUP, hostMountParam.key, READY))
        }

        console.log(`HOST_MOUNT [${hostMountId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATE:
                ChangeStatus(HOST_MOUNT_STATE_GROUP, hostMountId, READY)
                break
            case READY:
                _MarkLinkedHostMountParamsReady()
                break
            default:
                console.warn(`HostMount ${hostMountId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateHostMountProcessStatusChange
