
const RequestTypes = require("../../Types/Request.types")
const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const { TERMINATED } = StatusTypes

const CreateTriggerDecommissioningProcess = (stateManager) => (serviceId) => {
    
    const { GetState } = stateManager
    
    const state = GetState(SERVICE_STATE_GROUP, serviceId)
    if (!state) {
        throw new Error(`Service with ID ${serviceId} does not exist`)
    }
    const { status } = state
    if(status === TERMINATED){
        RequestData(RequestTypes.MARK_AS_DECOMMISSIONED, { serviceId })
    } else {
        throw new Error(
            `Service[${serviceId}] must be [TERMINATED] to be decommissioned. Current status: [${status.description}].`
        )
    }
}


module.exports = CreateTriggerDecommissioningProcess