const ItemGroupTypes = require("../../../Types/ItemGroup.types")

const { HOST_MOUNT_STATE_GROUP } = ItemGroupTypes

const CreateListHostMountState = (stateManager) => () =>
        stateManager.ListStates(HOST_MOUNT_STATE_GROUP)
        .map(state => {
            const { key: hostMountId, status, data } = state
            return { hostMountId, status:status.description, ...data }
        })
        .sort((a, b) => {
            if (a.hostMountId < b.hostMountId) return 1
            if (a.hostMountId > b.hostMountId) return -1
            return 0
        })

module.exports = CreateListHostMountState
