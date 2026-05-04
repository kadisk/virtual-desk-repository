const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { INSTANCE_STATE_GROUP } = ItemGroupTypes

const CreateFilterInstancesState = (stateManager) => (serviceId) => 
        stateManager.FilterStatesByPropertyData(INSTANCE_STATE_GROUP, "serviceId", serviceId)

module.exports = CreateFilterInstancesState