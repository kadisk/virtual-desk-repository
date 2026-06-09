const EventEmitter = require("events")

const GetValueByPath = (data, property) => {
    if (!data) return undefined

    if (!Array.isArray(property)) {
        return data[property]
    }

    return property.reduce((current, key) => {
        if (current == null) return undefined
        return current[key]
    }, data)
}

const CreateStateManager = () => {

    const eventEmitter = new EventEmitter()

    const STATUS_CHANGE_EVENT = Symbol()

    const stateList = []

    const AddNewState = (group, key, defaultStatus) => {
        const newState = {
            group,
            key,
            status        : defaultStatus,
            statusHistory : defaultStatus ? [
                {
                    previous  : null,
                    current   : defaultStatus,
                    changedAt : new Date()
                }
            ] : [],
            data          : {},
            error         : undefined
        }
        stateList.push(newState)
    }

    const GetState = (group, key) => {
        const state = stateList.find(s => s.group === group && s.key == key)
        return state
    }

    const FindState = (group, property, value) => {
        const state = stateList.find(s => s.group === group && s.data[property] == value)
        return state
    }

    const FindData = (group, property, value) => {
        const state = FindState(group, property, value)

        if (state?.data) {
            return state.data
        }
    }

    const TakeDataProperty = (group, key, property) => {
        const state = GetState(group, key)
        
        if (!state?.data || !(property in state.data)) {
            return undefined
        }
        
        const { [property]: removed, ...remaining } = state.data
        state.data = remaining
        return removed
    }

    const ChangeStatus = (group, key, newStatus) => {
        const state = GetState(group, key)
        
        if (!state) throw new Error(`State with group ${group.description} and key ${key} does not exist`)
        
        if (state.status === newStatus) return

        const oldStatus = state.status

        state.status = newStatus

        state.statusHistory.unshift({
            previous  : oldStatus,
            current   : newStatus,
            changedAt : new Date()
        })

        eventEmitter.emit(STATUS_CHANGE_EVENT, {group, key})
    }

    const onChangeStatus = (_group, f) => {
        eventEmitter.on(STATUS_CHANGE_EVENT, ({group, key}) => {

            if (group !== _group) return
            f({ key, status: GetState(group, key).status })
        })
    }

    const SetData = (group, key, data) => {
        const state = GetState(group, key)
        state.data = data
    }

    const UpdateData = (group, key, data) => {
        const state = GetState(group, key)
        state.data = { ...state.data, ...data }
    }

    const SetDataProperty = (group, key, property, value) => {
        const state = GetState(group, key)
        if (!state) return
        state.data[property] = value
    }

    const FindKeyByPropertyData = (group, property, value) => {
        const state = ListStates(group)?.find(s => {
            return GetValueByPath(s.data, property) == value
        })

        if (!state) {
            return null
        }

        return state.key
    }

    const FindKeyByPropertiesData = (group, criteria) => {
        if (!Array.isArray(criteria) || criteria.length === 0) {
            return null
        }

        const state = ListStates(group)?.find(s => {
            return criteria.every(({ property, value }) => {
                return GetValueByPath(s.data, property) == value
            })
        })

        if (!state) {
            return null
        }

        return state.key
    }

    const ListStates = (group) => {
        return stateList.filter(s => s.group === group)
    }

    const FilterStatesByPropertyData = (group, property, value) => {
        const stateList = ListStates(group)

        return stateList.filter(s => {
            return GetValueByPath(s.data, property) == value
        })
    }

    const GetDataByKey = (group, key) => {
        const state = GetState(group, key)
        if (!state) {
            return undefined
        }
        return state.data
    }

    const GetStatusHistory = (group, key) => {
        const state = GetState(group, key)

        if (!state) {
            return []
        }

        return state.statusHistory
    }

    const GetPreviousStatus = (group, key) => {
        const state = GetState(group, key)

        if (!state?.statusHistory?.length) {
            return undefined
        }

        const lastHistory = state.statusHistory[state.statusHistory.length - 1]

        return lastHistory.previous
    }

    const HasExecutedStatusSequence = (group, key, statusSequence) => {
        const state = GetState(group, key)

        if (!state?.statusHistory?.length) {
            return false
        }

        if (!Array.isArray(statusSequence) || statusSequence.length === 0) {
            return false
        }

        const historyStatuses = state.statusHistory.map(history => history.current)

        for (let i = 0; i <= historyStatuses.length - statusSequence.length; i++) {
            const sequenceMatches = statusSequence.every((status, index) => {
                return historyStatuses[i + index] === status
            })

            if (sequenceMatches) {
                return true
            }
        }

        return false
    }

    return {
        AddNewState,
        ChangeStatus,
        GetStatusHistory,
        GetPreviousStatus,
        GetState,
        ListStates,
        FilterStatesByPropertyData,
        FindData,
        GetDataByKey,
        onChangeStatus,
        SetData,
        UpdateData,
        SetDataProperty,
        FindKeyByPropertyData,
        FindKeyByPropertiesData,
        TakeDataProperty,
        HasExecutedStatusSequence
    }
}

module.exports = CreateStateManager