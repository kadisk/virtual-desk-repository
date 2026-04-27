const StatusTypes = require("../../Types/Status.types")
const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const { UNKNOWN } = StatusTypes

const CreateGetServiceStatus = (stateManager) => (serviceId) => {

    const { GetState } = stateManager
    
    try{
        const state = GetState(SERVICE_STATE_GROUP, serviceId)
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