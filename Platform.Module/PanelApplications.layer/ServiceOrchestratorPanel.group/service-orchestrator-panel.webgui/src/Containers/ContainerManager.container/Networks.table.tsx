import React from "react"

import styled from "styled-components"

export const NetworkId = styled.div`
  max-width: 240px;       /* ajuste conforme necessário */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  color: #6c757d;
  font-family: monospace;
  font-size: 0.85em;
`


const NetworksTable = ({ networks, onViewNetworkDetails }) => 
    <div className="table-responsive">
                                <table className="table table-vcenter card-table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th>General Information</th>
                                            <th>IP Address Management</th>
                                            <th>Options</th>
                                            <th>Labels</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {networks.map(network => <tr className="cursor-pointer" onClick={() => onViewNetworkDetails(network.Id)}>
                                            <td>
                                                <div className="flex-fill">
                                                    <div><h1>{network.Name}</h1></div>
                                                    <NetworkId title={network.Id}>{network.Id}</NetworkId>
                                                    <div><strong>Driver: </strong>{network.Driver}</div>
                                                    <div><strong>Scope: </strong>{network.Scope}</div>
                                                    <div className="text-secondary">{network.Created}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex-fill">
                                                    <div><strong>Driver: </strong>{network.IPAM?.Driver}</div>
                                                    {Array.isArray(network.IPAM?.Config) && network.IPAM.Config.length > 0 && network.IPAM.Config.map((cfg, i) => (
                                                        <>
                                                            {cfg.Subnet && (
                                                                <div>
                                                                    <strong>Subnet: </strong>{cfg.Subnet}
                                                                </div>
                                                            )}
                                                            {cfg.Gateway && (
                                                                <div>
                                                                    <strong>Gateway: </strong>{cfg.Gateway}
                                                                </div>
                                                            )}
                                                        </>
                                                    ))}
                                                    <div>
                                                        <span style={{
                                                            display: "inline-block",
                                                            background: network.EnableIPv4 ? "#e3f2fd" : "#eceff1",
                                                            color: network.EnableIPv4 ? "#1565c0" : "#78909c",
                                                            borderRadius: 4,
                                                            padding: "2px 8px",
                                                            fontWeight: 600,
                                                            fontSize: "0.93em"
                                                        }}>
                                                            IPv4: {network.EnableIPv4 ? "Yes" : "No"}
                                                        </span>
                                                        <span style={{
                                                            display: "inline-block",
                                                            background: network.EnableIPv6 ? "#e3f2fd" : "#eceff1",
                                                            color: network.EnableIPv6 ? "#1565c0" : "#78909c",
                                                            borderRadius: 4,
                                                            padding: "2px 8px",
                                                            fontWeight: 600,
                                                            fontSize: "0.93em"
                                                        }}>
                                                            IPv6: {network.EnableIPv6 ? "Yes" : "No"}
                                                        </span>
                                                        {network.Internal && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#fff3e0",
                                                                color: "#ef6c00",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>Internal</span>
                                                        )}
                                                        {network.Attachable && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#e3f2fd",
                                                                color: "#1565c0",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>Attachable</span>
                                                        )}
                                                        {network.Ingress && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#ede7f6",
                                                                color: "#4527a0",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>Ingress</span>
                                                        )}
                                                        {network.ConfigOnly && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#fce4ec",
                                                                color: "#ad1457",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>ConfigOnly</span>
                                                        )}
                                                        {network.ConfigFrom?.Network && (
                                                            <span style={{
                                                                display: "inline-block",
                                                                background: "#f3e5f5",
                                                                color: "#6a1b9a",
                                                                borderRadius: 4,
                                                                padding: "2px 8px",
                                                                fontWeight: 600,
                                                                fontSize: "0.93em"
                                                            }}>ConfigFrom: {network.ConfigFrom.Network}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{network.Options && Object.keys(network.Options).length > 0
                                                        ? Object.entries(network.Options).map(([k, v]) =>
                                                            <span key={k} style={{
                                                                display: "inline-block",
                                                                background: "#e3f2fd",
                                                                borderRadius: 4,
                                                                padding: "2px 6px",
                                                                margin: "2px 2px 2px 0",
                                                                color: "#1565c0",
                                                                fontSize: "0.93em"
                                                            }}>
                                                                {k}: {String(v)}
                                                            </span>
                                                        )
                                                        : <span className="text-muted">-</span>
                                                    }</td>
                                            <td>{network.Labels && Object.keys(network.Labels).length > 0
                                                        ? Object.entries(network.Labels).map(([k, v]) =>
                                                            <span key={k} style={{
                                                                display: "inline-block",
                                                                background: "#f3e5f5",
                                                                borderRadius: 4,
                                                                padding: "2px 6px",
                                                                margin: "2px 2px 2px 0",
                                                                color: "#6a1b9a",
                                                                fontSize: "0.93em"
                                                            }}>
                                                                {k}: {String(v)}
                                                            </span>
                                                        )
                                                        : <span className="text-muted">-</span>
                                                    }</td>
                                        </tr>) }
                                    </tbody>
                                </table>
                            </div>

export default NetworksTable