const StatusTypes = Object.freeze({
    UNKNOWN        : Symbol("UNKNOWN"),
    INITIALIZING   : Symbol("INITIALIZING"),
    CREATING       : Symbol("CREATING"),
    CREATED        : Symbol("CREATED"),
    UPDATED        : Symbol("UPDATED"),
    UPDATING       : Symbol("UPDATING"),
    RESTARTING     : Symbol("RESTARTING"),
    WAITING        : Symbol("WAITING"),
    STARTING       : Symbol("STARTING"),
    STOPPING       : Symbol("STOPPING"),
    STOPPED        : Symbol("STOPPED"),
    RUNNING        : Symbol("RUNNING"),
    FAILURE        : Symbol("FAILURE"),
    FINISHED       : Symbol("FINISHED"),
    TERMINATED     : Symbol("TERMINATED"),
    DECOMMISSIONED : Symbol("DECOMMISSIONED")
})

module.exports = StatusTypes