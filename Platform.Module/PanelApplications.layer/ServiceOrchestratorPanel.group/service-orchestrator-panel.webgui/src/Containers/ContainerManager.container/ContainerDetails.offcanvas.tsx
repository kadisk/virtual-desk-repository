import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const GetStatusColor = (status: string) => {
    switch (status) {
        case "running":
            return "green"
        case "exited":
            return "red"
        case "paused":
            return "yellow"
        case "restarting":
            return "azure"
        default:
            return "gray"
    }
}

const ContainerDetailsOffcanvas = ({
    containerId,
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
        fetchInspectContainer()
    }, [containerId])

    const fetchInspectContainer = async () => {
        try {
            const ContainerManagerAPI = getContainerManagerAPI()
            const response = await ContainerManagerAPI.InspectContainer({ containerIdOrName: containerId })
            setInspectData(response.data)
        } catch (error) {
            console.error("Error fetching container details:", error)  
        }
    }

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <span className={`status-indicator status-${GetStatusColor(inspectData?.State?.Status)} status-indicator-animated`}>
                                <span className="status-indicator-circle"></span>
                                <span className="status-indicator-circle"></span>
                                <span className="status-indicator-circle"></span>
                            </span>
                        </div>
                        <div className="col">
                            <h2 className="page-title">{inspectData?.Name}</h2>
                            <div className="text-secondary">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item">
                                        <span className={`text-${GetStatusColor(inspectData?.State?.Status)}`}>
                                            {inspectData?.State?.Status}
                                        </span>
                                    </li>
                                </ul>
                            </div>
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
                            <dt className="col-5">Container ID:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData?.Id?.substring(0, 12)}</dd>
                            <dt className="col-5">Image:</dt>
                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData?.Config?.Image}</dd>
                            <dt className="col-5">User:</dt>
                            <dd className="col-7">{inspectData?.Config?.User || 'root'}</dd>
                            <dt className="col-5">Driver:</dt>
                            <dd className="col-7">{inspectData?.Driver}</dd>
                            <dt className="col-5">Working Dir:</dt>
                            <dd className="col-7">{inspectData?.Config?.WorkingDir}</dd>
                        </dl>

                        <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Status</div>
                        <dl className="row">
                            <dt className="col-5">Status:</dt>
                            <dd className="col-7">
                                <span className={`badge badge-${inspectData?.State?.Running ? 'success' : 'danger'}`}>
                                    {inspectData?.State?.Status}
                                </span>
                            </dd>
                            <dt className="col-5">PID:</dt>
                            <dd className="col-7">{inspectData?.State?.Pid}</dd>
                            <dt className="col-5">Exit Code:</dt>
                            <dd className="col-7">{inspectData?.State?.ExitCode}</dd>
                            <dt className="col-5">Restart Count:</dt>
                            <dd className="col-7">{inspectData?.RestartCount}</dd>
                            <dt className="col-5">Started At:</dt>
                            <dd className="col-7 text-xs">{new Date(inspectData?.State?.StartedAt).toLocaleString()}</dd>
                        </dl>

                        {inspectData?.HostConfig?.PortBindings && Object.keys(inspectData.HostConfig.PortBindings).length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Ports</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table text-center">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Container Port</strong></th>
                                                <th className="p-1"><strong>Host Binding</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(inspectData.HostConfig.PortBindings).map(([port, bindings]: any) => (
                                                bindings.map((binding: any, idx: number) => (
                                                    <tr key={`${port}-${idx}`}>
                                                        <td className="p-1">{port}</td>
                                                        <td className="p-1">{binding.HostIp || '0.0.0.0'}:{binding.HostPort}</td>
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {inspectData?.NetworkSettings?.Networks && Object.keys(inspectData.NetworkSettings.Networks).length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Networks</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table text-center">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Network</strong></th>
                                                <th className="p-1"><strong>IP Address</strong></th>
                                                <th className="p-1"><strong>Gateway</strong></th>
                                                <th className="p-1"><strong>MAC Address</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(inspectData.NetworkSettings.Networks).map(([networkName, network]: any) => (
                                                <tr key={networkName}>
                                                    <td className="p-1"><strong>{networkName}</strong></td>
                                                    <td className="p-1 font-monospace text-xs">{network.IPAddress}</td>
                                                    <td className="p-1 font-monospace text-xs">{network.Gateway}</td>
                                                    <td className="p-1 font-monospace text-xs">{network.MacAddress}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {inspectData?.Config?.Env && inspectData.Config.Env.length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Environment Variables</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Key</strong></th>
                                                <th className="p-1"><strong>Value</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inspectData.Config.Env.map((env: string, idx: number) => {
                                                const [key, ...valueParts] = env.split('=')
                                                const value = valueParts.join('=')
                                                return (
                                                    <tr key={idx}>
                                                        <td className="p-1"><strong>{key}</strong></td>
                                                        <td className="p-1 font-monospace text-xs text-truncate">{value}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {(inspectData?.HostConfig?.Memory || inspectData?.HostConfig?.CpuShares) && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Resources</div>
                                <dl className="row">
                                    {inspectData?.HostConfig?.Memory > 0 && (
                                        <>
                                            <dt className="col-5">Max Memory:</dt>
                                            <dd className="col-7">{(inspectData.HostConfig.Memory / 1024 / 1024 / 1024).toFixed(2)} GB</dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.MemoryReservation > 0 && (
                                        <>
                                            <dt className="col-5">Reserved Memory:</dt>
                                            <dd className="col-7">{(inspectData.HostConfig.MemoryReservation / 1024 / 1024 / 1024).toFixed(2)} GB</dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.CpuShares > 0 && (
                                        <>
                                            <dt className="col-5">CPU Shares:</dt>
                                            <dd className="col-7">{inspectData.HostConfig.CpuShares}</dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.CpusetCpus && (
                                        <>
                                            <dt className="col-5">CPUs:</dt>
                                            <dd className="col-7">{inspectData.HostConfig.CpusetCpus}</dd>
                                        </>
                                    )}
                                </dl>
                            </>
                        )}

                        {inspectData?.Config?.Entrypoint && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Entrypoint</div>
                                <dl className="row">
                                    <dt className="col-5">Entrypoint:</dt>
                                    <dd className="col-7 font-monospace text-xs">{inspectData.Config.Entrypoint.join(' ')}</dd>
                                </dl>
                            </>
                        )}

                        {inspectData?.Config?.Cmd && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Command</div>
                                <dl className="row">
                                    <dt className="col-5">Command:</dt>
                                    <dd className="col-7 font-monospace text-xs">{inspectData.Config.Cmd.join(' ')}</dd>
                                </dl>
                            </>
                        )}

                        {inspectData?.Mounts && inspectData.Mounts.length > 0 && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Volumes</div>
                                <div className="table-responsive bg-gray-100">
                                    <table className="table table-vcenter card-table">
                                        <thead>
                                            <tr>
                                                <th className="p-1"><strong>Source</strong></th>
                                                <th className="p-1"><strong>Destination</strong></th>
                                                <th className="p-1"><strong>Mode</strong></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inspectData.Mounts.map((mount: any, idx: number) => (
                                                <tr key={idx}>
                                                    <td className="p-1 font-monospace text-xs text-truncate">{mount.Source}</td>
                                                    <td className="p-1 font-monospace text-xs text-truncate">{mount.Destination}</td>
                                                    <td className="p-1">{mount.Mode || 'rw'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        <>
                            <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Container Details</div>
                            <dl className="row">
                                {inspectData?.Created && (
                                    <>
                                        <dt className="col-5">Created:</dt>
                                        <dd className="col-7 text-xs">{new Date(inspectData.Created).toLocaleString()}</dd>
                                    </>
                                )}
                                {inspectData?.State?.FinishedAt && inspectData.State.FinishedAt !== "0001-01-01T00:00:00Z" && (
                                    <>
                                        <dt className="col-5">Finished At:</dt>
                                        <dd className="col-7 text-xs">{new Date(inspectData.State.FinishedAt).toLocaleString()}</dd>
                                    </>
                                )}
                                {inspectData?.Platform && (
                                    <>
                                        <dt className="col-5">Platform:</dt>
                                        <dd className="col-7">{inspectData.Platform}</dd>
                                    </>
                                )}
                                {inspectData?.AppArmorProfile && (
                                    <>
                                        <dt className="col-5">AppArmor:</dt>
                                        <dd className="col-7">{inspectData.AppArmorProfile}</dd>
                                    </>
                                )}
                            </dl>
                        </>

                        {(inspectData?.HostConfig?.RestartPolicy || 
                          inspectData?.HostConfig?.Privileged !== undefined || 
                          inspectData?.HostConfig?.ReadonlyRootfs !== undefined) && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Policies & Security</div>
                                <dl className="row">
                                    {inspectData?.HostConfig?.RestartPolicy && (
                                        <>
                                            <dt className="col-5">Restart Policy:</dt>
                                            <dd className="col-7">
                                                {inspectData.HostConfig.RestartPolicy.Name}
                                                {inspectData.HostConfig.RestartPolicy.MaximumRetryCount > 0 && 
                                                    ` (max ${inspectData.HostConfig.RestartPolicy.MaximumRetryCount})`}
                                            </dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.AutoRemove !== undefined && (
                                        <>
                                            <dt className="col-5">Auto Remove:</dt>
                                            <dd className="col-7">
                                                {inspectData.HostConfig.AutoRemove ? (
                                                    <span className="badge badge-success">Enabled</span>
                                                ) : (
                                                    <span className="badge badge-secondary">Disabled</span>
                                                )}
                                            </dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.Privileged !== undefined && (
                                        <>
                                            <dt className="col-5">Privileged:</dt>
                                            <dd className="col-7">
                                                {inspectData.HostConfig.Privileged ? (
                                                    <span className="badge badge-danger">Yes</span>
                                                ) : (
                                                    <span className="badge badge-success">No</span>
                                                )}
                                            </dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.ReadonlyRootfs !== undefined && (
                                        <>
                                            <dt className="col-5">Readonly Root FS:</dt>
                                            <dd className="col-7">
                                                {inspectData.HostConfig.ReadonlyRootfs ? (
                                                    <span className="badge badge-success">Yes</span>
                                                ) : (
                                                    <span className="badge badge-secondary">No</span>
                                                )}
                                            </dd>
                                        </>
                                    )}
                                </dl>
                            </>
                        )}

                        {(inspectData?.ResolvConfPath || inspectData?.HostnamePath || inspectData?.HostsPath || inspectData?.LogPath) && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Paths</div>
                                <dl className="row">
                                    {inspectData?.ResolvConfPath && (
                                        <>
                                            <dt className="col-5">Resolve Config:</dt>
                                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.ResolvConfPath}</dd>
                                        </>
                                    )}
                                    {inspectData?.HostnamePath && (
                                        <>
                                            <dt className="col-5">Hostname:</dt>
                                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.HostnamePath}</dd>
                                        </>
                                    )}
                                    {inspectData?.HostsPath && (
                                        <>
                                            <dt className="col-5">Hosts:</dt>
                                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.HostsPath}</dd>
                                        </>
                                    )}
                                    {inspectData?.LogPath && (
                                        <>
                                            <dt className="col-5">Log Path:</dt>
                                            <dd className="col-7 font-monospace text-xs text-truncate">{inspectData.LogPath}</dd>
                                        </>
                                    )}
                                </dl>
                            </>
                        )}

                        {inspectData?.HostConfig?.NetworkMode && (
                            <>
                                <div className="hr-text hr-text-center hr-text-spaceless my-3 mt-5">Network Configuration</div>
                                <dl className="row">
                                    <dt className="col-5">Network Mode:</dt>
                                    <dd className="col-7">{inspectData.HostConfig.NetworkMode}</dd>
                                    {inspectData?.HostConfig?.Dns && inspectData.HostConfig.Dns.length > 0 && (
                                        <>
                                            <dt className="col-5">DNS Servers:</dt>
                                            <dd className="col-7">{inspectData.HostConfig.Dns.join(', ')}</dd>
                                        </>
                                    )}
                                    {inspectData?.HostConfig?.ExtraHosts && inspectData.HostConfig.ExtraHosts.length > 0 && (
                                        <>
                                            <dt className="col-5">Extra Hosts:</dt>
                                            <dd className="col-7">{inspectData.HostConfig.ExtraHosts.join(', ')}</dd>
                                        </>
                                    )}
                                </dl>
                            </>
                        )}
                    </div>
                )}
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ContainerDetailsOffcanvas)