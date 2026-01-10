import * as React from "react"

import PANELS_DEFINITIONS from "../Definitions/Panels.definitions"

const {
    ORGANIZATION_PANEL,
    ACCOUNT_PANEL,
    USER_PANEL,
    SERVICE_IDENTITY_PANEL,
    DEVICE_PANEL,
    ROLE_PANEL,
    PERMISSION_PANEL,
    POLICY_PANEL
} = require("../Symbols/Tabs.symbols")

const IAMSidebarMenu = ({
    onClickMenuItem,
}) => {

    return <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{ width: "auto", position: "relative", overflowY: "auto" }}>
                <div className="collapse navbar-collapse" id="sidebar-menu">
                    <ul className="navbar-nav pt-lg-3">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#navbar-base" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title"> Organizational Structure and Scope </span>
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" onClick={() => onClickMenuItem(ORGANIZATION_PANEL)}>{PANELS_DEFINITIONS[ORGANIZATION_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(ACCOUNT_PANEL)}>{PANELS_DEFINITIONS[ACCOUNT_PANEL].name}</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Identities</span>
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" onClick={() => onClickMenuItem(USER_PANEL)}>{PANELS_DEFINITIONS[USER_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(SERVICE_IDENTITY_PANEL)}>{PANELS_DEFINITIONS[SERVICE_IDENTITY_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(DEVICE_PANEL)}>{PANELS_DEFINITIONS[DEVICE_PANEL].name}</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Access Control</span>
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" onClick={() => onClickMenuItem(ROLE_PANEL)}>{PANELS_DEFINITIONS[ROLE_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(PERMISSION_PANEL)}>{PANELS_DEFINITIONS[PERMISSION_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(POLICY_PANEL)}>{PANELS_DEFINITIONS[POLICY_PANEL].name}</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
}
export default IAMSidebarMenu