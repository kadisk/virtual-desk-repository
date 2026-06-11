const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

/**
 * Estado de Socket (pertence à instância, diferente do Storage que pertence ao serviço).
 * Quando há um socketParam owner, cria-se um volume docker para compartilhar o arquivo de socket
 * entre containers. O caminho do socket dentro do container segue o padrão:
 *   /mnt/sockets/<namespace>/socket.sock
 * Ciclo de vida: CREATE -> CREATING -> (cria volume) -> CREATED -> READY
 */

const {
    READY,
    CREATE,
    CREATED,
    CREATING,
    UPDATED,
    FAILURE
} = StatusTypes

const {
    INSTANCE_STATE_GROUP,
    SOCKET_STATE_GROUP,
    SOCKET_PARAM_STATE_GROUP
 } = ItemGroupTypes

const CreateSocketProcessStatusChange = ({ stateManager, RequestData }) =>
    (socketId) => {

        const { GetState, ChangeStatus, FilterStatesByPropertyData } = stateManager

        const { status, data: socketData } = GetState(SOCKET_STATE_GROUP, socketId)

        const _MarkLinkedSocketParamsReady = () => {
            FilterStatesByPropertyData(SOCKET_PARAM_STATE_GROUP, "socketId", socketId)
                .filter(socketParam => socketParam.status === UPDATED)
                .forEach(socketParam => ChangeStatus(SOCKET_PARAM_STATE_GROUP, socketParam.key, READY))
        }

        console.log(`SOCKET [${socketId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATE:
                ChangeStatus(SOCKET_STATE_GROUP, socketId, CREATING)
                break
            case CREATING:
                const volumeName = socketData.namespace+"-"+socketId
                RequestData(RequestTypes.CREATE_NEW_SOCKET_VOLUME, {
                    socketId,
                    volumeName,
                    labels: { socketId, instanceId: socketData.instanceId, serviceId: socketData.serviceId }
                })
                break
            case CREATED:
                ChangeStatus(SOCKET_STATE_GROUP, socketId, READY)
                break
            case READY:
                _MarkLinkedSocketParamsReady()
                break
            case FAILURE:
                ChangeStatus(INSTANCE_STATE_GROUP, socketData.instanceId, FAILURE)
                break
            default:
                console.warn(`Socket ${socketId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateSocketProcessStatusChange
