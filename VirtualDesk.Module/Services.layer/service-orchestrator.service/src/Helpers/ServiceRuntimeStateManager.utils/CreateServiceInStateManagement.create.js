const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const { CREATE } = StatusTypes

const CreateCreateServiceInStateManagement = ({ stateManager }) => 
    (serviceId, params) => {

        const { AddNewState, ChangeStatus, SetDataProperty } = stateManager
        
        AddNewState(SERVICE_STATE_GROUP, serviceId)

        const { startupParams, storageParams, ports, networkmode } = params

        SetDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams", { serviceId, startupParams, storageParams, ports, networkmode })
        SetDataProperty(SERVICE_STATE_GROUP, serviceId, "storageDataParams", { serviceId, storageParams })

        ChangeStatus(SERVICE_STATE_GROUP, serviceId, CREATE)

    }

module.exports = CreateCreateServiceInStateManagement