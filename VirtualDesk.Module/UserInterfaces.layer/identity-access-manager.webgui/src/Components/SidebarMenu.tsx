import * as React from "react"

import PANELS_DEFINITIONS from "../Definitions/Panels.definitions"

import GetActiveIfFocus from "../Utils/GetActiveIfFocus"

import * as PanelSymbols from "../Symbols/Tabs.symbols"

const DropdownItem = ({
    panelFocusSymbol,
    panelSymbols,
    onClickMenuItem
}) => 
    <a className={`dropdown-item ${GetActiveIfFocus(panelFocusSymbol, panelSymbols) ? 'active' : ''}`} onClick={() => onClickMenuItem(panelSymbols)}>{PANELS_DEFINITIONS[panelSymbols].name}</a>

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
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.ORGANIZATION_PANEL} onClickMenuItem={onClickMenuItem} />
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.ACCOUNT_PANEL} onClickMenuItem={onClickMenuItem} />
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Identities</span>
                            </a>
                            <div className="dropdown-menu">
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.USER_PANEL} onClickMenuItem={onClickMenuItem} />
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.SERVICE_IDENTITY_PANEL} onClickMenuItem={onClickMenuItem} />
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.DEVICE_PANEL} onClickMenuItem={onClickMenuItem} />
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Access Control</span>
                            </a>
                            <div className="dropdown-menu">
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.ROLE_PANEL} onClickMenuItem={onClickMenuItem} />
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.PERMISSION_PANEL} onClickMenuItem={onClickMenuItem} />
                                <DropdownItem panelFocusSymbol={panelFocusSymbol} panelSymbols={PanelSymbols.POLICY_PANEL} onClickMenuItem={onClickMenuItem} />
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
}
export default SidebarMenu