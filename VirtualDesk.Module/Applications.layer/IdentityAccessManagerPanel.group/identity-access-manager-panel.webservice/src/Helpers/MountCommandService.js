
const MountCommandService = ({ 
        serverManagerUrl,
        socketPath, 
        commandExecutorLib,
        ExtractAPI
    }) =>  {

    const CommandExecutor = commandExecutorLib.require("CommandExecutor")
    return (CommandFunction) => 
        CommandExecutor({
            serverResourceEndpointPath: serverManagerUrl,
            mainApplicationSocketPath: socketPath,
            CommandFunction: ({ APIs }) => CommandFunction(ExtractAPI(APIs))
        })
    
}

module.exports = MountCommandService
