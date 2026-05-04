const CreateFilterInstancesState = require("../ServiceRuntimeStateManager.utils/FilterInstancesState.create")

const CreateListInstanceStateByStatus = (stateManager) => 
    (serviceId, status) => {
        const ListInstancesState = CreateFilterInstancesState(stateManager)
        const instanceList = ListInstancesState(serviceId)
        return instanceList.filter((state) => state.status === status)
    }

module.exports = CreateListInstanceStateByStatus