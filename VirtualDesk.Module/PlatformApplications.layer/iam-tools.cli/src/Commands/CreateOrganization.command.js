
const MountIAMCommand = require('../Helpers/MountIAMCommand')


const CreateOrganizationCommand = async ({ args, startupParams, params }) => {

    const { name } = args
    const IAMCommand = MountIAMCommand({ startupParams, params })
    const organization = await IAMCommand((API) => API.ListInstances({ name }))
    console.log(JSON.stringify(organization, null, 2))
    
}

module.exports = CreateOrganizationCommand
