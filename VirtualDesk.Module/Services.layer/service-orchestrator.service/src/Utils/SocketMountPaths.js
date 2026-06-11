const SOCKET_MOUNT_BASE_PATH = "/mnt/sockets"
const SOCKET_FILE_NAME = "socket.sock"

const BuildSocketVolumeTarget = (namespace) => `${SOCKET_MOUNT_BASE_PATH}/${namespace}`

const BuildSocketPath = (namespace) => `${BuildSocketVolumeTarget(namespace)}/${SOCKET_FILE_NAME}`

module.exports = {
    SOCKET_MOUNT_BASE_PATH,
    SOCKET_FILE_NAME,
    BuildSocketVolumeTarget,
    BuildSocketPath
}
