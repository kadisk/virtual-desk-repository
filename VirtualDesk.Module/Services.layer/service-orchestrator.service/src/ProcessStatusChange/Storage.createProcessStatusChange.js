
const ItemGroupTypes = require("../Types/ItemGroup.types")

const { 
    STORAGE_STATE_GROUP
 } = ItemGroupTypes

const CreateStorageProcessStatusChange = ({ stateManager, RequestData }) => 
    (storageId) => {

        const { GetState } = stateManager

        const { status, data } = GetState(STORAGE_STATE_GROUP, storageId)

        switch (status) {
            default:
                console.warn(`Storage ${storageId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateStorageProcessStatusChange