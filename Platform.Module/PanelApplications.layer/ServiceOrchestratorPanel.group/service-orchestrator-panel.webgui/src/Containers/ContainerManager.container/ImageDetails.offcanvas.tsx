import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ImageDetailsOffcanvas = ({
    imageId,
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
        if (imageId) fetchInspectImage()
    }, [imageId])

    const fetchInspectImage = async () => {
        try {
            const ContainerManagerAPI = getContainerManagerAPI()
            const response = await ContainerManagerAPI.InspectImage({ imageIdOrName: imageId })
            setInspectData(response.data)
        } catch (error) {
            console.error("Error fetching image details:", error)
        }
    }

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{ width: "600px" }}>
        <div className="offcanvas-header">
            <div className="row g-3 align-items-center">
                <div className="col">
                    <h2 className="page-title">{inspectData?.RepoTags?.[0] || inspectData?.Id?.substring(0, 12) || 'Image Details'}</h2>
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
                    <dt className="col-5">Id:</dt>
                    <dd className="col-7 font-monospace text-xs text-truncate">{inspectData?.Id}</dd>
                    <dt className="col-5">RepoTags:</dt>
                    <dd className="col-7">
                        {Array.isArray(inspectData?.RepoTags) && inspectData.RepoTags.length > 0
                            ? inspectData.RepoTags.map((tag, i) => (
                                <div key={i} style={{ background: "#e3f2fd", borderRadius: 4, padding: "2px 6px", marginBottom: 2, display: "inline-block", color: "#1565c0" }}>{tag}</div>
                            ))
                            : <span className="text-muted">-</span>
                        }
                    </dd>
                    <dt className="col-5">Created:</dt>
                    <dd className="col-7">{inspectData?.Created ? new Date(inspectData.Created * 1000).toLocaleString() : '-'}</dd>
                    <dt className="col-5">Size:</dt>
                    <dd className="col-7">{inspectData?.Size ? `${(inspectData.Size / (1024 * 1024)).toFixed(2)} MB` : '-'}</dd>
                    <dt className="col-5">Parent:</dt>
                    <dd className="col-7 font-monospace text-xs text-truncate">{inspectData?.Parent || '-'}</dd>
                    <dt className="col-5">Docker Version:</dt>
                    <dd className="col-7">{inspectData?.DockerVersion || '-'}</dd>
                    <dt className="col-5">Architecture:</dt>
                    <dd className="col-7">{inspectData?.Architecture || '-'}</dd>
                    <dt className="col-5">Os:</dt>
                    <dd className="col-7">{inspectData?.Os || '-'}</dd>
                </dl>

                {inspectData?.Config && (
                    <>
                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Config</div>
                        <dl className="row">
                            <dt className="col-5">Entrypoint:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.Config.Entrypoint?.join(' ') || '-'}</dd>
                            <dt className="col-5">Cmd:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.Config.Cmd?.join(' ') || '-'}</dd>
                            <dt className="col-5">Env:</dt>
                            <dd className="col-7">
                                {Array.isArray(inspectData.Config.Env) && inspectData.Config.Env.length > 0
                                    ? inspectData.Config.Env.map((env, i) => (
                                        <div key={i} className="font-monospace text-xs text-truncate">{env}</div>
                                    ))
                                    : <span className="text-muted">-</span>
                                }
                            </dd>
                            <dt className="col-5">WorkingDir:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.Config.WorkingDir || '-'}</dd>
                            <dt className="col-5">User:</dt>
                            <dd className="col-7">{inspectData.Config.User || '-'}</dd>
                        </dl>
                    </>
                )}

                {inspectData?.RootFS && (
                    <>
                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">RootFS</div>
                        <dl className="row">
                            <dt className="col-5">Type:</dt>
                            <dd className="col-7">{inspectData.RootFS.Type || '-'}</dd>
                            <dt className="col-5">Layers:</dt>
                            <dd className="col-7">
                                {Array.isArray(inspectData.RootFS.Layers) && inspectData.RootFS.Layers.length > 0
                                    ? inspectData.RootFS.Layers.map((layer, i) => (
                                        <div key={i} className="font-monospace text-xs text-truncate">{layer}</div>
                                    ))
                                    : <span className="text-muted">-</span>
                                }
                            </dd>
                        </dl>
                    </>
                )}

                {inspectData?.Labels && Object.keys(inspectData.Labels).length > 0 && (
                    <>
                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Labels</div>
                        <div className="table-responsive bg-gray-100">
                            <table className="table table-vcenter card-table">
                                <thead>
                                    <tr>
                                        <th className="p-1">Key</th>
                                        <th className="p-1">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(inspectData.Labels).map(([key, value]: any) => (
                                        <tr key={key}>
                                            <td className="p-1 font-monospace text-xs text-truncate">{key}</td>
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

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ImageDetailsOffcanvas)
