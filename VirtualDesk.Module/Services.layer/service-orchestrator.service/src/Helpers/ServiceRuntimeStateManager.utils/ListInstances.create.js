const CreateListInstancesState = require("./ListInstancesState.create")

const CreateListInstances = (stateManager) => (serviceId) => {
    const ListInstancesState = CreateListInstancesState(stateManager)
    const instanceDataList = ListInstancesState(serviceId)
        .map(state => {
            const { key: instanceId, status, data } = state
            return { instanceId, status:status.description, ...data }
        })
    return instanceDataList
}

module.exports = CreateListInstances