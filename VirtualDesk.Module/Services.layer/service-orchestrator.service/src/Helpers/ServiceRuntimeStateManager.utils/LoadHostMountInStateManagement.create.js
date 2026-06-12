const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const CreateCreateObjectState = require("./CreateObjectState.create")

const { HOST_MOUNT_STATE_GROUP } = ItemGroupTypes

const { CREATE } = StatusTypes

const CreateLoadHostMountInStateManagement = (stateManager) =>
    (hostMountId, { namespace, hostPath, type }) => {

        const CreateObjectState = CreateCreateObjectState(stateManager)

        CreateObjectState(HOST_MOUNT_STATE_GROUP, hostMountId, { namespace, hostPath, type }, CREATE)
    }

module.exports = CreateLoadHostMountInStateManagement
