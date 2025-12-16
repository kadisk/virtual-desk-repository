import UserAction from "../Actions/User.actions"

const INITIAL_STATE = {}

const UserReducer = (state = INITIAL_STATE, action:any) => {
    switch (action.type) {
        case UserAction.SetUserData:
            return action.userData
        default:
            return state
    }
}

export default UserReducer
