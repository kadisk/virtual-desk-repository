const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const {
    CREATE,
    UPDATED,
    READY,
    FAILURE
} = StatusTypes

const {
    SOCKET_STATE_GROUP,
    SOCKET_PARAM_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const CreateAdvanceInstanceWhenResourcesReady = require("../Helpers/ServiceRuntimeStateManager.utils/AdvanceInstanceWhenStorageReady.create")

const CreateSocketParamProcessStatusChange = ({ stateManager, RequestData }) =>
    (socketParamId) => {

        const { GetState, ChangeStatus, FindKeyByPropertyData, SetDataProperty } = stateManager

        const AdvanceInstanceWhenResourcesReady = CreateAdvanceInstanceWhenResourcesReady(stateManager)

        const { status, data: socketParamData } = GetState(SOCKET_PARAM_STATE_GROUP, socketParamId)

        const _MarkReadyIfSocketReady = (socketId) => {
            const socketState = GetState(SOCKET_STATE_GROUP, socketId)
            if (socketState?.status === READY) {
                ChangeStatus(SOCKET_PARAM_STATE_GROUP, socketParamId, READY)
            }
        }

        const _Fail = () => {
            ChangeStatus(SOCKET_PARAM_STATE_GROUP, socketParamId, FAILURE)
            ChangeStatus(INSTANCE_STATE_GROUP, socketParamData.instanceId, FAILURE)
        }

        console.log(`SOCKET_PARAM [${socketParamId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATE:
                // Busca o Socket owner pelo namespace globalmente (qualquer serviço/instância).
                // Assim um não-owner pode se conectar ao socket criado por um owner de outro serviço.
                const socketId = FindKeyByPropertyData(SOCKET_STATE_GROUP, "namespace", socketParamData.namespace)

                if(socketId){
                    SetDataProperty(SOCKET_PARAM_STATE_GROUP, socketParamId, "socketId", socketId)
                    RequestData(RequestTypes.UPDATE_SOCKET_PARAM_SOCKET_ID, {
                        socketParamId,
                        socketId
                    })
                }else {
                    _Fail()
                }
                break
            case UPDATED:
                _MarkReadyIfSocketReady(socketParamData.socketId)
                break
            case READY:
                AdvanceInstanceWhenResourcesReady(socketParamData.instanceId)
                break
            default:
                console.warn(`SocketParam ${socketParamId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateSocketParamProcessStatusChange
