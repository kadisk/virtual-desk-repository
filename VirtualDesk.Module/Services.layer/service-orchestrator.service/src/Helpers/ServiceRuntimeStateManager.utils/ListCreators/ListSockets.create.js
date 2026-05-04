const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { SOCKET_STATE_GROUP } = ItemGroupTypes

const CreateListSocketState = (stateManager) => (serviceId) => 
        stateManager.FilterStatesByPropertyData(SOCKET_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: socketId, status, data } = state
            return { socketId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.socketId < b.socketId) return 1
            if (a.socketId > b.socketId) return -1
            return 0
        })

module.exports = CreateListSocketState