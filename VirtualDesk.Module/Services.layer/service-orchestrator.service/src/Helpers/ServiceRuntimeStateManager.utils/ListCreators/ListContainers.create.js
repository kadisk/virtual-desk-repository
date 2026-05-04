const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { CONTAINER_STATE_GROUP } = ItemGroupTypes

const CreateListContainers = (stateManager) => (serviceId) => {

    const { FilterStatesByPropertyData } = stateManager
    
    const stateList = FilterStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
    const containerDataList = stateList.map(state => {
        const { key: containerId, status, data } = state
        return {containerId, status:status.description,...data}
    })
    .sort((a, b) => {
        if (a.containerId < b.containerId) return 1
        if (a.containerId > b.containerId) return -1
        return 0
    })
    return containerDataList
    
}
module.exports = CreateListContainers