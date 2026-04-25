const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { CONTAINER_STATE_GROUP } = ItemGroupTypes

const { RUNNING, STOPPED, TERMINATED } = StatusTypes

const CreateReconcileContainerStatus = (stateManager) => (containerId) => {

    const { ChangeStatus, GetDataByKey } = stateManager
    
    const containerData = GetDataByKey(CONTAINER_STATE_GROUP, containerId)
    const { State } = containerData
    if (State.Running) {
        ChangeStatus(CONTAINER_STATE_GROUP, containerId, RUNNING)
    } else if (State.Status === "exited") {
        ChangeStatus(CONTAINER_STATE_GROUP, containerId, STOPPED)
    } else {
        ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
    }
}

module.exports = CreateReconcileContainerStatus