const {
    INSTANCE_STATE_GROUP,
    HOST_MOUNT_STATE_GROUP,
    HOST_MOUNT_PARAM_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const NormalizeResourceParam = require("../../Utils/NormalizeResourceParam")
const { BuildHostMountTarget } = require("../../Utils/HostMountPaths")

const CreateResolveInstanceHostMounts = (stateManager) => (instanceId) => {

    const { GetState, FilterStatesByPropertyData } = stateManager

    const instanceState = GetState(INSTANCE_STATE_GROUP, instanceId)
    const hostMountParams = instanceState?.data?.hostMountParams

    if (!hostMountParams) return []

    const hostMountParamStates = FilterStatesByPropertyData(HOST_MOUNT_PARAM_STATE_GROUP, "instanceId", instanceId)

    return Object.entries(hostMountParams)
        .map(([parameter, value]) => {
            const { namespace } = NormalizeResourceParam(parameter, value)
            const hostMountParamState = hostMountParamStates.find(({ data }) => data.parameter === parameter)
            const hostMountId = hostMountParamState?.data?.hostMountId
            const hostMountState = hostMountId ? GetState(HOST_MOUNT_STATE_GROUP, hostMountId) : undefined
            const hostPath = hostMountState?.data?.hostPath
            const target = BuildHostMountTarget(namespace)
            return {
                parameter,
                namespace,
                hostMountId,
                hostPath,
                status     : hostMountParamState?.status,
                target,
                mountPath  : target,
                volumeTarget : target
            }
        })
}

module.exports = CreateResolveInstanceHostMounts
