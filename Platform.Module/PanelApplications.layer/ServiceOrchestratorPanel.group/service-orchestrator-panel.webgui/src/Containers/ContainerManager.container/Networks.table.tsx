import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import ContainerTable from "./Container.table"
import ImagesTable from "./Images.table"

const CONTAINERS_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-box"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" /><path d="M12 12l8 -4.5" /><path d="M12 12l0 9" /><path d="M12 12l-8 -4.5" /></svg>
const IMAGES_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-stack-3"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l-8 4l8 4l8 -4l-8 -4" /><path d="M4 10l8 4l8 -4" /><path d="M4 18l8 4l8 -4" /><path d="M4 14l8 4l8 -4" /></svg>
const NETWORKS_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-network"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0" /><path d="M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6" /><path d="M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6" /><path d="M6 9h12" /><path d="M3 20h7" /><path d="M14 20h7" /><path d="M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 15v3" /></svg>

const CONTAINERS_MANAGER_MODE = Symbol()
const IMAGES_MANAGER_MODE = Symbol()
const NETWORKS_MANAGER_MODE = Symbol()

const NetworksTable = ({ networks }) => 
    <div className="table-responsive">
                                <table className="table table-vcenter card-table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                            <th>Driver</th>
                                            <th>Scope</th>
                                            <th>Created</th>
                                            <th>IPAM</th>
                                            <th>Flags</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {networks.map(network => <tr>
                                            <td>{network.Id}</td>
                                            <td>{network.Name}</td>
                                            <td>{network.Driver}</td>
                                            <td>{network.Scope}</td>
                                            <td>{network.Created}</td>
                                            <td>{network.IPAM?.Driver && (
                                                        <span style={{
                                                            display: "inline-block",
                                                            borderRadius: 4,
                                                            padding: "2px 6px",
                                                            margin: "2px 4px 2px 0",
                                                            fontSize: "0.93em",
                                                            fontWeight: 600
                                                        }}>
                                                            Driver: {network.IPAM.Driver}
                                                        </span>
                                                    )}
                                                    {Array.isArray(network.IPAM?.Config) && network.IPAM.Config.length > 0 && network.IPAM.Config.map((cfg, i) => (
                                                        <React.Fragment key={i}>
                                                            {cfg.Subnet && (
                                                                <span style={{
                                                                    display: "inline-block",
                                                                    borderRadius: 4,
                                                                    padding: "2px 6px",
                                                                    margin: "2px 4px 2px 0",
                                                                    fontSize: "0.93em",
                                                                    fontWeight: 600
                                                                }}>
                                                                    Subnet: {cfg.Subnet}
                                                                </span>
                                                            )}
                                                            {cfg.Gateway && (
                                                                <span style={{
                                                                    display: "inline-block",
                                                                    borderRadius: 4,
                                                                    padding: "2px 6px",
                                                                    margin: "2px 4px 2px 0",
                                                                    fontSize: "0.93em",
                                                                    fontWeight: 600
                                                                }}>
                                                                    Gateway: {cfg.Gateway}
                                                                </span>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                    {(!network.IPAM?.Driver && (!network.IPAM?.Config || network.IPAM.Config.length === 0)) && (
                                                        <span className="text-muted">-</span>
                                                    )}</td>
                                            <td><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
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
                                                    </div></td>
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