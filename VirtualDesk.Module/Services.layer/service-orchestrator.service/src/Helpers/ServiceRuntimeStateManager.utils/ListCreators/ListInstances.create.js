const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { INSTANCE_STATE_GROUP } = ItemGroupTypes

const CreateListInstances = (stateManager) => (serviceId) => {

    const { FilterStatesByPropertyData } = stateManager

    const stateList = FilterStatesByPropertyData(INSTANCE_STATE_GROUP, "serviceId", serviceId)
    const instanceDataList = stateList
        .map(state => {
            const { key: instanceId, status, data } = state
            return { instanceId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.instanceId < b.instanceId) return 1
            if (a.instanceId > b.instanceId) return -1
            return 0
        })
    return instanceDataList
}

module.exports = CreateListInstances