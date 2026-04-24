const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { 
    IMAGE_BUILD_HISTORY_STATE_GROUP
} = ItemGroupTypes

const CreateListImageBuildHistory = (stateManager) => (serviceId) => {
    const stateList = stateManager.ListStatesByPropertyData(IMAGE_BUILD_HISTORY_STATE_GROUP, "serviceId", serviceId)
    const buildDataList = stateList.map(state => {
        const { key: buildId, status, data } = state
        return {buildId, status:status.description,...data}
    })
    return buildDataList
}

module.exports = CreateListImageBuildHistory