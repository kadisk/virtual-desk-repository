
const EventEmitter = require("events")

const CreateStateManager = require("./StateManager.create")

const UNKNOWN        = Symbol("UNKNOWN")
const CREATING       = Symbol("CREATING")
const CREATED        = Symbol("CREATED")
const UPDATED        = Symbol("UPDATED")
const UPDATING       = Symbol("UPDATING")
const RESTARTING     = Symbol("RESTARTING")
const WAITING        = Symbol("WAITING")
const LOADING        = Symbol("LOADING")
const STARTING       = Symbol("STARTING")
const STOPPING       = Symbol("STOPPING")
const STOPPED        = Symbol("STOPPED")
const RUNNING        = Symbol("RUNNING")
const FAILURE        = Symbol("FAILURE")
const FINISHED       = Symbol("FINISHED")
const TERMINATED     = Symbol("TERMINATED")
const DECOMMISSIONED = Symbol("DECOMMISSIONED")

const RequestTypes  = require("./Request.types")

const SERVICE_STATE_GROUP             = Symbol("SERVICE_STATE_GROUP")
const INSTANCE_STATE_GROUP            = Symbol("INSTANCE_STATE_GROUP")
const CONTAINER_STATE_GROUP           = Symbol("CONTAINER_STATE_GROUP")
const IMAGE_BUILD_HISTORY_STATE_GROUP = Symbol("IMAGE_BUILD_HISTORY_STATE_GROUP")

