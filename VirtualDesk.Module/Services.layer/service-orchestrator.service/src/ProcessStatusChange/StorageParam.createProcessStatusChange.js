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
    STORAGE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const CreateAdvanceInstanceWhenStorageReady = require("../Helpers/ServiceRuntimeStateManager.utils/AdvanceInstanceWhenStorageReady.create")

const CreateStorageParamProcessStatusChange = ({ stateManager, RequestData }) =>
    (storageParamId) => {

        const { GetState, ChangeStatus, FindKeyByPropertyData, SetDataProperty } = stateManager

        const AdvanceInstanceWhenStorageReady = CreateAdvanceInstanceWhenStorageReady(stateManager)

        const { status, data: storageParamData } = GetState(STORAGE_PARAM_STATE_GROUP, storageParamId)

        const _MarkReadyIfStorageReady = (storageId) => {
            const storageState = GetState(STORAGE_STATE_GROUP, storageId)
            if (storageState?.status === READY) {
                ChangeStatus(STORAGE_PARAM_STATE_GROUP, storageParamId, READY)
            }
        }

        const _Fail = () => {
            ChangeStatus(STORAGE_PARAM_STATE_GROUP, storageParamId, FAILURE)
            ChangeStatus(INSTANCE_STATE_GROUP, storageParamData.instanceId, FAILURE)
        }

        console.log(`STORAGE_PARAM [${storageParamId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATE:
                // Busca o Storage owner pelo namespace globalmente (qualquer serviço). Assim um
                // não-owner pode referenciar um Storage criado por um owner de outro serviço.
                const storageId = FindKeyByPropertyData(STORAGE_STATE_GROUP, "namespace", storageParamData.namespace)

                if(storageId){
                    SetDataProperty(STORAGE_PARAM_STATE_GROUP, storageParamId, "storageId", storageId)
                    RequestData(RequestTypes.UPDATE_STORAGE_PARAM_STORAGE_ID, {
                        storageParamId,
                        storageId
                    })
                }else {
                    _Fail()
                }
                break
            case UPDATED:
                _MarkReadyIfStorageReady(storageParamData.storageId)
                break
            case READY:
                AdvanceInstanceWhenStorageReady(storageParamData.instanceId)
                break
            default:
                console.warn(`StorageParam ${storageParamId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateStorageParamProcessStatusChange
