const CreateListInstancesState = require("./ListInstancesState.create")

const CreateListRunningInstances = (stateManager) => (serviceId) => {

        const ListInstancesState = CreateListInstancesState(stateManager)
        
        const instanceDataList = ListInstancesState(serviceId)
            .filter(({status}) => status === RUNNING)
            .map(state => {
                const { key: instanceId, status, data } = state
                return { instanceId, status:status.description, ...data }
            })
        return instanceDataList
    }

module.exports = CreateListRunningInstances