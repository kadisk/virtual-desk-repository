
const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const CreateValidateServiceDoesNotExist = require("./ValidateServiceDoesNotExist.create")

const { 
    SERVICE_STATE_GROUP
 } = ItemGroupTypes

const {
    WAITING
} = StatusTypes

const CreateLoadServiceInStateManagement = (stateManager) => (serviceId) => {
        const ValidateServiceDoesNotExist = CreateValidateServiceDoesNotExist(stateManager)
        ValidateServiceDoesNotExist()
        stateManager.AddNewState(SERVICE_STATE_GROUP, serviceId)
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, WAITING)
    }

module.exports = CreateLoadServiceInStateManagement