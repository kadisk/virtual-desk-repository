const { Sequelize, DataTypes } = require("sequelize")

const InitializeIAMPersistentStoreManager = (storage) => {

    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage
    })

    const OrganizationModel = sequelize.define('Organization', {
        id: { 
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4 
        },
        name: { 
            type: DataTypes.STRING,
            allowNull: false 
        },
        status: { 
            type: DataTypes.ENUM('ACTIVE','SUSPENDED'),
            defaultValue: 'ACTIVE' 
        },
        createdAt: { 
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW 
        },
    })

    const AccountModel = sequelize.define('Account', {
        id: { 
            type: DataTypes.UUID, 
            primaryKey: true, 
            defaultValue: DataTypes.UUIDV4     
        },
        organizationId: { 
            type: DataTypes.UUID, 
            allowNull: false, 
            references: { model: 'organizations', key: 'id', deferrable: Deferrable.INITIALLY_IMMEDIATE } 
        },
        name: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        type: { 
            type: DataTypes.ENUM('STANDARD','BRANCH','TEAM','PROJECT'), 
            defaultValue: 'STANDARD' 
        },
        status: { 
            type: DataTypes.ENUM('ACTIVE','INACTIVE'), 
            defaultValue: 'ACTIVE' 
        },
        createdAt: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW 
        }
    })

    const UserModel = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordHash: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
            defaultValue: 'ACTIVE'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    })

    const ServiceIdentityModel = sequelize.define('ServiceIdentity', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
            defaultValue: 'ACTIVE'
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
    })

    const DeviceModel = sequelize.define("Device", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        accountId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: "accounts", key: "id" }
        },
        ownerUserId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "users", key: "id" }
        },
        ownerServiceIdentityId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: "service_identities", key: "id" }
        },
        type: {
            type: DataTypes.ENUM("phone", "tablet", "desktop", "server", "raspberry", "esp32", "arduino", "iot", "unknown"),
            allowNull: false
        },
        model: {
            type: DataTypes.STRING,
            allowNull: true
        },
        os: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("active", "inactive", "blocked"),
            defaultValue: "active"
        },
        publicKey: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    })
    

    return {
        models: {
            Organization: OrganizationModel,
            Account: AccountModel,
            User: UserModel,
            ServiceIdentity: ServiceIdentityModel,
            Device: DeviceModel
        },
        ConnectAndSync: async () => {
            await sequelize.authenticate()
            await sequelize.sync()
            //await sequelize.sync({ force: true }) 
        }
    }
}

module.exports = InitializeIAMPersistentStoreManager