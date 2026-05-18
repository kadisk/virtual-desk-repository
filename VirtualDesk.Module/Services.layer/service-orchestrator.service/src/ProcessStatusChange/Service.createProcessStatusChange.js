
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateSwapRunningInstance = require("../Helpers/ServiceRuntimeStateManager.utils/SwapRunningInstance.create")

const {
    SERVICE_DATA,
    INSTANCE_DATA_LIST,
    IMAGE_BUILD_DATA_LIST
} = RequestTypes

const { 
    SERVICE_STATE_GROUP
 } = ItemGroupTypes

const {
    INITIALIZING,
    CREATED,
    UPDATED,
    RESTARTING,
    WAITING,
    CREATING,
} = StatusTypes

const CreateServiceProcessStatusChange = ({
    stateManager,
    RequestData
}) => (serviceId) => {

    const { GetState, TakeDataProperty, ChangeStatus } = stateManager

    const SwapRunningInstance = CreateSwapRunningInstance({ stateManager, RequestData })

    const _TakeInstanceParams = () => TakeDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams")

    const { status } = GetState(SERVICE_STATE_GROUP, serviceId)
    switch (status) {
        case CREATING:
            RequestData(SERVICE_DATA, { serviceId })
            RequestData(RequestTypes.CREATE_NEW_INSTANCE, _TakeInstanceParams())
            break
        case INITIALIZING:
            RequestData(SERVICE_DATA, { serviceId, nextStatus: WAITING })
            break
        case CREATED:
            break
        case UPDATED:
            SwapRunningInstance(serviceId, _TakeInstanceParams())
            break
        case WAITING:
            RequestData(INSTANCE_DATA_LIST, { serviceId })
            RequestData(IMAGE_BUILD_DATA_LIST, { serviceId })
            break
        case RESTARTING:
        default:
            console.warn(`Service ${serviceId} has an unknown status: ${GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
    }
}

module.exports = CreateServiceProcessStatusChange