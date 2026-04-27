const EventEmitter = require("events")

const CreateStateManager = require("./StateManager.create")

const {
    SERVICE_STATE_GROUP,
    INSTANCE_STATE_GROUP,
    STORAGE_STATE_GROUP,
    SOCKET_STATE_GROUP,
    CONTAINER_STATE_GROUP,
    IMAGE_BUILD_HISTORY_STATE_GROUP
} = require("../Types/ItemGroup.types")

const CreateServiceProcessStatusChange           = require("../ProcessStatusChange/Service.createProcessStatusChange")
const CreateInstanceProcessStatusChange          = require("../ProcessStatusChange/Instance.createProcessStatusChange")
const CreateContainerProcessStatusChange         = require("../ProcessStatusChange/Container.createProcessStatusChange")
const CreateImageBuildHistoryProcessStatusChange = require("../ProcessStatusChange/ImageBuildHistory.createProcessStatusChange")

const CreateListRunningInstances           = require("./ServiceRuntimeStateManager.utils/ListRunningInstances.create")
const CreateOnChangeStatusTriggerService   = require("./ServiceRuntimeStateManager.utils/OnChangeStatusTriggerService.create")
const CreateCreateServiceInStateManagement = require("./ServiceRuntimeStateManager.utils/CreateServiceInStateManagement.create")
const CreateLoadServiceInStateManagement   = require("./ServiceRuntimeStateManager.utils/LoadServiceInStateManagement.create")
const CreateUpdateServiceInStateManagement = require("./ServiceRuntimeStateManager.utils/UpdateServiceInStateManagement.create")
const CreateGetNetworksSettings            = require("./ServiceRuntimeStateManager.utils/GetNetworksSettings.create")
const CreateStartService                   = require("./ServiceRuntimeStateManager.utils/StartService.create")
const CreateStopService                    = require("./ServiceRuntimeStateManager.utils/StopService.create")
const CreateNotifyContainerActivity        = require("./ServiceRuntimeStateManager.utils/NotifyContainerActivity.create")
const CreateSwapRunningInstance            = require("./ServiceRuntimeStateManager.utils/SwapRunningInstance.create")
const CreateListInstances                  = require("./ServiceRuntimeStateManager.utils/ListInstances.create")
const CreateListStorages                   = require("./ServiceRuntimeStateManager.utils/ListStorages.create")
const CreateListSockets                    = require("./ServiceRuntimeStateManager.utils/ListSockets.create")
const CreateListContainers                 = require("./ServiceRuntimeStateManager.utils/ListContainers.create")
const CreateListImageBuildHistory          = require("./ServiceRuntimeStateManager.utils/ListImageBuildHistory.create")
const CreateGetServiceStatus               = require("./ServiceRuntimeStateManager.utils/GetServiceStatus.create")
const CreateProcessRequest                 = require("./ServiceRuntimeStateManager.utils/ProcessRequest.create")
const CreateTriggerDecommissioningProcess  = require("./ServiceRuntimeStateManager.utils/TriggerDecommissioningProcess.create")


const CreateServiceRuntimeStateManager = () => {

    const stateManager = CreateStateManager()
    const eventEmitter = new EventEmitter()
    const REQUEST_EVENT = Symbol()

    const RequestData = (requestType, requestData) => eventEmitter.emit(REQUEST_EVENT, { requestType, ... requestData})

    stateManager.onChangeStatus(SERVICE_STATE_GROUP,             ({ key: serviceId })   => CreateServiceProcessStatusChange({ stateManager, RequestData }) (serviceId))
    stateManager.onChangeStatus(INSTANCE_STATE_GROUP,            ({ key: instanceId })  => CreateInstanceProcessStatusChange({ stateManager, RequestData })(instanceId))
    stateManager.onChangeStatus(CONTAINER_STATE_GROUP,           ({ key: containerId }) => CreateContainerProcessStatusChange({ stateManager, RequestData })(containerId))
    stateManager.onChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, ({ key: buildId })     => CreateImageBuildHistoryProcessStatusChange({ stateManager, RequestData })(buildId))
    
    const ListInstances         = CreateListInstances(stateManager)
    const ListStorages          = CreateListStorages(stateManager)
    const ListSockets           = CreateListSockets(stateManager)
    const ListContainers        = CreateListContainers(stateManager)
    const ListImageBuildHistory = CreateListImageBuildHistory(stateManager)
    const GetServiceStatus      = CreateGetServiceStatus(stateManager)

    const onRequestData = (getData) => {
        eventEmitter.on(REQUEST_EVENT, CreateProcessRequest({ getData, stateManager, RequestData }))
    }

    return {
        ListInstances,
        ListStorages,
        ListSockets,
        ListContainers,
        ListImageBuildHistory,
        GetServiceStatus,
        onRequestData,
        SwapRunningInstance               : CreateSwapRunningInstance({ stateManager, RequestData }),
        ListRunningInstances              : CreateListRunningInstances(stateManager),
        TriggerDecommissioningProcess     : CreateTriggerDecommissioningProcess({ stateManager, RequestData }),
        NotifyContainerActivity           : CreateNotifyContainerActivity(stateManager),
        StartService                      : CreateStartService({ stateManager, RequestData }),
        StopService                       : CreateStopService({ stateManager, RequestData }),
        GetNetworksSettings               : CreateGetNetworksSettings(stateManager),
        UpdateServiceInStateManagement    : CreateUpdateServiceInStateManagement({ stateManager, RequestData }),
        LoadServiceInStateManagement      : CreateLoadServiceInStateManagement(stateManager),
        CreateServiceInStateManagement    : CreateCreateServiceInStateManagement({ stateManager, RequestData }),
        onChangeImageBuildHistoryListData : CreateOnChangeStatusTriggerService(stateManager, { group: IMAGE_BUILD_HISTORY_STATE_GROUP, Function: serviceId => ListImageBuildHistory(serviceId) }),
        onChangeContainerListData         : CreateOnChangeStatusTriggerService(stateManager, { group: CONTAINER_STATE_GROUP,           Function: serviceId => ListContainers(serviceId) }),
        onChangeInstanceListData          : CreateOnChangeStatusTriggerService(stateManager, { group: INSTANCE_STATE_GROUP,            Function: serviceId => ListInstances(serviceId) }),
        onChangeStorageListData           : CreateOnChangeStatusTriggerService(stateManager, { group: STORAGE_STATE_GROUP,             Function: serviceId => ListStorages(serviceId) }),
        onChangeSocketListData            : CreateOnChangeStatusTriggerService(stateManager, { group: SOCKET_STATE_GROUP,              Function: serviceId => ListSockets(serviceId) }),
        onChangeServiceStatus             : (f) => { stateManager.onChangeStatus(SERVICE_STATE_GROUP, ({ key: serviceId }) => f({serviceId, status: GetServiceStatus(serviceId)})) }
    }
}

module.exports = CreateServiceRuntimeStateManager