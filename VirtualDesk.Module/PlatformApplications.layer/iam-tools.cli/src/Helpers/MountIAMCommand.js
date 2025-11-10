
const CreateIAMCommand = require('./CreateIAMCommand')

const MountIAMCommand = ({ startupParams, params }) =>  {

    const {
        iamManagerSocketPath,
        iamManagerServerManagerUrl
    } = startupParams

    const {
        commandExecutorLib
    } = params

    const CommandExecutor = commandExecutorLib.require("CommandExecutor")

    return CreateIAMCommand({
        CommandExecutor,
        iamManagerSocketPath,
        iamManagerServerManagerUrl
    })
}

module.exports = MountIAMCommand
