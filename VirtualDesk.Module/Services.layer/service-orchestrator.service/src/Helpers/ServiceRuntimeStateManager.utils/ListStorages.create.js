const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { STORAGE_STATE_GROUP } = ItemGroupTypes

const CreateListStorageState = (stateManager) => (serviceId) => 
        stateManager.ListStatesByPropertyData(STORAGE_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: storageId, status, data } = state
            return { storageId, status:status.description, ...data }
        })

module.exports = CreateListStorageState