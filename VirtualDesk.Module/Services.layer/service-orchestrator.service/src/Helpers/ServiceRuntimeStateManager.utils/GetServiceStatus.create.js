const ItemGroupTypes = require("../Types/ItemGroup.types")

const { 
    SERVICE_STATE_GROUP
} = ItemGroupTypes

const CreateGetServiceStatus = (stateManager) => (serviceId) => {
    try{
        const state = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)
        if (!state) {
            throw new Error(`Service with ID ${serviceId} does not exist`)
        }
        return state.status.description
    } catch(e) {
        console.log(e)
        return UNKNOWN.description
    }
}

module.exports = CreateGetServiceStatus