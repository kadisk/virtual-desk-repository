const HOST_MOUNT_BASE_PATH = "/mnt/host-mounts"

const BuildHostMountTarget = (namespace) => `${HOST_MOUNT_BASE_PATH}/${namespace}`

module.exports = {
    HOST_MOUNT_BASE_PATH,
    BuildHostMountTarget
}
