const ItemGroupTypes = require("../Types/ItemGroup.types")

const { INSTANCE_STATE_GROUP } = ItemGroupTypes

const CreateListInstancesState = (stateManager) => (serviceId) => 
        stateManager.ListStatesByPropertyData(INSTANCE_STATE_GROUP, "serviceId", serviceId)

module.exports = CreateListInstancesState