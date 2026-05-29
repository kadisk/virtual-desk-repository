
const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const CreateValidateServiceDoesNotExist = require("./ValidateServiceDoesNotExist.create")

const { SERVICE_STATE_GROUP } = ItemGroupTypes

const { INITIATE } = StatusTypes

const CreateLoadServiceInStateManagement = (stateManager) => (serviceId) => {

    console.log(`LOAD SERVICE IN STATE ${serviceId}`)

    const { AddNewState, ChangeStatus } = stateManager

    const ValidateServiceDoesNotExist = CreateValidateServiceDoesNotExist(stateManager)
    ValidateServiceDoesNotExist()
    AddNewState(SERVICE_STATE_GROUP, serviceId)
    ChangeStatus(SERVICE_STATE_GROUP, serviceId, INITIATE)
    
}

module.exports = CreateLoadServiceInStateManagement