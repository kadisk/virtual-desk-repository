const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { SOCKET_STATE_GROUP } = ItemGroupTypes

const CreateListSocketState = (stateManager) => (serviceId) => 
        stateManager.ListStatesByPropertyData(SOCKET_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: socketId, status, data } = state
            return { socketId, status:status.description, ...data }
        })

module.exports = CreateListSocketState