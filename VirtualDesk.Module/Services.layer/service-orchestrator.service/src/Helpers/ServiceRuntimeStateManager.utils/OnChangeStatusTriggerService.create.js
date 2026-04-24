const CreateOnChangeStatusTriggerByService = (stateManager, { group, Function }) => 
        (serviceId, f) => {
            stateManager.onChangeStatus(group, ({ key }) => {
                const { data } = stateManager.GetState(group, key)
                if(data.serviceId == serviceId)
                    f(Function(serviceId))
            })
        }

module.exports = CreateOnChangeStatusTriggerByService