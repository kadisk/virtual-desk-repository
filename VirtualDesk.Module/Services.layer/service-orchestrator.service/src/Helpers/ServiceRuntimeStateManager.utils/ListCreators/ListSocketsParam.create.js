const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { SOCKET_PARAM_STATE_GROUP } = ItemGroupTypes

const CreateListSocketParamState = (stateManager) => (serviceId) =>
        stateManager.FilterStatesByPropertyData(SOCKET_PARAM_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: socketParamId, status, data } = state
            return { socketParamId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.socketParamId < b.socketParamId) return 1
            if (a.socketParamId > b.socketParamId) return -1
            return 0
        })

module.exports = CreateListSocketParamState
