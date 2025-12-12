import UserAction from "../Actions/User.actions"

type UserState = {
    userData: any
}

const initialState:UserState = {
    userData: null,
}

const UserReducer = (state = initialState, action:any) => {
    switch (action.type) {
        case UserAction.SetUserData:
            return {
                ...state,
                userData: action.userData
            }
        default:
            return state
    }
}

export default UserReducer
