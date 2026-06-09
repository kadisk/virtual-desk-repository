const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { STORAGE_PARAM_STATE_GROUP } = ItemGroupTypes

const CreateListStorageState = (stateManager) => (serviceId) => 
        stateManager.FilterStatesByPropertyData(STORAGE_PARAM_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: storageParamId, status, data } = state
            return { storageParamId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.storageParamId < b.storageParamId) return 1
            if (a.storageParamId > b.storageParamId) return -1
            return 0
        })

module.exports = CreateListStorageState