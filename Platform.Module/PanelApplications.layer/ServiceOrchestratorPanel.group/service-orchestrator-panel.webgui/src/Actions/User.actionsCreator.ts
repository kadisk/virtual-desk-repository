import UserAction from "./User.actions"

export default {
    SetUserData : (userData:any) => ({type: UserAction.SetUserData, userData})
}
