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

        const { GetState, ChangeStatus, FindKeyByPropertiesData, SetDataProperty } = stateManager

        const AdvanceInstanceWhenStorageReady = CreateAdvanceInstanceWhenStorageReady(stateManager)

        const { status, data: storageParamData } = GetState(STORAGE_PARAM_STATE_GROUP, storageParamId)
        const { data: instanceData } = GetState(INSTANCE_STATE_GROUP, storageParamData.instanceId)

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
                const storageId = FindKeyByPropertiesData(STORAGE_STATE_GROUP, [
                    { property: "namespace", value: storageParamData.namespace },
                    { property: "serviceId", value: instanceData.serviceId }
                ])

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
