const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const {
    READY,
    CREATED,
    CREATING,
} = StatusTypes

const { 
    STORAGE_STATE_GROUP
 } = ItemGroupTypes

const CreateStorageProcessStatusChange = ({ stateManager, RequestData }) => 
    (storageId) => {

        const { GetState } = stateManager

        const { status, data: storageData } = GetState(STORAGE_STATE_GROUP, storageId)

        console.log(`STORAGE [${storageId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATING:
                const volumeName = storageData.namespace+"-"+storageId
                UpdateData(STORAGE_STATE_GROUP, storageId, { volumeData } )
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
                break
            default:
                console.warn(`Storage ${storageId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateStorageProcessStatusChange