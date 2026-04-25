
const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { CONTAINER_STATE_GROUP } = ItemGroupTypes

const CreateChangeContainerStatusByHash = (stateManager) => (containerHashId, newStatus) => {
    
    const { ChangeStatus, FindKeyByPropertyData } = stateManager

    const containerId = FindKeyByPropertyData(CONTAINER_STATE_GROUP, "Id", containerHashId)
    if(containerId)
        ChangeStatus(CONTAINER_STATE_GROUP, containerId, newStatus)
    else console.log(`the container with hashId ${containerId} is not in the state manager`)
    
}

module.exports = CreateChangeContainerStatusByHash