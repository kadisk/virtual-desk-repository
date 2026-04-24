const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { 
    CONTAINER_STATE_GROUP
 } = ItemGroupTypes

const {
    RUNNING,
    STOPPED,
    TERMINATED
} = StatusTypes

const CreateReconcileContainerStatus = (stateManager) => (containerId) => {
    const containerData = stateManager.GetDataByKey(CONTAINER_STATE_GROUP, containerId)
    const { State } = containerData
    if (State.Running) {
        stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, RUNNING)
    } else if (State.Status === "exited") {
        stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, STOPPED)
    } else {
        stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
    }
}

module.exports = CreateReconcileContainerStatus