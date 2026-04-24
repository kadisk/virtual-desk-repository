const StatusTypes = require("../Types/Status.types")

const {
    WAITING
} = StatusTypes

const CreateAddNewState = (stateManager) => (group, key, data, status=WAITING) => {
    stateManager.AddNewState(group, key)
    stateManager.SetData(group, key, data)
    stateManager.ChangeStatus(group, key, status)
}

module.exports = CreateAddNewState