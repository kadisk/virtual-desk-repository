const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { IMAGE_BUILD_HISTORY_STATE_GROUP } = ItemGroupTypes

const { FINISHED } = StatusTypes

const CreateCreateObjectState = require("./CreateObjectState.create")

const CreateAddNewContainerState = (stateManager) => (buildId, { tag, hashId, instanceId, serviceId }) => {
    const CreateObjectState = CreateCreateObjectState(stateManager)
    CreateObjectState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, { tag, hashId, instanceId, serviceId }, FINISHED)
}

module.exports = CreateAddNewContainerState
