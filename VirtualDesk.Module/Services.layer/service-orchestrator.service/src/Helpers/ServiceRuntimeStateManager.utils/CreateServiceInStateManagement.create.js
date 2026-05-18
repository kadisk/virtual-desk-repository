const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const { CREATING } = StatusTypes

const CreateCreateServiceInStateManagement = ({ stateManager }) => 
    (serviceId, params) => {

        const { AddNewState, ChangeStatus, SetDataProperty } = stateManager
        
        AddNewState(SERVICE_STATE_GROUP, serviceId)
        SetDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams", {serviceId, ...params})
        ChangeStatus(SERVICE_STATE_GROUP, serviceId, CREATING)

    }

module.exports = CreateCreateServiceInStateManagement