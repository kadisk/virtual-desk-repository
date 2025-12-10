const UserSpaceController = (params) =>{

    const ListMyApps = ({ authenticationData }) => {
        const { userId, username } = authenticationData
    }

    const controllerServiceObject = {
        controllerName   : "UserSpaceController",
        ListMyApps
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = UserSpaceController