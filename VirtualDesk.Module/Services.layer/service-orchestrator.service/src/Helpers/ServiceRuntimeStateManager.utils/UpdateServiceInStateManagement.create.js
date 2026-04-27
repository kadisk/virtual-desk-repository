
const RequestTypes = require("../../Types/Request.types")
const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const { UPDATING, UPDATED } = StatusTypes

const CreateUpdateServiceInStateManagement = ({ stateManager, RequestData }) => 
    (serviceId, params) => {
        const { ChangeStatus, SetDataProperty } = stateManager
        SetDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams", params)
        ChangeStatus(SERVICE_STATE_GROUP, serviceId, UPDATING)
        RequestData(RequestTypes.SERVICE_DATA, { serviceId, nextStatus: UPDATED})
    }

module.exports = CreateUpdateServiceInStateManagement