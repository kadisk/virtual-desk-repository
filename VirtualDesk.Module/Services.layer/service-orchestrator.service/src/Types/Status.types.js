const StatusTypes = Object.freeze({
    UNKNOWN        : Symbol("UNKNOWN"),

    CREATE         : Symbol("CREATE"),
    HYDRATE_DATA   : Symbol("HYDRATE_DATA"),
    INITIATE       : Symbol("INITIATE"),

    INITIALIZING   : Symbol("INITIALIZING"),
    CREATING       : Symbol("CREATING"),
    RESTARTING     : Symbol("RESTARTING"),
    UPDATING       : Symbol("UPDATING"),
    WAITING        : Symbol("WAITING"),
    STARTING       : Symbol("STARTING"),
    STOPPING       : Symbol("STOPPING"),
    RUNNING        : Symbol("RUNNING"),
    HYDRATING_DATA : Symbol("HYDRATING_DATA"),

    CREATED         : Symbol("CREATED"),
    UPDATED         : Symbol("UPDATED"),
    STOPPED         : Symbol("STOPPED"),
    FAILURE         : Symbol("FAILURE"),
    FINISHED        : Symbol("FINISHED"),
    TERMINATED      : Symbol("TERMINATED"),
    DESTROYED       : Symbol("DESTROYED"),
    DECOMMISSIONED  : Symbol("DECOMMISSIONED"),
    READY           : Symbol("READY"),
    DATA_HYDRATED   : Symbol("DATA_HYDRATED"),
})

module.exports = StatusTypes