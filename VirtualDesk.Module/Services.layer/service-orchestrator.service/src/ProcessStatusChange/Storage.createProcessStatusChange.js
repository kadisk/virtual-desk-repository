const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const {
    READY,
    CREATE,
    CREATED,
    CREATING,
    UPDATED,
    FAILURE
} = StatusTypes

const {
    SERVICE_STATE_GROUP,
    STORAGE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP
 } = ItemGroupTypes

const CreateStorageProcessStatusChange = ({ stateManager, RequestData }) => 
    (storageId) => {

        const { GetState, ChangeStatus, FilterStatesByPropertyData } = stateManager

        const { status, data: storageData } = GetState(STORAGE_STATE_GROUP, storageId)

        const _MarkLinkedStorageParamsReady = () => {
            FilterStatesByPropertyData(STORAGE_PARAM_STATE_GROUP, "storageId", storageId)
                .filter(storageParam => storageParam.status === UPDATED)
                .forEach(storageParam => ChangeStatus(STORAGE_PARAM_STATE_GROUP, storageParam.key, READY))
        }

        console.log(`STORAGE [${storageId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATE:
                ChangeStatus(STORAGE_STATE_GROUP, storageId, CREATING)
                break
            case CREATING:
                const volumeName = storageData.namespace+"-"+storageId
                RequestData(RequestTypes.CREATE_NEW_VOLUME, {
                    storageId, 
                    volumeName, 
                    labels: { storageId,  serviceId: storageData.serviceId } 
                })
                break
            case CREATED:
                ChangeStatus(STORAGE_STATE_GROUP, storageId, READY)
                break
            case READY:
                _MarkLinkedStorageParamsReady()
                break
            case FAILURE:
                ChangeStatus(SERVICE_STATE_GROUP, storageData.serviceId, FAILURE)
                break
            default:
                console.warn(`Storage ${storageId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateStorageProcessStatusChange