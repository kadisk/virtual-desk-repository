import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const NetworkDetailsOffcanvas = ({
    networkId,
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
            fetchInspectNetwork()
        }, [networkId])
    
    const fetchInspectNetwork = async () => {
        try {
            const ContainerManagerAPI = getContainerManagerAPI()
            const response = await ContainerManagerAPI.InspectNetwork({ networkIdOrName: networkId })
            setInspectData(response.data)
        } catch (error) {
            console.error("Error fetching network details:", error)  
        }
    }

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">{inspectData?.Name || 'Network Details'}</h2>
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
                            <dt className="col-5">Network ID:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData?.Id?.substring(0, 12)}</dd>
                            <dt className="col-5">Name:</dt>
                            <dd className="col-7">{inspectData?.Name}</dd>
                            <dt className="col-5">Scope:</dt>
                            <dd className="col-7">{inspectData?.Scope}</dd>
                            <dt className="col-5">Driver:</dt>
                            <dd className="col-7">{inspectData?.Driver}</dd>
                            <dt className="col-5">Created:</dt>
                            <dd className="col-7 text-xs">{new Date(inspectData?.Created).toLocaleString()}</dd>
                        </dl>

                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Configuration</div>
                        <dl className="row">
                            <dt className="col-5">Enable IPv4:</dt>
                            <dd className="col-7">
                                {inspectData?.EnableIPv4 ? (
                                    <span className="badge badge-success">Yes</span>
                                ) : (
                                    <span className="badge badge-secondary">No</span>
                                )}
                            </dd>
                            <dt className="col-5">Enable IPv6:</dt>
                            <dd className="col-7">
                                {inspectData?.EnableIPv6 ? (
                                    <span className="badge badge-success">Yes</span>
                                ) : (
                                    <span className="badge badge-secondary">No</span>
                                )}
                            </dd>
                            <dt className="col-5">Internal:</dt>
                            <dd className="col-7">
                                {inspectData?.Internal ? (
                                    <span className="badge badge-success">Yes</span>
                                ) : (
                                    <span className="badge badge-secondary">No</span>
                                )}
                            </dd>
                            <dt className="col-5">Attachable:</dt>
                            <dd className="col-7">
                                {inspectData?.Attachable ? (
                                    <span className="badge badge-success">Yes</span>
                                ) : (
                                    <span className="badge badge-secondary">No</span>
                                )}
                            </dd>
                            <dt className="col-5">Ingress:</dt>
                            <dd className="col-7">
                                {inspectData?.Ingress ? (
                                    <span className="badge badge-success">Yes</span>
                                ) : (
                                    <span className="badge badge-secondary">No</span>
                                )}
                            </dd>
                            <dt className="col-5">Config Only:</dt>
                            <dd className="col-7">
                                {inspectData?.ConfigOnly ? (
                                    <span className="badge badge-success">Yes</span>
                                ) : (
                                    <span className="badge badge-secondary">No</span>
                                )}
                            </dd>
                        </dl>

                        {inspectData?.IPAM?.Config && inspectData.IPAM.Config.length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">IPAM Configuration</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table text-center">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Subnet</strong></th>
                                                <th className="p-1"><strong>Gateway</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inspectData.IPAM.Config.map((config: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="p-1 font-monospace text-xs">{config.Subnet}</td>
                                                    <td className="p-1 font-monospace text-xs">{config.Gateway}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

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

                        {inspectData?.Containers && Object.keys(inspectData.Containers).length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Connected Containers</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Container ID</strong></th>
                                                <th className="p-1"><strong>Name</strong></th>
                                                <th className="p-1"><strong>IPv4 Address</strong></th>
                                                <th className="p-1"><strong>IPv6 Address</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(inspectData.Containers).map(([id, details]: any) => (
                                                <tr key={id}>
                                                    <td className="p-1 font-monospace text-xs text-truncate">{id.substring(0, 12)}</td>
                                                    <td className="p-1">{details.Name}</td>
                                                    <td className="p-1 font-monospace text-xs">{details.IPv4Address}</td>
                                                    <td className="p-1 font-monospace text-xs">{details.IPv6Address}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {inspectData?.Status?.IPAM?.Subnets && Object.keys(inspectData.Status.IPAM.Subnets).length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Status</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table text-center">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Subnet</strong></th>
                                                <th className="p-1"><strong>IPs in Use</strong></th>
                                                <th className="p-1"><strong>Dynamic IPs Available</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(inspectData.Status.IPAM.Subnets).map(([subnet, stats]: any) => (
                                                <tr key={subnet}>
                                                    <td className="p-1 font-monospace text-xs">{subnet}</td>
                                                    <td className="p-1">{stats.IPsInUse}</td>
                                                    <td className="p-1">{stats.DynamicIPsAvailable}</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(NetworkDetailsOffcanvas)