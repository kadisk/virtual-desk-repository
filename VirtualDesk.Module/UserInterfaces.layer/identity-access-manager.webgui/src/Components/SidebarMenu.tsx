import * as React from "react"

import PANELS_DEFINITIONS from "../Definitions/Panels.definitions"

import GetActiveIfFocus from "../Utils/GetActiveIfFocus"

import * as PanelSymbols from "../Symbols/Tabs.symbols"

const SidebarMenu = ({
    onClickMenuItem,
    panelFocusSymbol
}) => {

    return <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{ width: "auto", position: "relative", overflowY: "auto" }}>
                <div className="collapse navbar-collapse" id="sidebar-menu">
                    <ul className="navbar-nav pt-lg-3">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#navbar-base" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title"> Organizational Structure and Scope </span>
                            </a>
                            <div className="dropdown-menu">
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.ORGANIZATION_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.ORGANIZATION_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.ORGANIZATION_PANEL].name}</a>
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.ACCOUNT_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.ACCOUNT_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.ACCOUNT_PANEL].name}</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Identities</span>
                            </a>
                            <div className="dropdown-menu">
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.USER_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.USER_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.USER_PANEL].name}</a>
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.SERVICE_IDENTITY_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.SERVICE_IDENTITY_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.SERVICE_IDENTITY_PANEL].name}</a>
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.DEVICE_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.DEVICE_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.DEVICE_PANEL].name}</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Access Control</span>
                            </a>
                            <div className="dropdown-menu">
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.ROLE_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.ROLE_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.ROLE_PANEL].name}</a>
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.PERMISSION_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.PERMISSION_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.PERMISSION_PANEL].name}</a>
                                <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, PanelSymbols.POLICY_PANEL) ? 'active' : ''}`} onClick={() => onClickMenuItem(PanelSymbols.POLICY_PANEL)}>{PANELS_DEFINITIONS[PanelSymbols.POLICY_PANEL].name}</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
}
export default SidebarMenu