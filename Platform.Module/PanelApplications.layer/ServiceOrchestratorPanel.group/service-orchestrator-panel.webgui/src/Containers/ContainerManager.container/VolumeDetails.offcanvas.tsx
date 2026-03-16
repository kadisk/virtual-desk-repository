import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const VolumeDetailsOffcanvas = ({
    volumeName,
    onClose,
    HTTPServerManager
}) => {

    const [inspectData, setInspectData] = useState<any>()

    const getContainerManagerAPI = () =>
        GetAPI({
            apiName: "ContainerManager",
            serverManagerInformation: HTTPServerManager,
        })

    useEffect(() => {
            fetchInspectVolume()
        }, [volumeName])
    
    const fetchInspectVolume = async () => {
        try {
            const ContainerManagerAPI = getContainerManagerAPI()
            const response = await ContainerManagerAPI.InspectVolume({ volumeName })
            setInspectData(response.data)
        } catch (error) {
            console.error("Error fetching volume details:", error)  
        }
    }

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">{inspectData?.Name || 'Volume Details'}</h2>
                        </div>
                    </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onClose()}></button>
                </div>

                {!inspectData ? (
                    <div className="justify-content-center row my-4">
                        <div className="spinner-border"></div>
                    </div>
                ) : (
                    <div className="offcanvas-body">
                        <dl className="row">
                            <dt className="col-5">Name:</dt>
                            <dd className="col-7">{inspectData?.Name}</dd>
                            <dt className="col-5">Driver:</dt>
                            <dd className="col-7">{inspectData?.Driver}</dd>
                            <dt className="col-5">Scope:</dt>
                            <dd className="col-7">{inspectData?.Scope}</dd>
                            <dt className="col-5">Mountpoint:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData?.Mountpoint}</dd>
                            <dt className="col-5">Created:</dt>
                            <dd className="col-7 text-xs">{inspectData?.CreatedAt ? new Date(inspectData.CreatedAt).toLocaleString() : 'N/A'}</dd>
                        </dl>

                        {inspectData?.Options && Object.keys(inspectData.Options).length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Options</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Key</strong></th>
                                                <th className="p-1"><strong>Value</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(inspectData.Options).map(([key, value]: any) => (
                                                <tr key={key}>
                                                    <td className="p-1"><strong>{key}</strong></td>
                                                    <td className="p-1 font-monospace text-xs text-truncate">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {inspectData?.Labels && Object.keys(inspectData.Labels).length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Labels</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Key</strong></th>
                                                <th className="p-1"><strong>Value</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(inspectData.Labels).map(([key, value]: any) => (
                                                <tr key={key}>
                                                    <td className="p-1"><strong>{key}</strong></td>
                                                    <td className="p-1 font-monospace text-xs text-truncate">{value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(VolumeDetailsOffcanvas)