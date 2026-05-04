const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { STORAGE_STATE_GROUP } = ItemGroupTypes

const CreateListStorageState = (stateManager) => (serviceId) => 
        stateManager.FilterStatesByPropertyData(STORAGE_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: storageId, status, data } = state
            return { storageId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.storageId < b.storageId) return 1
            if (a.storageId > b.storageId) return -1
            return 0
        })

module.exports = CreateListStorageState