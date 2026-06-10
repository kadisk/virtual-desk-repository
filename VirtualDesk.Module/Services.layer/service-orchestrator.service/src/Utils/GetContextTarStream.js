const { join } = require("path")

const tarStream = require('tar-stream')
const fs = require('fs')

const CONTAINER_USERNAME = "myecosystem"

const GetDockerfileContent = (storageVolumeTargets = []) => {
    const dockerfileContent = fs.readFileSync(join(__dirname, "Dockerfile"), {encoding:'utf8'})

    if (storageVolumeTargets.length === 0) {
        return dockerfileContent
    }

    const targets = storageVolumeTargets.join(" ")
    const prepareVolumesInstruction =
        `RUN sudo mkdir -p ${targets} \\\n    && sudo chown -R ${CONTAINER_USERNAME}:${CONTAINER_USERNAME} ${targets}\n\n`

    return dockerfileContent.replace(/\nCMD /, `\n${prepareVolumesInstruction}CMD `)
}

const GetContextTarStream = ({
        repositoryPathForCopy,
        packagePathForCopy,
        startupParams,
        storageVolumeTargets = []
    }) => {
        const contextTarStream = tarStream.pack()


        contextTarStream.entry({ name: 'Dockerfile' }, GetDockerfileContent(storageVolumeTargets))

        if (startupParams) {
            contextTarStream.entry({ 
                name: 'context_data/startup-params.json' 
            }, JSON.stringify(startupParams, null, 4))
        }

        const _addFiles = (dirPath, basePath = '') => {
            const items = fs.readdirSync(dirPath)
            for (const item of items) {
                if (item === 'node_modules' || item === '.git') continue
    
                const fullPath = join(dirPath, item)
                const entryPath = join(basePath, item)
                const stats = fs.statSync(fullPath)
    
                if (stats.isDirectory()) {
                    _addFiles(fullPath, join(basePath, item))
                } else if (stats.isFile()) {
                    const content = fs.readFileSync(fullPath)
                    contextTarStream.entry({ name: entryPath }, content)
                }
            }
        }
       
        _addFiles(repositoryPathForCopy, 'context_data/repository')
        _addFiles(packagePathForCopy, 'context_data/package')

        contextTarStream.finalize()
        return contextTarStream
    }


module.exports = GetContextTarStream