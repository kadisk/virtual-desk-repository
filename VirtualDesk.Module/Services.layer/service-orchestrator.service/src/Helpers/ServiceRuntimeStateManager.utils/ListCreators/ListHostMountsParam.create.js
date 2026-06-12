const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { HOST_MOUNT_PARAM_STATE_GROUP } = ItemGroupTypes

const CreateListHostMountParamState = (stateManager) => (serviceId) =>
        stateManager.FilterStatesByPropertyData(HOST_MOUNT_PARAM_STATE_GROUP, "serviceId", serviceId)
        .map(state => {
            const { key: hostMountParamId, status, data } = state
            return { hostMountParamId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.hostMountParamId < b.hostMountParamId) return 1
            if (a.hostMountParamId > b.hostMountParamId) return -1
            return 0
        })

module.exports = CreateListHostMountParamState
