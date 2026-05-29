const ItemGroupTypes = require("../../Types/ItemGroup.types")
const StatusTypes = require("../../Types/Status.types")

const { CONTAINER_STATE_GROUP } = ItemGroupTypes

const { RUNNING } = StatusTypes

const CreateGetNetworksSettings  = (stateManager) => async (serviceId) => {

    const { FilterStatesByPropertyData } = stateManager
    
    const containerStateList = FilterStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)

    const runningStateContainer = containerStateList.find(({status}) => status === RUNNING)

    const { data } = runningStateContainer

    if(data.inspectionData){
        const { NetworkSettings } = data.inspectionData
        const { Ports, Networks } = NetworkSettings
        
        return {
            ports: Ports,
            networks: Object.keys(Networks)
                .map(networkName => {
                    const network = Networks[networkName]
                    return {
                        name: networkName,
                        ipAddress: network.IPAddress,
                        gateway: network.Gateway
                    }
                })
        }
    }
}


module.exports = CreateGetNetworksSettings