const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const {
    CREATE,
    UPDATED,
    READY,
    FAILURE
} = StatusTypes

const {
    HOST_MOUNT_STATE_GROUP,
    HOST_MOUNT_PARAM_STATE_GROUP,
    INSTANCE_STATE_GROUP
 } = ItemGroupTypes

const CreateAdvanceInstanceWhenResourcesReady = require("../Helpers/ServiceRuntimeStateManager.utils/AdvanceInstanceWhenStorageReady.create")

const CreateHostMountParamProcessStatusChange = ({ stateManager, RequestData }) =>
    (hostMountParamId) => {

        const { GetState, ChangeStatus, FindKeyByPropertyData, SetDataProperty } = stateManager

        const AdvanceInstanceWhenResourcesReady = CreateAdvanceInstanceWhenResourcesReady(stateManager)

        const { status, data: hostMountParamData } = GetState(HOST_MOUNT_PARAM_STATE_GROUP, hostMountParamId)

        const _MarkReadyIfHostMountReady = (hostMountId) => {
            const hostMountState = GetState(HOST_MOUNT_STATE_GROUP, hostMountId)
            if (hostMountState?.status === READY) {
                ChangeStatus(HOST_MOUNT_PARAM_STATE_GROUP, hostMountParamId, READY)
            }
        }

        const _Fail = () => {
            ChangeStatus(HOST_MOUNT_PARAM_STATE_GROUP, hostMountParamId, FAILURE)
            ChangeStatus(INSTANCE_STATE_GROUP, hostMountParamData.instanceId, FAILURE)
        }

        console.log(`HOST_MOUNT_PARAM [${hostMountParamId}] STATUS CHANGE ${status.description}`)
        switch (status) {
            case CREATE:
                const hostMountId = FindKeyByPropertyData(HOST_MOUNT_STATE_GROUP, "namespace", hostMountParamData.namespace)

                if(hostMountId){
                    SetDataProperty(HOST_MOUNT_PARAM_STATE_GROUP, hostMountParamId, "hostMountId", hostMountId)
                    RequestData(RequestTypes.UPDATE_HOST_MOUNT_PARAM_HOST_MOUNT_ID, {
                        hostMountParamId,
                        hostMountId
                    })
                }else {
                    _Fail()
                }
                break
            case UPDATED:
                _MarkReadyIfHostMountReady(hostMountParamData.hostMountId)
                break
            case READY:
                AdvanceInstanceWhenResourcesReady(hostMountParamData.instanceId)
                break
            default:
                console.warn(`HostMountParam ${hostMountParamId} has an unknown status: ${status.description}`)
        }
    }


module.exports = CreateHostMountParamProcessStatusChange
