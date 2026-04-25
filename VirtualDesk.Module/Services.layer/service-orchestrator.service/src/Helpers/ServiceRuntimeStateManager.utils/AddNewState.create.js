const StatusTypes = require("../../Types/Status.types")

const { WAITING } = StatusTypes

const CreateCreateObjectState = (stateManager) => (group, key, data, status=WAITING) => {
    
    const { AddNewState, ChangeStatus, SetData } = stateManager

    AddNewState(group, key)
    SetData(group, key, data)
    ChangeStatus(group, key, status)
    
}

module.exports = CreateCreateObjectState