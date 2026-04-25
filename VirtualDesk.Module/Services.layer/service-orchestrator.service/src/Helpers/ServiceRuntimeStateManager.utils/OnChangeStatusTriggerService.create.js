const CreateOnChangeStatusTriggerByService = (stateManager, { group, Function }) => 
        (serviceId, f) => {

            const { GetState, onChangeStatus } = stateManager

            onChangeStatus(group, ({ key }) => {
                const { data } = GetState(group, key)
                if(data.serviceId == serviceId)
                    f(Function(serviceId))
            })
        }

module.exports = CreateOnChangeStatusTriggerByService