
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
    INITIALIZING,
    CREATED,
    UPDATED,
    RESTARTING,
    WAITING,
    CREATING,
    LOADING
} = StatusTypes

const CreateServiceProcessStatusChange = ({
    stateManager,
    RequestData
}) => (serviceId) => {

    const { GetState, TakeDataProperty, ChangeStatus } = stateManager

    const _getInstanceParams = () => TakeDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams")

    const { status, data } = GetState(SERVICE_STATE_GROUP, serviceId)
    switch (status) {
        case CREATING:
            ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
            RequestData(SERVICE_DATA, { serviceId, nextStatus: CREATED})
            break
        case INITIALIZING:
            ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
            RequestData(SERVICE_DATA, { serviceId, nextStatus: WAITING })
            break
        case CREATED:
            ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
            RequestData(RequestTypes.CREATE_NEW_INSTANCE, _getInstanceParams())
            break
        case UPDATED:
            ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
            SwapRunningInstance(serviceId, _getInstanceParams())
            break
        case WAITING:
            ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
            RequestData(INSTANCE_DATA_LIST, { serviceId })
            RequestData(IMAGE_BUILD_DATA_LIST, { serviceId })
            break
        case RESTARTING:
        case LOADING:
            break
        default:
            console.warn(`Service ${serviceId} has an unknown status: ${GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
    }
}

module.exports = CreateServiceProcessStatusChange