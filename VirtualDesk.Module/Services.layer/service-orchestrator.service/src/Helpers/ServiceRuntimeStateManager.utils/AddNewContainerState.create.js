const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { CONTAINER_STATE_GROUP } = ItemGroupTypes

const CreateCreateObjectState = require("./CreateObjectState.create")

const CreateAddNewContainerState = (stateManager) => (containerId, { instanceId, serviceId, containerName  }) => {
    const CreateObjectState = CreateCreateObjectState(stateManager)
    CreateObjectState(CONTAINER_STATE_GROUP, containerId, { instanceId, serviceId, containerName })
}

module.exports = CreateAddNewContainerState