const Docker = require('dockerode')
const EventEmitter = require('node:events')

const DOCKER_EVENT = Symbol('dockerEvent')

const NormalizedLabels = (labels) => {
    return Object.fromEntries(
        Object.entries(labels).map(([key, value]) => [ key, value == null ? "" : String(value) ])
    )
}


const ContainerManager = (params) => {

    
    const eventEmitter = new EventEmitter()
    
    const {
        onReady,
        socketPath
    } = params
    
    const docker = new Docker({ socketPath })

    const _Start = async () => {

        docker.getEvents({}, (err, stream) => {
            
            if (err) {
                console.error(err)
                return
            }

            stream.on('data', (chunk) => {
                try {
                    const eventData = JSON.parse(chunk.toString())
                    eventEmitter.emit(DOCKER_EVENT, eventData)
                } catch (parseErr) {
                   console.error(parseErr)
                }
            })

            stream.on('error', (err) => {
               console.error(err)
            })

            stream.on('end', () => {
                console.log('Event stream closed.')
            })
        })

        onReady()
    }

    _Start()

    const ListAllContainers = async () => {
        try {
            const containers = await docker.listContainers({ all: true })
            return containers
        } catch (error) {
            console.error('Error listing containers with details:', error)
            throw error
        }

    }

    const ListAllImages = async () => {
        try {
            const images = await docker.listImages()
            return images
        }
        catch (error) {
            console.error('Error listing images:', error)
            throw error
        }

    }

    const ListAllNetworks = async () => {
        try {
            const networks = await docker.listNetworks()
            return networks
        }
        catch (error) {
            console.error('Error listing networks:', error)
            throw error
        }

    }

    const BuildImageFromDockerfileString = async ({
        buildargs,
        contextTarStream, imageTagName, onData
    }) => {
        return new Promise((resolve, reject) => {
            
            docker.buildImage(contextTarStream, { t: imageTagName, buildargs }, (err, stream) => {
                if (err) return reject(err)
                stream.on('data', onData)
                stream.on('end', async () => {
                    try {
                        const image = docker.getImage(imageTagName)
                        const imageInfo = await image.inspect()
                        resolve(imageInfo)
                    } catch (inspectErr) {
                        reject(inspectErr)
                    }
                })
                stream.on('error', reject)
            })
        })
    }

    const CreateNewContainer = async ({
        imageName,
        containerName,
        ports = [],
        networkmode,
        mounts = []
    }) => {

        const portBindings = {}
        const exposedPorts = {}

        ports.forEach(({ containerPort, hostPort }) => {
            const containerPortKey = `${containerPort}/tcp`
            exposedPorts[containerPortKey] = {}
            portBindings[containerPortKey] = [
                {
                    HostPort: hostPort.toString()
                }
            ]
        })

        const volumeMounts = mounts
            .filter(({ volumeName, target }) => volumeName && target)
            .map(({ volumeName, target }) => ({
                Type   : "volume",
                Source : volumeName,
                Target : target
            }))

        // Bind mounts: monta um caminho EXTERNO do host (dir ou arquivo) direto no container.
        const bindMounts = mounts
            .filter(({ hostPath, target }) => hostPath && target)
            .map(({ hostPath, target }) => ({
                Type   : "bind",
                Source : hostPath,
                Target : target,
                BindOptions: { CreateMountpoint: true }
            }))

        // O container roda com o UID/GID do host (via Dockerfile). Aqui adicionamos também os
        // grupos suplementares do processo do host (ex.: grupo "docker") para que bind mounts de
        // recursos group-owned do host (como /var/run/docker.sock) sejam acessíveis sem EACCES.
        const groupAdd = typeof process.getgroups === "function"
            ? process.getgroups().map(String)
            : []

        const container = await docker.createContainer({
            Image: imageName,
            name: containerName,
            ExposedPorts: exposedPorts,
            HostConfig: {
                PortBindings: portBindings,
                NetworkMode: networkmode,
                Mounts: [...volumeMounts, ...bindMounts],
                GroupAdd: groupAdd
            }
        })

        const containerInfo = await container.inspect()
        return containerInfo
    }

    const RemoveContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            await container.remove({ 
                force: false, 
                v: false 
            })
            return { success: true, message: `Container ${containerIdOrName} removed successfully` }
        } catch (error) {
            console.error(`Error removing container ${containerIdOrName}:`, error)
            throw error
        }
    }

    const StartContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            await container.start()
            return { success: true, message: `Container ${containerIdOrName} started successfully` }
        } catch (error) {
            console.error(`Error starting container ${containerIdOrName}:`, error)
            throw error
        }
    }
    
    const StopContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            await container.stop()
            return { success: true, message: `Container ${containerIdOrName} stopped successfully` }
        } catch (error) {
            console.error(`Error stopping container ${containerIdOrName}:`, error)
            throw error
        }
    }

    const InspectContainer = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            const containerInfo = await container.inspect()
            return containerInfo
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const GetContainerLogHistory = async (containerIdOrName) => {
        try {
            const container = docker.getContainer(containerIdOrName)
            const logBuffer = await container.logs({
                stdout: true,
                stderr: true,
                follow: false,
                tail: "all"
            })
            // If docker returned a Buffer it may contain multiplexed headers when
            // the container was not started with a TTY. Those headers are 8-byte
            // frames: [streamType(1)][0][0][0][length(4-be)]...payload...
            // Parse and strip them so the output keeps ANSI sequences (colors)
            // and line breaks intact for TTY display.
            if (Buffer.isBuffer(logBuffer)) {
                const buf = logBuffer
                // quick detection: first byte 0x01 or 0x02 and next three bytes 0x00
                if (buf.length >= 8 && (buf[0] === 1 || buf[0] === 2) && buf[1] === 0 && buf[2] === 0 && buf[3] === 0) {
                    let idx = 0
                    const outChunks = []
                    while (idx + 8 <= buf.length) {
                        const streamType = buf[idx]
                        const payloadLen = buf.readUInt32BE(idx + 4)
                        const start = idx + 8
                        const end = start + payloadLen
                        if (end > buf.length) {
                            // malformed/truncated frame: push remainder and break
                            outChunks.push(buf.slice(start))
                            break
                        }
                        const payload = buf.slice(start, end)
                        outChunks.push(payload)
                        idx = end
                    }
                    try {
                        // return as base64 so transport (JSON) doesn't escape ANSI bytes
                        return { isBase64: true, data: Buffer.concat(outChunks).toString('base64') }
                    } catch (e) {
                        return { isBase64: true, data: Buffer.concat(outChunks).toString('base64') }
                    }
                }
                // not multiplexed - return UTF-8 string
                try {
                    return { isBase64: true, data: buf.toString('base64') }
                } catch (e) {
                    return { isBase64: true, data: buf.toString('base64') }
                }
            }

            // if not a Buffer, stringify and return as plain text
            if (typeof logBuffer === 'string') {
                return { isBase64: false, data: logBuffer }
            }

            return { isBase64: false, data: String(logBuffer) }
        } catch (error) {
            console.error(`Error getting logs for container ${containerIdOrName}:`, error)
            throw error 
        }
    }


    const ListAllVolumes = async () => {
        try {
            const volumes = await docker.listVolumes()
            return volumes
        }
        catch (error) {
            console.error('Error listing volumes:', error)
            throw error
        }


    }

    const RegisterDockerEventListener = (f) => 
        eventEmitter.on(DOCKER_EVENT, (eventData) => f(eventData))

    const InspectNetwork = async (networkIdOrName) => {
        try {
            const network = docker.getNetwork(networkIdOrName)
            const networkInfo = await network.inspect()
            return networkInfo
        }
        catch (error) {
            console.error(`Error inspecting network ${networkIdOrName}:`, error)
            throw error
        }
    }

    const CreateNewNetwork = async (options) => {
        try {
            const network = await docker.createNetwork(options)
            return network
        }
        catch (error) {
            console.error(`Error creating network ${options.Name || 'unknown'}:`, error)
            throw error
        }
    }

    const InspectVolume = async (volumeName) => {
        try {
            const volume = docker.getVolume(volumeName)
            const volumeInfo = await volume.inspect()
            return volumeInfo
        }
        catch (error) {
            console.error(`Error inspecting volume ${volumeName}:`, error)
            throw error
        }
    }

    const CreateNewVolume = async ({
        volumeName,
        driver = 'local',
        driverOpts = {},
        labels = {}
    }) => {
        try {
            const volume = await docker.createVolume({
                Name: volumeName,
                Driver: driver,
                DriverOpts: driverOpts,
                Labels: NormalizedLabels(labels)
            })
            return volume
        } catch (error) {
            console.error(`Error creating volume ${volumeName}:`, error)
            throw error
        }
    }

    const InspectImage = async (imageIdOrName) => {
        try {
            const image = docker.getImage(imageIdOrName)
            const imageInfo = await image.inspect()
            return imageInfo
        } catch (error) {
            console.error(`Error inspecting image ${imageIdOrName}:`, error)
            throw error
        }
    }

    return {
        StartContainer,
        StopContainer,
        RemoveContainer,
        ListAllContainers,
        ListAllVolumes,
        BuildImageFromDockerfileString,
        CreateNewContainer,
        InspectContainer,
        ListAllImages,
        ListAllNetworks,
        RegisterDockerEventListener,
        GetContainerLogHistory,
        InspectNetwork,
        CreateNewNetwork,
        InspectVolume,
        CreateNewVolume,
        InspectImage
    }

}

module.exports = ContainerManager