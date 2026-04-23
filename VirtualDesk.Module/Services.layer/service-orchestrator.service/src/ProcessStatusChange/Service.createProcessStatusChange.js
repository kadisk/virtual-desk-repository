
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const {
    SERVICE_DATA,
    INSTANCE_DATA_LIST,
    IMAGE_BUILD_DATA_LIST
} = RequestTypes

const { 
    SERVICE_STATE_GROUP
 } = ItemGroupTypes

const {
    CREATED,
    UPDATED,
    RESTARTING,
    WAITING,
    LOADING
} = StatusTypes

const CreateServiceProcessStatusChange = ({
    stateManager,
    RequestData
}) => (serviceId) => {
    const { status, data } = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)
    switch (status) {
        case CREATED:
            if(!data.serviceName) {
                RequestData(SERVICE_DATA, { serviceId, nextStatus: CREATED })
            }
            break
        case WAITING:
            if(data.serviceName) {
                RequestData(INSTANCE_DATA_LIST, { serviceId })
                RequestData(IMAGE_BUILD_DATA_LIST, { serviceId })
            } else 
                RequestData(SERVICE_DATA, { serviceId, nextStatus: WAITING  })
            break
        case UPDATED:
            break
        case RESTARTING:
        case LOADING:
            break
        default:
            console.warn(`Service ${serviceId} has an unknown status: ${stateManager.GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
    }
}

module.exports = CreateServiceProcessStatusChange