
const RequestTypes = Object.freeze({
    INSTANCE_DATA_LIST        : Symbol(),
    IMAGE_BUILD_DATA_LIST     : Symbol(),
    REGISTER_STORAGES         : Symbol(),
    CREATE_NEW_INSTANCE       : Symbol(),
    CREATE_NEW_CONTAINER      : Symbol(),
    BUILD_NEW_IMAGE           : Symbol(),
    CONTAINER_DATA            : Symbol(),
    CONTAINER_INSPECTION_DATA : Symbol(),
    START_CONTAINER           : Symbol(),
    STOP_CONTAINER            : Symbol(),
    REMOVE_CONTAINER          : Symbol(),
    MARK_AS_DECOMMISSIONED    : Symbol()
})

module.exports = RequestTypes