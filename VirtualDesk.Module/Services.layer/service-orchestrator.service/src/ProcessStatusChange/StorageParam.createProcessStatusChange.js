const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const {
    CREATE
} = StatusTypes

const {
    STORAGE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const CreateStorageParamProcessStatusChange = ({ stateManager, RequestData }) =>
    (storageParamId) => {

        const { GetState, FindKeyByPropertiesData, SetDataProperty } = stateManager

        const { status, data: storageParamData } = GetState(STORAGE_PARAM_STATE_GROUP, storageParamId)
        const { data: instanceData } = GetState(INSTANCE_STATE_GROUP, storageParamData.instanceId)

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
                    throw "storageId undefined"
                }
                break
            default:
                console.warn(`StorageParam ${storageParamId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateStorageParamProcessStatusChange
