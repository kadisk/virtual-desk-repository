
import * as React from "react"

import BlankPage from "../Components/BlankPage"

//@ts-ignore
import logoIAM from "../../Assets/logo-IAM-final-2.svg"

const WORLD_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
const X_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="m-0 icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>

import ORGANIZATIONS from "./ORGANIZATIONS.mock"

const ORGANIZATION_PANEL     = Symbol()
const ACCOUNT_PANEL          = Symbol()
const USER_PANEL             = Symbol()
const SERVICE_IDENTITY_PANEL = Symbol()
const DEVICE_PANEL           = Symbol()
const ROLE_PANEL             = Symbol()
const PERMISSION_PANEL       = Symbol()
const POLICY_PANEL           = Symbol()

const panelsDefinitions = {
    [ORGANIZATION_PANEL]     : { name: "Organizations",    },
    [ACCOUNT_PANEL]          : { name: "Accounts",         },
    [USER_PANEL]             : { name: "Users",            },
    [SERVICE_IDENTITY_PANEL] : { name: "Service Identity", },
    [DEVICE_PANEL]           : { name: "Devices",          },
    [ROLE_PANEL]             : { name: "Roles",            },
    [PERMISSION_PANEL]       : { name: "Permissions",      },
    [POLICY_PANEL]           : { name: "Policies",         },
}

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
                                <a className="dropdown-item" onClick={() => onClickMenuItem(ORGANIZATION_PANEL)}>{panelsDefinitions[ORGANIZATION_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(ACCOUNT_PANEL)}>{panelsDefinitions[ACCOUNT_PANEL].name}</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Identities</span>
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" onClick={() => onClickMenuItem(USER_PANEL)}>{panelsDefinitions[USER_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(SERVICE_IDENTITY_PANEL)}>{panelsDefinitions[SERVICE_IDENTITY_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(DEVICE_PANEL)}>{panelsDefinitions[DEVICE_PANEL].name}</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="false" role="button" aria-expanded="false">
                                <span className="nav-link-title">Access Control</span>
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" onClick={() => onClickMenuItem(ROLE_PANEL)}>{panelsDefinitions[ROLE_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(PERMISSION_PANEL)}>{panelsDefinitions[PERMISSION_PANEL].name}</a>
                                <a className="dropdown-item" onClick={() => onClickMenuItem(POLICY_PANEL)}>{panelsDefinitions[POLICY_PANEL].name}</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
}

const OrganizationPanelContainer = () => {

    return <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                <div className="card-header">
                    <div className="row w-full">
                        <div className="col"></div>
                        <div className="col-md-auto col-sm-12">
                            <div className="ms-auto d-flex flex-wrap btn-list">
                                <button className="btn btn-orange">New Organization</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-table">
                    <div className="table-responsive">
                        <table className="table table-vcenter card-table table-striped">
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>type</th>
                                    <th>description</th>
                                    <th>status</th>
                                    <th>residency</th>
                                    <th>created_at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ORGANIZATIONS.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.name}</td>
                                            <td className="text-secondary">{org.org_type}</td>
                                            <td className="text-secondary">{org.description}</td>
                                            <td className="text-secondary">{org.status}</td>
                                            <td className="text-secondary">{org.data_residency}</td>
                                            <td className="text-secondary">{org.created_at}</td>
                                            <td className="w-1">
                                                <a className="btn btn-sm btn-link">Edit</a>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
}


const TabsPanelContainer = ({
    tabsData,
    onClosePanel,
}) => {

    return <div className="m-3 card-tabs d-flex flex-column flex-grow-1" style={{ height: "100%" }}>
                <ul className="nav nav-tabs" role="tablist">
                    {
                        tabsData.map(({ name, codePanel }, index) =>
                            <li key={index} className="nav-item cursor-pointer">
                                <a className={`nav-link py-1 pe-0`}>{name}<button onClick={() => onClosePanel(codePanel)} className="btn btn-sm btn-link">{X_ICON}</button></a>
                            </li>
                        )
                    }
                </ul>
                <div className="tab-content flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    <OrganizationPanelContainer/>
                </div>
            </div>
}

const useTabsPanelStateManager = (definitions: any) => {

    const [panelsOpened, setPanelsOpened] = React.useState<symbol[]>([])

    const _PanelIsOpen = (panel: symbol) => panelsOpened.includes(panel)
    const OpenPanel    = (panel: symbol) => setPanelsOpened((prevPanels) => !_PanelIsOpen(panel) ? [...prevPanels, panel] : prevPanels)
    const ClosePanel   = (panel: symbol) => setPanelsOpened((prevPanels) => prevPanels.filter((p) => p !== panel))
    const GetTabsData  = ()              => panelsOpened.map((codePanel) => ({codePanel, ...definitions[codePanel]}))

    return {
        OpenPanel,
        GetTabsData,
        ClosePanel
    }
}

const IAMHomePanelContainer = () => {

    const panelState = useTabsPanelStateManager(panelsDefinitions)

    const handleClickMenuItem = (panel: symbol) => panelState.OpenPanel(panel)

    return <div className="d-flex" style={{ height: "94vh", overflow: "hidden", marginTop: "56px" }}>
                <IAMSidebarMenu onClickMenuItem={handleClickMenuItem}/>
                <div
                    className="page-wrapper flex-grow-1 d-flex flex-column"
                    style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
                    <div className="container-fluid flex-grow-1 d-flex p-0">
                        <div className="row flex-grow-1 m-0">
                            <div className="col-12 p-0">
                                <div className="d-flex align-items-start" style={{ gap: "1rem" }}>
                                    <TabsPanelContainer tabsData={panelState.GetTabsData()} onClosePanel={panelState.ClosePanel}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}

const MyHomePage = () =>
    <BlankPage>
        <>
            <nav className="navbar navbar-expand-lg bg-orange-lt fixed-top" style={{ zIndex: 9999 }}>
                <div className="container-fluid">
                    <div className="navbar-brand d-flex align-items-center p-0">
                        <img src={logoIAM} width={250} className="me-2" />
                    </div>
                </div>
            </nav>
            <IAMHomePanelContainer/>
        </>
    </BlankPage>

export default MyHomePage