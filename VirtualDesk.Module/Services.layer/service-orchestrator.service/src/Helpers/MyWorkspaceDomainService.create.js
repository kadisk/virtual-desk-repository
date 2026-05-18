const CreateMyWorkspaceDomainService = ({
    ServiceModel,
    ImageBuildHistoryModel,
    InstanceModel,
    ContainerModel,
    ContainerEventLogModel,
    SocketModel,
    StorageModel
}) => {

    const ListServices = async () => {
        const items = await ServiceModel.findAll({
            where: {
                isDecommissioned: false
            }
        })
        return items
    }
    
    const ListProvisionedServices = async () => {
        const items = await ServiceModel.findAll({
            where: {
                isDecommissioned: false
            },
            include: [
                {
                    model: InstanceModel,
                    include: [{
                        model: ImageBuildHistoryModel,
                    }]
                }
            ],
            distinct: true 
        })
        return items
    }

    const ListAllServiceId = async () => {
        const items = await ServiceModel.findAll({
            where: {
                isDecommissioned: false
            }
        })
        return items?.map( item => item.id )
    }

    const GetServiceById = async (serviceId) => 
        await ServiceModel.findOne({
            where: {
                id: serviceId
            },
            raw: true
        })

    const RegisterServiceProvisioning = ({ 
        serviceName,
        serviceDescription,
        instanceRepositoryCodePath,
        originRepositoryNamespace,
        originRepositoryCodePath,
        originPackagePath
    }) => 
        ServiceModel
            .create({ 
                serviceName,
                serviceDescription,
                instanceRepositoryCodePath,
                originRepositoryNamespace,
                originRepositoryCodePath,
                originPackagePath
            })
    
    const UpdateServiceProvisioning = async ({
        serviceId,
        serviceName,
        serviceDescription,
        originRepositoryNamespace,
        originRepositoryCodePath,
        originPackagePath
    }) => 
        ServiceModel
            .update({ 
                serviceName,
                serviceDescription,
                originRepositoryNamespace,
                originRepositoryCodePath,
                originPackagePath
            }, {
                where: { id: serviceId }
            })

    const MarkAsDecommissioned = async (serviceId) => {
        const service = await ServiceModel.findOne({
            where: { id: serviceId }
        })

        if (!service) {
            throw new Error(`Service with ID ${serviceId} does not exist`)
        }

        if (service.isDecommissioned) {
            throw new Error(`Service with ID ${serviceId} is already decommissioned`)
        }

        return service.update({
            isDecommissioned: true,
            decommissionedAt: new Date()
        })
    }

    const UpdateHashIdImage = async (buildId, hashId) => {

        await ImageBuildHistoryModel.update(
            {
                hashId
            },
            {
                where: {
                    id: buildId
                }
            }
        )

        const updatedRow = await ImageBuildHistoryModel.findByPk(buildId)

        return updatedRow
    }

    /*const RegisterBuildedImage = ({
        instanceId,
        tag,
        hashId
    }) => ImageBuildHistoryModel
            .create({ 
                instanceId,
                tag,
                hashId,
            })*/

    const RegisterBuildNewImage = ({ instanceId, tag }) => ImageBuildHistoryModel.create({ instanceId, tag })   

    const RegisterContainer = ({
            containerName,
            instanceId,
            buildId
        }) => ContainerModel
        .create({
            containerName,
            instanceId,
            buildId
        })

    const RegisterInstanceCreation = ({ serviceId, startupParams, storageParams, socketParams, ports, networkmode}) => 
            InstanceModel.create({ serviceId, startupParams, storageParams, socketParams, ports, networkmode })

    const RegisterTerminateInstance = async (instanceId) => 
        InstanceModel.update({ terminateDate: new Date() },{ where: { id: instanceId } })

    const ListImageBuildHistoryByServiceId = async (serviceId) => {
        const items = await ImageBuildHistoryModel.findAll({
            include: [{
                model: InstanceModel,
                where: { serviceId },
                attributes: []
            }]
        })
        return items.map(item => item.get({ plain: true }))
    }
    
    const ListInstancesByServiceId = async (serviceId) => {
        const items = await InstanceModel.findAll({
            where: {
                serviceId
            }
        })

        return items.map(item => item.get({ plain: true }))
    }

    const ListContainersByServiceId = async (serviceId) => {
        const items = await ContainerModel.findAll({
            include: [{
                model: InstanceModel,
                where: { serviceId },
                attributes: [] // Não traz os dados da instância, só filtra
            }]
        })
        return items.map(item => item.get({ plain: true }))
    }

    const ListActiveInstancesByServiceId = async (serviceId) => {
        const items = await InstanceModel.findAll({
            where: {
                serviceId,
                terminateDate: null
            }
        })

        return items.map(item => item.get({ plain: true }))
    }

    const GetContainerInfoByInstanceId = async (instanceId) => {
        const containerData = await ContainerModel
            .findOne({ where: { instanceId } })
        return containerData ? containerData.get({ plain: true }) : null
    }

    const GetLastInstanceByServiceId = async (serviceId) => {
        const instance = await InstanceModel.findOne({
            where: { 
                serviceId,
                terminateDate: null
            },
            order: [['createdAt', 'DESC']]
        })
        return instance ? instance.get({ plain: true }) : null
    }

    /*const RegisterStorages = async ({
        serviceId,
        storageList
    }) => {

        const storages = await StorageModel
            .bulkCreate(
                storageList.map(({ namespace, filename }) => ({
                    serviceId,
                    namespace,
                    filename
                }))
            )

        return storages.map(item => item.get({ plain: true }))
    }*/

    return {
        RegisterServiceProvisioning,
        UpdateServiceProvisioning,
        RegisterInstanceCreation,
        RegisterTerminateInstance,
        UpdateHashIdImage,
        //RegisterBuildedImage,
        RegisterBuildNewImage,
        ListAllServiceId,
        ListServices,
        ListProvisionedServices,
        GetServiceById,
        ListImageBuildHistoryByServiceId,
        ListInstancesByServiceId,
        ListContainersByServiceId,
        ListActiveInstancesByServiceId,
        GetLastInstanceByServiceId,
        GetContainerInfoByInstanceId,
        RegisterContainer,
        MarkAsDecommissioned,
        //RegisterStorages
    }
}

module.exports = CreateMyWorkspaceDomainService