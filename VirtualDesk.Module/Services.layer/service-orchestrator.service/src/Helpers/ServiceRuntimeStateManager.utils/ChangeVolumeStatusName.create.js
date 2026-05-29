
const ItemGroupTypes = require("../../Types/ItemGroup.types")

const { STORAGE_STATE_GROUP } = ItemGroupTypes

const CreateChangeVolumeStatusName = (stateManager) => (volumeData, newStatus) => {
    
    const { ChangeStatus, FindKeyByPropertyData } = stateManager

    const storageId = FindKeyByPropertyData(STORAGE_STATE_GROUP, "volumeData", volumeData)
    
    if(storageId)
        ChangeStatus(STORAGE_STATE_GROUP, containerId, newStatus)
    else console.log(`not found`)//TODO melhor mensagem de erro
    
}

module.exports = CreateChangeVolumeStatusName