const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const CreateValidateServiceDoesNotExist = (stateManager) => (serviceId) => {
    
    const { GetState } = stateManager

    if (GetState(SERVICE_STATE_GROUP, serviceId))
        throw new Error(`Service with ID ${serviceId} already exists`)
}


module.exports = CreateValidateServiceDoesNotExist