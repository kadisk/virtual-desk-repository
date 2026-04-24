const CreateListInstancesState = require("../ServiceRuntimeStateManager.utils/ListInstancesState.create")

const CreateListInstanceStateByStatus = (stateManager) => 
    (serviceId, status) => {
        const ListInstancesState = CreateListInstancesState(stateManager)
        const instanceList = ListInstancesState(serviceId)
        return instanceList.filter((state) => state.status === status)
    }

module.exports = CreateListInstanceStateByStatus