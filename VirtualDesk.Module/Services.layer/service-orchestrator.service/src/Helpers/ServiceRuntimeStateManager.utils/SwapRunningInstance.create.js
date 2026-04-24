
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const { 
    CONTAINER_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    SERVICE_STATE_GROUP
} = ItemGroupTypes

const {
    RESTARTING,
    TERMINATED
} = StatusTypes

const CreateListRunningInstances = require("./ListRunningInstances.create")

const CreateSwapRunningInstance = (stateManager) => (serviceId, params) => {

    const ListRunningInstances = CreateListRunningInstances(stateManager)

    stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, RESTARTING)
    const runningInstances = ListRunningInstances(serviceId)
    runningInstances.forEach(({ instanceId }) => {
        const containerStateList = stateManager.ListStatesByPropertyData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
        containerStateList.forEach(({ data }) => {
            RequestData(RequestTypes.STOP_CONTAINER, { 
                instanceId, 
                containerHashId: data.Id
            })
            stateManager.ChangeStatus(INSTANCE_STATE_GROUP, instanceId, TERMINATED)
        })

    })

    RequestData(RequestTypes.CREATE_NEW_INSTANCE, {serviceId, ...params})
}

module.exports = CreateSwapRunningInstance