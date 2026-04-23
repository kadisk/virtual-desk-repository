const ItemGroupTypes = Object.freeze({
    SERVICE_STATE_GROUP             : Symbol("SERVICE_STATE_GROUP"),
    INSTANCE_STATE_GROUP            : Symbol("INSTANCE_STATE_GROUP"),
    CONTAINER_STATE_GROUP           : Symbol("CONTAINER_STATE_GROUP"),
    IMAGE_BUILD_HISTORY_STATE_GROUP : Symbol("IMAGE_BUILD_HISTORY_STATE_GROUP")
})

module.exports = ItemGroupTypes