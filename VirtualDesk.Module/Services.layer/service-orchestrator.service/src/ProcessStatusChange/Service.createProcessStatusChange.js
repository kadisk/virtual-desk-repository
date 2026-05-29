const RequestTypes = require("../Types/Request.types")
const ItemGroupTypes = require("../Types/ItemGroup.types")
const StatusTypes = require("../Types/Status.types")

const CreateSwapRunningInstance = require("../Helpers/ServiceRuntimeStateManager.utils/SwapRunningInstance.create")

const {
    FETCH_SERVICE_DATA,
    FETCH_INSTANCE_DATA_LIST,
    FETCH_IMAGE_BUILD_DATA_LIST
} = RequestTypes

const { 
    SERVICE_STATE_GROUP
 } = ItemGroupTypes

const {
    INITIATE,
    INITIALIZING,
    CREATE,
    CREATING,
    CREATED,
    UPDATED,
    RESTARTING,
    HYDRATE_DATA,
    HYDRATING_DATA,
    DATA_HYDRATED
} = StatusTypes

const CreateServiceProcessStatusChange = ({ stateManager, RequestData }) => 
    (serviceId) => {

        const { 
            GetState, 
            TakeDataProperty, 
            ChangeStatus,
            GetPreviousStatus,
            HasExecutedStatusSequence
         } = stateManager

        const SwapRunningInstance = CreateSwapRunningInstance({ stateManager, RequestData })

        const previousStatus = GetPreviousStatus(SERVICE_STATE_GROUP, serviceId)

        const _TakeInstanceParams = () => TakeDataProperty(SERVICE_STATE_GROUP, serviceId, "instanceParams")
        const _TakeStorageDataParams = () => TakeDataProperty(SERVICE_STATE_GROUP, serviceId, "storageDataParams")

        const { status } = GetState(SERVICE_STATE_GROUP, serviceId)

        console.log(`SERVICE [${serviceId}] STATUS CHANGE ${status.description}`)

        switch (status) {
            case HYDRATE_DATA:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, HYDRATING_DATA)
                RequestData(FETCH_SERVICE_DATA, { serviceId })
                break
            case DATA_HYDRATED:
                if(HasExecutedStatusSequence(SERVICE_STATE_GROUP, serviceId, [ DATA_HYDRATED, HYDRATING_DATA, HYDRATE_DATA, CREATE])){
                    ChangeStatus(SERVICE_STATE_GROUP, serviceId, CREATING)
                }else if(HasExecutedStatusSequence(SERVICE_STATE_GROUP, serviceId, [ DATA_HYDRATED, HYDRATING_DATA, HYDRATE_DATA, INITIATE])){
                    ChangeStatus(SERVICE_STATE_GROUP, serviceId, INITIALIZING)
                }
                break
            case INITIATE:
            case CREATE:
                ChangeStatus(SERVICE_STATE_GROUP, serviceId, HYDRATE_DATA)
                break
            case CREATING:
                RequestData(RequestTypes.CREATE_NEW_INSTANCE, _TakeInstanceParams())
                    const storageDataParams = _TakeStorageDataParams()
                    if(storageDataParams.storageParams){
                        Object.entries(storageDataParams.storageParams)
                        .forEach(([parameter, { namespace, filename }]) => RequestData(RequestTypes.REGISTER_STORAGE, { serviceId, namespace, filename }))
                    }
                break
            case INITIALIZING:
                RequestData(FETCH_INSTANCE_DATA_LIST, { serviceId })
                RequestData(FETCH_IMAGE_BUILD_DATA_LIST, { serviceId })
                break
            case CREATED:
                break
            case UPDATED:
                SwapRunningInstance(serviceId, _TakeInstanceParams())
                break
            case RESTARTING:
            case DATA_HYDRATED:
                break
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
        }
    }

module.exports = CreateServiceProcessStatusChange