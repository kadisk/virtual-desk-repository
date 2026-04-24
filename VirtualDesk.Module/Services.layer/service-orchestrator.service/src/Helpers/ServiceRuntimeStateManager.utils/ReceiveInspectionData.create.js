const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { 
    CONTAINER_STATE_GROUP
 } = ItemGroupTypes

const {
    TERMINATED
} = StatusTypes

const CreateReconcileContainerStatus = require("./ReconcileContainerStatus.create")

const CreateReceiveInspectionData = (stateManager) => ({ containerId, inspectionData }) => {

    const ReconcileContainerStatus = CreateReconcileContainerStatus(stateManager)

    if(inspectionData){
        const { Id, State, NetworkSettings } = inspectionData
        stateManager.UpdateData(CONTAINER_STATE_GROUP, containerId, { Id, State, NetworkSettings })
        ReconcileContainerStatus(containerId)
    } else 
        stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
}

module.exports = CreateReceiveInspectionData