const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { IMAGE_BUILD_HISTORY_STATE_GROUP } = ItemGroupTypes

const CreateListImageBuildHistory = (stateManager) => (serviceId) => {
    
    const { FilterStatesByPropertyData } = stateManager
    
    const stateList = FilterStatesByPropertyData(IMAGE_BUILD_HISTORY_STATE_GROUP, "serviceId", serviceId)
    const buildDataList = stateList
        .map(state => {
            const { key: buildId, status, data } = state
            return { buildId, status: status.description, ...data }
        })
        .sort((a, b) => {
            if (a.buildId < b.buildId) return 1
            if (a.buildId > b.buildId) return -1
            return 0
        })
    return buildDataList
    
}

module.exports = CreateListImageBuildHistory