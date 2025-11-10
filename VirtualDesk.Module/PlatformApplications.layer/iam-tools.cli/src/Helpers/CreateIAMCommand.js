const CreateIAMCommand = ({
    CommandExecutor,
    iamManagerSocketPath,
    iamManagerServerManagerUrl
}) => async (CommandFunction) => {
        const APICommandFunction = async ({ APIs }) => {
            const API = APIs
            .IAMAppInstance
            .IdentityManagement
            return await CommandFunction(API)
        }

        return await CommandExecutor({
            serverResourceEndpointPath: iamManagerServerManagerUrl,
            mainApplicationSocketPath: iamManagerSocketPath,
            CommandFunction: APICommandFunction
        })
    }

module.exports = CreateIAMCommand

