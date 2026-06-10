const {
    INSTANCE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const {
    WAITING,
    CREATING,
    READY
} = require("../../Types/Status.types")


const CreateAdvanceInstanceWhenStorageReady = (stateManager) => (instanceId) => {

    const { GetState, ChangeStatus, FilterStatesByPropertyData } = stateManager

    const instanceState = GetState(INSTANCE_STATE_GROUP, instanceId)

    if (!instanceState || instanceState.status !== WAITING) return

    const expectedParamCount = Object.keys(instanceState.data?.storageParams ?? {}).length

    if (expectedParamCount === 0) return

    const storageParamStates = FilterStatesByPropertyData(STORAGE_PARAM_STATE_GROUP, "instanceId", instanceId)

    if (storageParamStates.length < expectedParamCount) return

    const allReady = storageParamStates.every(({ status }) => status === READY)

    if (allReady) {
        ChangeStatus(INSTANCE_STATE_GROUP, instanceId, CREATING)
    }
}

module.exports = CreateAdvanceInstanceWhenStorageReady
