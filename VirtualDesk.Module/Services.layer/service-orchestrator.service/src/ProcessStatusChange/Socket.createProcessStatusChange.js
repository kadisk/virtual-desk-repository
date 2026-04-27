
const ItemGroupTypes = require("../Types/ItemGroup.types")

const { 
    SOCKET_STATE_GROUP
 } = ItemGroupTypes

const CreateSocketProcessStatusChange = ({ stateManager, RequestData }) => 
    (socketId) => {

        const { GetState } = stateManager
        
        const { status, data } = GetState(SOCKET_STATE_GROUP, socketId)

        switch (status) {
            default:
                console.warn(`Socket ${socketId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateSocketProcessStatusChange