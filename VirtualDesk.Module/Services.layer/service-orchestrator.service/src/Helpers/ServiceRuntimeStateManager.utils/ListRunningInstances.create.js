const StatusTypes = require("../../Types/Status.types")

const { RUNNING } = StatusTypes

const CreateFilterInstancesState = require("./FilterInstancesState.create")

const CreateListRunningInstances = (stateManager) => (serviceId) => {

        const ListInstancesState = CreateFilterInstancesState(stateManager)
        
        const instanceDataList = ListInstancesState(serviceId)
            .filter(({status}) => status === RUNNING)
            .map(state => {
                const { key: instanceId, status, data } = state
                return { instanceId, status:status.description, ...data }
            })
        return instanceDataList
    }

module.exports = CreateListRunningInstances