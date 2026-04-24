const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { 
    CONTAINER_STATE_GROUP
} = ItemGroupTypes

const CreateListContainers = (stateManager) => (serviceId) => {
    const stateList = stateManager.ListStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
    const containerDataList = stateList.map(state => {
        const { key: containerId, status, data } = state
        return {containerId, status:status.description,...data}
    })
    return containerDataList
}
module.exports = CreateListContainers