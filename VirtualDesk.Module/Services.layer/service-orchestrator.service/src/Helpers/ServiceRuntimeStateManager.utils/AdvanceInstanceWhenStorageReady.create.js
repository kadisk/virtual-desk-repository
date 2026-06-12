const {
    INSTANCE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP,
    SOCKET_PARAM_STATE_GROUP,
    HOST_MOUNT_PARAM_STATE_GROUP
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

    const expectedStorageParamCount   = Object.keys(instanceState.data?.storageParams ?? {}).length
    const expectedSocketParamCount    = Object.keys(instanceState.data?.socketParams ?? {}).length
    const expectedHostMountParamCount = Object.keys(instanceState.data?.hostMountParams ?? {}).length

    if (expectedStorageParamCount + expectedSocketParamCount + expectedHostMountParamCount === 0) return

    const storageParamStates   = FilterStatesByPropertyData(STORAGE_PARAM_STATE_GROUP, "instanceId", instanceId)
    const socketParamStates    = FilterStatesByPropertyData(SOCKET_PARAM_STATE_GROUP, "instanceId", instanceId)
    const hostMountParamStates = FilterStatesByPropertyData(HOST_MOUNT_PARAM_STATE_GROUP, "instanceId", instanceId)

    if (storageParamStates.length < expectedStorageParamCount) return
    if (socketParamStates.length < expectedSocketParamCount) return
    if (hostMountParamStates.length < expectedHostMountParamCount) return

    const allReady = [...storageParamStates, ...socketParamStates, ...hostMountParamStates]
        .every(({ status }) => status === READY)

    if (allReady) {
        ChangeStatus(INSTANCE_STATE_GROUP, instanceId, CREATING)
    }
}

module.exports = CreateAdvanceInstanceWhenStorageReady
