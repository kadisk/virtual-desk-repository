import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import ContainerTable from "./Container.table"
import ImagesTable from "./Images.table"
import NetworksTable from "./Networks.table"
import VolumesTable from "./Volumes.table"

import ContainerLogHistoryOffcanvas from "./ContainerLogHistory.offcanvas"

const CONTAINERS_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-box"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /></svg>
const IMAGES_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stack-3"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l-8 4l8 4l8 -4l-8 -4" /><path d="M4 10l8 4l8 -4" /><path d="M4 18l8 4l8 -4" /><path d="M4 14l8 4l8 -4" /></svg>
const NETWORKS_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-network"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" /><path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" /><path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" /><path d="M6 9h12" /><path d="M3 20h7" /><path d="M14 20h7" /><path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 15v3" /></svg>
const VOLUME_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-database"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0" /><path d="M4 6v6a8 3 0 0 0 16 0v-6" /><path d="M4 12v6a8 3 0 0 0 16 0v-6" /></svg>

const CONTAINERS_MANAGER_MODE = Symbol()
const IMAGES_MANAGER_MODE = Symbol()
const NETWORKS_MANAGER_MODE = Symbol()
const VOLUMES_MANAGER_MODE = Symbol()

const ContainerManager = ({ HTTPServerManager }) => {

    const [ containers, setContainers ] = useState<any[]>([])
    const [ images, setImages ]         = useState<any[]>([])
    const [ networks, setNetworks ]     = useState<any[]>([])
    const [ volumes, setVolumes ]       = useState<any[]>([])


    const [containerIdLogsSelected, setContainerIdLogsSelected] = useState<string>()

    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<any>(CONTAINERS_MANAGER_MODE)

    useEffect(() => {
        if (mode === CONTAINERS_MANAGER_MODE) {
            fetchContainers()
        } else if (mode === IMAGES_MANAGER_MODE) {
            fetchImages()
        } else if (mode === NETWORKS_MANAGER_MODE) {
            fetchNetworks()
        } else if (mode === VOLUMES_MANAGER_MODE) {
            fetchVolumes()
        }
    }, [mode])

    const getContainerManagerAPI = () =>
        GetAPI({
            apiName: "ContainerManager",
            serverManagerInformation: HTTPServerManager,
        })

    const fetchContainers = async () => {
        setLoading(true)
        setContainers([])
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListContainers()
            setContainers(response.data)
        } catch (error) {
            console.error("Error fetching containers:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchVolumes = async () => {
        setLoading(true)
        setVolumes([])
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListVolumes()
            setVolumes(response.data.Volumes)
        } catch (error) {
            console.error("Error fetching volumes:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchImages = async () => {
        setLoading(true)
        setImages([])
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListImages()
            setImages(response.data)
        } catch (error) {
            console.error("Error fetching images:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchNetworks = async () => {
        setLoading(true)
        setNetworks([])
        try {
            const api = getContainerManagerAPI()
            const response = await api.ListNetworks()
            setNetworks(response.data)
        } catch (error) {
            console.error("Error fetching networks:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.RemoveContainer({ containerIdOrName: containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error removing container:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStopContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.StopContainer({ containerIdOrName: containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error stopping container:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStartContainer = async (containerId: string) => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            await api.StartContainer({ containerIdOrName: containerId })
            fetchContainers()
        } catch (error) {
            console.error("Error starting container:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleShowContainerLogs = async (containerId: string) => {
        setContainerIdLogsSelected(containerId)
    }

    return <div className="pt-4">

        {
            containerIdLogsSelected
            && <ContainerLogHistoryOffcanvas
                containerId={containerIdLogsSelected}
                onClose={() => setContainerIdLogsSelected(undefined)} />
        }

        <div className="container-xl">
            <ul className="nav nav-bordered mb-4">
                <li className="nav-item cursor-pointer">
                    <a className={`nav-link ${mode === CONTAINERS_MANAGER_MODE ? "active" : ""}`}  onClick={() => setMode(CONTAINERS_MANAGER_MODE)} >{CONTAINERS_ICON} Containers</a>
                </li>
                <li className="nav-item cursor-pointer">
                    <a className={`nav-link ${mode === IMAGES_MANAGER_MODE ? "active" : ""}`}  onClick={() => setMode(IMAGES_MANAGER_MODE)} >{IMAGES_ICON} Images</a>
                </li>
                <li className="nav-item cursor-pointer">
                    <a className={`nav-link ${mode === NETWORKS_MANAGER_MODE ? "active" : ""}`}  onClick={() => setMode(NETWORKS_MANAGER_MODE)} >{NETWORKS_ICON} Networks</a>
                </li>
                <li className="nav-item cursor-pointer">
                    <a className={`nav-link ${mode === VOLUMES_MANAGER_MODE ? "active" : ""}`}  onClick={() => setMode(VOLUMES_MANAGER_MODE)} >{VOLUME_ICON} Volumes</a>
                </li>
            </ul>
            {

                mode === CONTAINERS_MANAGER_MODE
                && (!containers || containers.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No containers found.
                </div>
            }

            {
                mode === IMAGES_MANAGER_MODE
                && (!images || images.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No images found.
                </div>
            }

            {
                mode === NETWORKS_MANAGER_MODE
                && (!networks || networks.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No networks found.
                </div>
            }

            {
                mode === VOLUMES_MANAGER_MODE
                && (!volumes || volumes.length === 0)
                && !loading
                && <div className="text-center text-muted">
                    No volumes found.
                </div>
            }

            {
                loading
                && <div className="text-center text-muted">
                    Loading containers...
                </div>
            }


            <div className="row">
                <div className="col-md-12">
                    {
                        mode === CONTAINERS_MANAGER_MODE
                        && <div className="card">
                            <ContainerTable 
                                    containers={containers}
                                    onStartContainer={handleStartContainer}
                                    onStopContainer={handleStopContainer}
                                    onRemoveContainer={handleRemoveContainer} 
                                    onShowContainerLogHistory={handleShowContainerLogs}
                                    />
                        </div>
                    }
                    {
                        mode === IMAGES_MANAGER_MODE &&
                        <div className="card">
                            <ImagesTable images={images}/>
                        </div>
                    }

                    {
                        mode === NETWORKS_MANAGER_MODE &&
                        <div className="card">
                            <NetworksTable networks={networks}/>
                        </div>
                    }
                    {
                        mode === VOLUMES_MANAGER_MODE &&
                        <>
                            <div className="row g-2 align-items-center">
                                <div className="col-auto ms-auto d-print-none mt-0 mb-3">
                                    <div className="btn-list">
                                        <button className="btn btn-outline-blue">
                                            New Volume
                                        </button>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="card">
                                <VolumesTable volumes={volumes}/>
                            </div>
                        
                        </>
                    }
                </div>
            </div>

        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(ContainerManager)