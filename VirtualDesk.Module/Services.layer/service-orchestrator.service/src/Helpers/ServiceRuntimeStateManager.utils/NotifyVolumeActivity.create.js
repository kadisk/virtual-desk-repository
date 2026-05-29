
const StatusTypes = require("../../Types/Status.types")

const { CREATED, DESTROYED } = StatusTypes

const CreateChangeVolumeStatusName = require("./ChangeVolumeStatusName.create")

const CreateNotifyVolumeActivity = (stateManager) => ({ ID, Action, Attributes }) => {

    const ChangeVolumeStatusName =  CreateChangeVolumeStatusName(stateManager)

    switch(Action) {
        case "create":
            ChangeVolumeStatusName(ID, CREATED)
            break
        case "destroy":
            ChangeVolumeStatusName(ID, DESTROYED)
            break
        case "mount":
        case "unmount":
        case "prune":
        default:
            console.log({ ID, Action, Attributes })
    }
}

module.exports = CreateNotifyVolumeActivity