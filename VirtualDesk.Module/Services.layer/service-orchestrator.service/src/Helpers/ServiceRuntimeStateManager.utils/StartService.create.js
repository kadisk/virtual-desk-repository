
const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const { 
    CONTAINER_STATE_GROUP
 } = ItemGroupTypes

const {
    STOPPED
} = StatusTypes

const CreateListInstanceStateByStatus = require("./ListInstanceStateByStatus.create")

const CreateStartService = ({ stateManager, RequestData }) => async (serviceId) => {

    const ListInstanceStateByStatus = CreateListInstanceStateByStatus(stateManager)

    const stoppedInstanceStateList = ListInstanceStateByStatus(serviceId, STOPPED)

    if(stoppedInstanceStateList.length > 0)
        stoppedInstanceStateList
            .forEach(({key:instanceId}) => {
                const data = stateManager.FindData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
                RequestData(RequestTypes.START_CONTAINER, {
                    instanceId, 
                    containerHashId: data.Id
                })
            })
    //else 
        //Criar nova instancia


}

module.exports = CreateStartService