const CreateServiceRuntimeStateManager = () => {

    const stateManager = CreateStateManager()

    const eventEmitter = new EventEmitter()

    const REQUEST_EVENT = Symbol()

    const _ValidateServiceDoesNotExist = (serviceId) => {
        if (stateManager.GetState(SERVICE_STATE_GROUP, serviceId))
            throw new Error(`Service with ID ${serviceId} already exists`)
    }

    const _RequestData = (requestType, requestData) => eventEmitter.emit(REQUEST_EVENT, { requestType, ... requestData})

    const _ProcessServiceStatusChange = (serviceId) => {
        const { status, data } = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)
        switch (status) {
            case CREATED:
                if(!data.serviceName) {
                    _RequestData(RequestTypes.SERVICE_DATA, { serviceId, nextStatus: CREATED })
                }
                break
            case WAITING:
                if(data.serviceName) {
                    _RequestData(RequestTypes.INSTANCE_DATA_LIST, { serviceId })
                    _RequestData(RequestTypes.IMAGE_BUILD_DATA_LIST, { serviceId })
                } else 
                    _RequestData(RequestTypes.SERVICE_DATA, { serviceId, nextStatus: WAITING  })
                break
            case UPDATED:
                break
            case RESTARTING:
            case LOADING:
                break
            default:
                console.warn(`Service ${serviceId} has an unknown status: ${stateManager.GetState(SERVICE_STATE_GROUP, serviceId).status.description}`)
        }
    }

    const _ProcessInstanceStatusChange = (instanceId) => {
        const { status, data } = stateManager.GetState(INSTANCE_STATE_GROUP, instanceId)
        const { serviceId } = data
        const { status:serviceStatus, data: serviceData } = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)

        switch (status) {
            case CREATING:
                if(serviceData.serviceName){
                    _RequestData(RequestTypes.REGISTER_STORAGES, {
                        serviceId,
                        instanceId,
                        storageParams: data.storageParams
                    })
                } else setImmediate(() => _ProcessInstanceStatusChange(instanceId)) 
                break
            case CREATED:
                if(serviceData.serviceName){
                    _RequestData(RequestTypes.BUILD_NEW_IMAGE, {
                        serviceId,
                        instanceId,
                        serviceName               : serviceData.serviceName,
                        originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                        originRepositoryNamespace : serviceData.originRepositoryNamespace,
                        originPackagePath         : serviceData.originPackagePath,
                        startupParams             : data.startupParams,
                        networkmode               : data.networkmode,
                        ports                     : data.ports
                    })
                } else setImmediate(() => _ProcessInstanceStatusChange(instanceId))
                break
            case WAITING:
                _RequestData(RequestTypes.CONTAINER_DATA, { serviceId, instanceId })
                break
            case RUNNING:
                stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, RUNNING)
                break
            case STOPPING:
            case STOPPED:
            case TERMINATED:
                if(serviceStatus !== RESTARTING && ListRunningInstances(serviceId).length === 0)
                    stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, status)
                break
            case STARTING:
            case LOADING:
                break
            default:
                console.warn(`Instance ${instanceId} has an unknown status: ${status.description}`)
        }
    }

    const _ProcessContainerStatusChange = (containerId) => {
        const { status, data } = stateManager.GetState(CONTAINER_STATE_GROUP, containerId)
        switch (status) {
            case WAITING:
                _RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId     : data.serviceId,
                        instanceId    : data.instanceId,
                        containerId,
                        containerName : data.containerName
                    })
                break
            case STARTING:
                _RequestData(RequestTypes.CONTAINER_INSPECTION_DATA, { 
                        serviceId     : data.serviceId,
                        instanceId    : data.instanceId,
                        containerId,
                        containerName : data.containerName
                    })
                break
            case RUNNING:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, RUNNING)
                break
            case STOPPING:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, STOPPING)
                break
            case STOPPED:
                const { status:instanceStatus, data:instanceData } = stateManager.GetState(INSTANCE_STATE_GROUP, data.instanceId)
                if(instanceStatus === TERMINATED) {
                    _RequestData(RequestTypes.REMOVE_CONTAINER, { 
                        instanceId      : instanceData.instanceId,
                        containerHashId : instanceData.Id
                    })
                } else stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, STOPPED)
                break
            case TERMINATED:
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, data.instanceId, TERMINATED)
                break
            default:
                console.warn(`Container ${containerId} has an unknown status: ${status.description}`)
        }
    }

    const _ProcessImageBuildHistoryStatusChange = (buildId) => {

        const { status, data } = stateManager.GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId)
        const { status: statusService, data:serviceData } = stateManager.GetState(SERVICE_STATE_GROUP, data.serviceId)
        const { status:instanceStatus, data:instanceData } = stateManager.GetState(INSTANCE_STATE_GROUP, data.instanceId) || {}

        switch (status) {
            case WAITING:
                const instanceRunningOrStoppingList = ListInstancesState(data.serviceId)
                    .filter(({status}) => status === RUNNING || status === STOPPING)
                
                if(instanceRunningOrStoppingList.length === 0 ){
                    _RequestData(RequestTypes.CREATE_NEW_CONTAINER, { 
                        buildId,
                        instanceId  : data.instanceId,
                        tag         : data.tag,
                        serviceId   : data.serviceId,
                        serviceName : serviceData.serviceName,
                        networkmode : instanceData.networkmode,
                        ports       : instanceData.ports
                    })
                    
                } else setTimeout(() => {
                    _ProcessImageBuildHistoryStatusChange(buildId)
                }, 3000)
                break
            case FINISHED:
                if(instanceStatus === STARTING){
                    if(statusService === RESTARTING){
                        stateManager.ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, WAITING)
                    } else {
                        _RequestData(RequestTypes.CREATE_NEW_CONTAINER, { 
                            buildId,
                            instanceId  : data.instanceId,
                            tag         : data.tag,
                            serviceId   : data.serviceId,
                            serviceName : serviceData.serviceName,
                            networkmode : instanceData.networkmode,
                            ports       : instanceData.ports
                        })
                    }
                }
                /**/
                break
            default:
        }
    }

    stateManager.onChangeStatus(SERVICE_STATE_GROUP,             ({ key: serviceId })   => _ProcessServiceStatusChange(serviceId))
    stateManager.onChangeStatus(INSTANCE_STATE_GROUP,            ({ key: instanceId })  => _ProcessInstanceStatusChange(instanceId))
    stateManager.onChangeStatus(CONTAINER_STATE_GROUP,           ({ key: containerId }) => _ProcessContainerStatusChange(containerId))
    stateManager.onChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, ({ key: buildId })     => _ProcessImageBuildHistoryStatusChange(buildId))

    const _AddNewState = (group, key, data, status=WAITING) => {
        stateManager.AddNewState(group, key)
        stateManager.SetData(group, key, data)
        stateManager.ChangeStatus(group, key, status)
    }

    const AddNewContainerState = (containerId, { instanceId, serviceId, containerName  }) => 
        _AddNewState(CONTAINER_STATE_GROUP, containerId, { instanceId, serviceId, containerName })

    const AddNewBuildState = (buildId, { tag, hashId, instanceId, serviceId }) => 
        _AddNewState(IMAGE_BUILD_HISTORY_STATE_GROUP, buildId, { tag, hashId, instanceId, serviceId }, FINISHED)

    const _ReceiveInspectionData = ({ containerId, inspectionData }) => {
        if(inspectionData){
            const { Id, State, NetworkSettings } = inspectionData
            stateManager.UpdateData(CONTAINER_STATE_GROUP, containerId, { Id, State, NetworkSettings })
            _ReconcileContainerStatus(containerId)
        } else 
            stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
    }

    const _ReconcileContainerStatus = (containerId) => {
        const containerData = stateManager.GetDataByKey(CONTAINER_STATE_GROUP, containerId)
        const { State } = containerData
        if (State.Running) {
            stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, RUNNING)
        } else if (State.Status === "exited") {
            stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, STOPPED)
        } else {
            stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, TERMINATED)
        }
    }

    const LoadServiceInStateManagement = (serviceId) => {
        _ValidateServiceDoesNotExist()
        stateManager.AddNewState(SERVICE_STATE_GROUP, serviceId)
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, WAITING)
    }

    const CreateServiceInStateManagement = (serviceId, params) => {
        stateManager.AddNewState(SERVICE_STATE_GROUP, serviceId)
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, CREATED)
        _RequestData(RequestTypes.CREATE_NEW_INSTANCE, {serviceId, ...params})
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, LOADING)
    }

    const UpdateServiceInStateManagement = (serviceId, params) => {
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, UPDATING)
       _RequestData(RequestTypes.SERVICE_DATA, { serviceId, nextStatus: UPDATED,  instanceParams: params })
    }

    const TriggerDecommissioningProcess = (serviceId) => {
        const state = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)
        if (!state) {
            throw new Error(`Service with ID ${serviceId} does not exist`)
        }
        const { status } = state
        if(status === TERMINATED){
            _RequestData(RequestTypes.MARK_AS_DECOMMISSIONED, { serviceId })
        } else {
            throw new Error(
                `Service[${serviceId}] must be [TERMINATED] to be decommissioned. Current status: [${status.description}].`
            )
        }
    }

    const GetServiceStatus = (serviceId) => {
        try{
            const state = stateManager.GetState(SERVICE_STATE_GROUP, serviceId)
            if (!state) {
                throw new Error(`Service with ID ${serviceId} does not exist`)
            }
            return state.status.description
        } catch(e) {
            console.log(e)
            return UNKNOWN.description
        }
    }

    const onRequestData = (onRequestData) => {
        eventEmitter.on(REQUEST_EVENT, async (requestData) => {
            
            const { requestType } = requestData

            switch (requestType) {
                case RequestTypes.INSTANCE_DATA_LIST:
                    stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                    const instanceDataList = await onRequestData(requestType, { serviceId: requestData.serviceId })
                    if(instanceDataList.length > 0)
                        instanceDataList
                            .forEach(({ id:instanceId , startupParams, ports, networkmode }) => 
                                _AddNewState(INSTANCE_STATE_GROUP, instanceId, {serviceId: requestData.serviceId, startupParams, ports, networkmode}, WAITING))
                    break
                case RequestTypes.IMAGE_BUILD_DATA_LIST:
                    const buildDataList = await onRequestData(requestType, { serviceId: requestData.serviceId })
                        buildDataList
                            .forEach(({ id:buildId , tag, hashId, instanceId }) => AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId}))
                    break
                case RequestTypes.SERVICE_DATA:
                    stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, LOADING)
                    const serviceData = await onRequestData(requestType, { serviceId: requestData.serviceId })

                    stateManager.UpdateData(SERVICE_STATE_GROUP, requestData.serviceId, { 
                        serviceName               : serviceData.serviceName,
                        serviceDescription        : serviceData.serviceDescription,
                        repositoryCodePath        : serviceData.instanceRepositoryCodePath,
                        originRepositoryNamespace : serviceData.originRepositoryNamespace,
                        originRepositoryCodePath  : serviceData.originRepositoryCodePath,
                        originPackagePath         : serviceData.originPackagePath,
                    })
                    stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, requestData.nextStatus)
                    if(requestData.nextStatus === UPDATED){
                        SwapRunningInstance(requestData.serviceId, requestData.instanceParams)
                    }
                    break
                case RequestTypes.CONTAINER_DATA:
                    stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                    const containerData = await onRequestData(requestType, { instanceId: requestData.instanceId })
                    if(containerData){
                        const { id:containerId, containerName  } = containerData
                        AddNewContainerState(containerId, { instanceId: requestData.instanceId, serviceId:requestData.serviceId, containerName  })
                    }
                    break
                case RequestTypes.CONTAINER_INSPECTION_DATA:
                    stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, LOADING)
                    const inspectionData = await onRequestData(requestType, { containerName: requestData.containerName })
                    _ReceiveInspectionData({ containerId: requestData.containerId, inspectionData })
                    break
                case RequestTypes.START_CONTAINER:
                case RequestTypes.STOP_CONTAINER:
                case RequestTypes.REMOVE_CONTAINER:
                    try{
                        await onRequestData(requestType, { containerHashId: requestData.containerHashId })
                    } catch(e){
                        console.log(e)
                        stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, FAILURE)
                    }
                    break
                case RequestTypes.CREATE_NEW_INSTANCE:
                    const newInstanceData = await onRequestData(requestType, requestData)
                    const { 
                        id:_instanceId,
                        startupParams,
                        storageParams,
                        socketParams,
                        ports,
                        networkmode
                    } = newInstanceData
                    _AddNewState(INSTANCE_STATE_GROUP, _instanceId, {
                        serviceId: requestData.serviceId, 
                        startupParams,
                        storageParams,
                        socketParams,
                        ports, 
                        networkmode
                    }, CREATING)
                    break
                case RequestTypes.CREATE_NEW_CONTAINER:
                    stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
                    const newContainerData = await onRequestData(requestType, requestData)
                    const { id:containerId, containerName  } = newContainerData
                    AddNewContainerState(containerId, {
                        instanceId: requestData.instanceId,
                        serviceId:requestData.serviceId,
                        containerName
                    })
                    stateManager.ChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, requestData.buildId, FINISHED)
                    break
                case RequestTypes.BUILD_NEW_IMAGE:
                    stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, STARTING)
                    const newImageBuildData = await onRequestData(requestType, requestData)
                    const {
                        id:buildId, tag, hashId, instanceId
                    } = newImageBuildData
                    AddNewBuildState(buildId, { tag, hashId, instanceId, serviceId:requestData.serviceId})
                    break
                case RequestTypes.MARK_AS_DECOMMISSIONED:
                    await onRequestData(requestType, { serviceId: requestData.serviceId })
                    stateManager.ChangeStatus(SERVICE_STATE_GROUP, requestData.serviceId, DECOMMISSIONED)
                    break
                case RequestTypes.REGISTER_STORAGES:
                    stateManager.ChangeStatus(INSTANCE_STATE_GROUP, requestData.instanceId, CREATED)
                default:
                    console.warn(`Unknown request type: ${requestType.description}`)
            }

        })
    }

    const onChangeServiceStatus = (f) => {
        stateManager.onChangeStatus(SERVICE_STATE_GROUP, ({ key: serviceId }) => f({serviceId, status: GetServiceStatus(serviceId)}))
    }

    const _ChangeContainerStatusByHash = (containerHashId, newStatus) => {
        const containerId = stateManager.FindKeyByPropertyData(CONTAINER_STATE_GROUP, "Id", containerHashId)
        if(containerId)
            stateManager.ChangeStatus(CONTAINER_STATE_GROUP, containerId, newStatus)
        else console.log(`the container with hashId ${containerId} is not in the state manager`)
    }
    
    const NotifyContainerActivity = ({ ID, Action, Attributes }) => {

        switch(Action) {
            case "start":
                _ChangeContainerStatusByHash(ID, STARTING)
                break
            case "kill":
                _ChangeContainerStatusByHash(ID, STOPPING)
                break
            case "stop":
                break
            case "die":
                _ChangeContainerStatusByHash(ID, STOPPED)
                break
            case "destroy":
                _ChangeContainerStatusByHash(ID, TERMINATED)
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

    const ListInstanceStateByStatus = (serviceId, status) => {
        const instanceList = ListInstancesState(serviceId)
        return instanceList.filter((state) => state.status === status)
    }

    const StartService = async (serviceId) => {

        const stoppedInstanceStateList = ListInstanceStateByStatus(serviceId, STOPPED)

        if(stoppedInstanceStateList.length > 0)
            stoppedInstanceStateList
                .forEach(({key:instanceId}) => {
                    const data = stateManager.FindData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
                    _RequestData(RequestTypes.START_CONTAINER, {
                        instanceId, 
                        containerHashId: data.Id
                    })
                })
        //else 
            //Criar nova instancia


    }

    const StopService = (serviceId) => {
        ListInstanceStateByStatus(serviceId, RUNNING)
        .forEach(({key:instanceId}) => {
            const data = stateManager.FindData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
            _RequestData(RequestTypes.STOP_CONTAINER, { 
                instanceId, 
                containerHashId: data.Id
            })
        })
    }

    const GetNetworksSettings  = async (serviceId) => {
        const containerStateList = stateManager.ListStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)

        const runningStateContainer = containerStateList.find(({status}) => status === RUNNING)

        const { data } = runningStateContainer

        if(data){
            const { NetworkSettings } = data
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

    const ListInstancesState = (serviceId) => stateManager.ListStatesByPropertyData(INSTANCE_STATE_GROUP, "serviceId", serviceId)

    const ListInstances = (serviceId) => {
        const instanceDataList = ListInstancesState(serviceId)
            .map(state => {
                const { key: instanceId, status, data } = state
                return { instanceId, status:status.description, ...data }
            })
        return instanceDataList
    }

    const ListRunningInstances = (serviceId) => {
        const instanceDataList = ListInstancesState(serviceId)
            .filter(({status}) => status === RUNNING)
            .map(state => {
                const { key: instanceId, status, data } = state
                return { instanceId, status:status.description, ...data }
            })
        return instanceDataList
    }

    const ListContainers = (serviceId) => {
        const stateList = stateManager.ListStatesByPropertyData(CONTAINER_STATE_GROUP, "serviceId", serviceId)
        const containerDataList = stateList.map(state => {
            const { key: containerId, status, data } = state
            return {containerId, status:status.description,...data}
        })
        return containerDataList
    }

    const ListImageBuildHistory = (serviceId) => {
        const stateList = stateManager.ListStatesByPropertyData(IMAGE_BUILD_HISTORY_STATE_GROUP, "serviceId", serviceId)
        const buildDataList = stateList.map(state => {
            const { key: buildId, status, data } = state
            return {buildId, status:status.description,...data}
        })
        return buildDataList
    }


    const SwapRunningInstance = (serviceId, params) => {
        stateManager.ChangeStatus(SERVICE_STATE_GROUP, serviceId, RESTARTING)
        const runningInstances = ListRunningInstances(serviceId)
        runningInstances.forEach(({ instanceId }) => {
            const containerStateList = stateManager.ListStatesByPropertyData(CONTAINER_STATE_GROUP, "instanceId", instanceId)
            containerStateList.forEach(({ data }) => {
                _RequestData(RequestTypes.STOP_CONTAINER, { 
                    instanceId, 
                    containerHashId: data.Id
                })
                stateManager.ChangeStatus(INSTANCE_STATE_GROUP, instanceId, TERMINATED)
            })

        })

        _RequestData(RequestTypes.CREATE_NEW_INSTANCE, {serviceId, ...params})
    }

    const onChangeContainerListData = (serviceId, f) => {
        stateManager.onChangeStatus(CONTAINER_STATE_GROUP, ({ key }) => {
            const { data } = stateManager.GetState(CONTAINER_STATE_GROUP, key)
            if(data.serviceId == serviceId){
                const containerList = ListContainers(serviceId)
                f(containerList)
            }
        })
    }

    const onChangeInstanceListData = (serviceId, f) => {
        stateManager.onChangeStatus(INSTANCE_STATE_GROUP, ({ key }) => {
            const { data } = stateManager.GetState(INSTANCE_STATE_GROUP, key)
            if(data.serviceId == serviceId){
                const instanceList = ListInstances(serviceId)
                f(instanceList)
            }
        })
    }

    const onChangeImageBuildHistoryListData = (serviceId, f) => {
        stateManager.onChangeStatus(IMAGE_BUILD_HISTORY_STATE_GROUP, ({ key }) => {
            const { data } = stateManager.GetState(IMAGE_BUILD_HISTORY_STATE_GROUP, key)
            if(data.serviceId == serviceId){
                const buildList = ListImageBuildHistory(serviceId)
                f(buildList)
            }
        })
    }
        
    return {
        LoadServiceInStateManagement,
        CreateServiceInStateManagement,
        UpdateServiceInStateManagement,
        TriggerDecommissioningProcess,
        ListRunningInstances,
        SwapRunningInstance,
        GetServiceStatus,
        onRequestData,
        onChangeServiceStatus,
        NotifyContainerActivity,
        StartService,
        StopService,
        GetNetworksSettings,
        ListInstances,
        ListContainers,
        ListImageBuildHistory,
        onChangeContainerListData,
        onChangeInstanceListData,
        onChangeImageBuildHistoryListData
    }
}

module.exports = CreateServiceRuntimeStateManager