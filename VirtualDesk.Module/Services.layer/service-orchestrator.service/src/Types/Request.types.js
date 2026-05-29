
const RequestTypes = Object.freeze({
    FETCH_SERVICE_DATA              : Symbol("FETCH_SERVICE_DATA"),
    FETCH_INSTANCE_DATA_LIST        : Symbol("FETCH_INSTANCE_DATA_LIST"),
    FETCH_IMAGE_BUILD_DATA_LIST     : Symbol("FETCH_IMAGE_BUILD_DATA_LIST"),
    REGISTER_STORAGE                : Symbol("REGISTER_STORAGE"),
    CREATE_NEW_VOLUME               : Symbol("CREATE_NEW_VOLUME"),
    CREATE_NEW_INSTANCE             : Symbol("CREATE_NEW_INSTANCE"),
    REGISTER_NEW_CONTAINER          : Symbol("REGISTER_NEW_CONTAINER"),
    CREATE_NEW_CONTAINER            : Symbol("CREATE_NEW_CONTAINER"),
    REGISTER_BUILD_NEW_IMAGE        : Symbol("REGISTER_BUILD_NEW_IMAGE"),
    BUILD_NEW_IMAGE                 : Symbol("BUILD_NEW_IMAGE"),
    FETCH_CONTAINER_DATA            : Symbol("FETCH_CONTAINER_DATA"),
    FETCH_CONTAINER_INSPECTION_DATA : Symbol("FETCH_CONTAINER_INSPECTION_DATA"),
    START_CONTAINER                 : Symbol("START_CONTAINER"),
    STOP_CONTAINER                  : Symbol("STOP_CONTAINER"),
    REMOVE_CONTAINER                : Symbol("REMOVE_CONTAINER"),
    MARK_AS_DECOMMISSIONED          : Symbol("MARK_AS_DECOMMISSIONED")
})

module.exports = RequestTypes