const {
    INSTANCE_STATE_GROUP,
    SOCKET_PARAM_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const NormalizeResourceParam = require("../../Utils/NormalizeResourceParam")

const {
    BuildSocketVolumeTarget: _BuildVolumeTarget,
    BuildSocketPath: _BuildSocketPath
} = require("../../Utils/SocketMountPaths")

const CreateResolveInstanceSocketMounts = (stateManager) => (instanceId) => {

    const { GetState, FilterStatesByPropertyData } = stateManager

    const instanceState = GetState(INSTANCE_STATE_GROUP, instanceId)
    const socketParams = instanceState?.data?.socketParams

    if (!socketParams) return []

    const socketParamStates = FilterStatesByPropertyData(SOCKET_PARAM_STATE_GROUP, "instanceId", instanceId)

    return Object.entries(socketParams)
        .map(([parameter, value]) => {
            const { namespace } = NormalizeResourceParam(parameter, value)
            const socketParamState = socketParamStates.find(({ data }) => data.parameter === parameter)
            const socketId = socketParamState?.data?.socketId
            return {
                parameter,
                namespace,
                socketId,
                status       : socketParamState?.status,
                volumeName   : socketId ? `${namespace}-${socketId}` : undefined,
                socketPath   : _BuildSocketPath(namespace),
                mountPath    : _BuildSocketPath(namespace),
                volumeTarget : _BuildVolumeTarget(namespace)
            }
        })
}

module.exports = CreateResolveInstanceSocketMounts
