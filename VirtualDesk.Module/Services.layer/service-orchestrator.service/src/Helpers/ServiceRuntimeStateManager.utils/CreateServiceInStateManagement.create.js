
const RequestTypes = require("../../Types/Request.types")
const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { 
    SERVICE_STATE_GROUP
 } = ItemGroupTypes

const {
    CREATED,
    LOADING
} = StatusTypes

const CreateCreateServiceInStateManagement = ({ stateManager, RequestData }) => 
    (serviceId, params) => {
        stateManager.AddNewState(SERVICE_STATE_GROUP, serviceId)
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, CREATED)
        RequestData(RequestTypes.CREATE_NEW_INSTANCE, {serviceId, ...params})
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
    }

module.exports = CreateCreateServiceInStateManagement