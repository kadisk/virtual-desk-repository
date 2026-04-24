
const StatusTypes = require("../../Types/Status.types")

const {
    STARTING,
    STOPPING,
    TERMINATED,
    STOPPED
} = StatusTypes


const CreateChangeContainerStatusByHash = require("./ChangeContainerStatusByHash.create")

const CreateNotifyContainerActivity = (stateManager) => ({ ID, Action, Attributes }) => {

    const ChangeContainerStatusByHash =  CreateChangeContainerStatusByHash(stateManager)

    switch(Action) {
        case "start":
            ChangeContainerStatusByHash(ID, STARTING)
            break
        case "kill":
            ChangeContainerStatusByHash(ID, STOPPING)
            break
        case "stop":
            break
        case "die":
            ChangeContainerStatusByHash(ID, STOPPED)
            break
        case "destroy":
            ChangeContainerStatusByHash(ID, TERMINATED)
            break
        case "attach":
        case "commit":
        case "copy":
        case "create":
        case "detach":
        case "exec_create":
        case "exec_detach":
        case "exec_die":
        case "exec_start":
        case "export":
        case "health_status":
        case "oom":
        case "pause":
        case "rename":
        case "resize":
        case "restart":
        case "top":
        case "unpause":
        case "update":
        default:
            console.log({ ID, Action, Attributes })
    }
}

module.exports = CreateNotifyContainerActivity