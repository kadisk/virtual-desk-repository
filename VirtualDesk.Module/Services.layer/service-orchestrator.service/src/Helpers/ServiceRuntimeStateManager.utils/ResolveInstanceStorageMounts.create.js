const {
    INSTANCE_STATE_GROUP,
    STORAGE_PARAM_STATE_GROUP
} = require("../../Types/ItemGroup.types")

const VOLUME_MOUNT_BASE_PATH = "/volume"

const _BuildVolumeTarget = (namespace) => `${VOLUME_MOUNT_BASE_PATH}/${namespace}`

const _BuildMountPath = (namespace, filename) =>
    filename
        ? `${_BuildVolumeTarget(namespace)}/${filename}`
        : _BuildVolumeTarget(namespace)

const CreateResolveInstanceStorageMounts = (stateManager) => (instanceId) => {

    const { GetState, FilterStatesByPropertyData } = stateManager

    const instanceState = GetState(INSTANCE_STATE_GROUP, instanceId)
    const storageParams = instanceState?.data?.storageParams

    if (!storageParams) return []

    const storageParamStates = FilterStatesByPropertyData(STORAGE_PARAM_STATE_GROUP, "instanceId", instanceId)

    return Object.entries(storageParams)
        .map(([parameter, { namespace, filename }]) => {
            const storageParamState = storageParamStates.find(({ data }) => data.parameter === parameter)
            const storageId = storageParamState?.data?.storageId
            return {
                parameter,
                namespace,
                filename,
                storageId,
                status       : storageParamState?.status,
                volumeName   : storageId ? `${namespace}-${storageId}` : undefined,
                mountPath    : _BuildMountPath(namespace, filename),
                volumeTarget : _BuildVolumeTarget(namespace)
            }
        })
}

module.exports = CreateResolveInstanceStorageMounts
