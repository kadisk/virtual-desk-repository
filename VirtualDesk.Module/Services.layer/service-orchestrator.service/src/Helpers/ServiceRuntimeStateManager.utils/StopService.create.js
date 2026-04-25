const RequestTypes = require("../../Types/Request.types")
const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { CONTAINER_STATE_GROUP } = ItemGroupTypes

const { RUNNING } = StatusTypes

const CreateListInstanceStateByStatus = require("./ListInstanceStateByStatus.create")

const CreateStopService = ({ stateManager, RequestData }) => (serviceId) => {

    const { FindData } = stateManager

    const ListInstanceStateByStatus = CreateListInstanceStateByStatus(stateManager)

    ListInstanceStateByStatus(serviceId, RUNNING)
    .forEach(({key:instanceId}) => {
        const data = FindData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
        RequestData(RequestTypes.STOP_CONTAINER, { 
            instanceId, 
            containerHashId: data.Id
        })
    })
}

module.exports = CreateStopService