const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { 
    CONTAINER_STATE_GROUP
 } = ItemGroupTypes

const CreateAddNewState = require("./AddNewState.create")

const CreateAddNewContainerState = (stateManager) => (containerId, { instanceId, serviceId, containerName  }) => {
    const AddNewState = CreateAddNewState(stateManager)
    AddNewState(CONTAINER_STATE_GROUP, containerId, { instanceId, serviceId, containerName })
}

module.exports = CreateAddNewContainerState