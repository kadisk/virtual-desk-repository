
import * as React from "react"

import BlankPage from "../Components/BlankPage"

//@ts-ignore
import logoIAM from "../../Assets/logo-IAM-final-2.svg"

const WORLD_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
const X_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="m-0 icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>

import OrganizationPanelContainer from "../Containers/OrganizationPanel.container"
import AccountPanelContainer from "../Containers/AccountsPanel.container/AccountPanel.container"

const ORGANIZATION_PANEL     = Symbol()
const ACCOUNT_PANEL          = Symbol()
const USER_PANEL             = Symbol()
const SERVICE_IDENTITY_PANEL = Symbol()
const DEVICE_PANEL           = Symbol()
const ROLE_PANEL             = Symbol()
const PERMISSION_PANEL       = Symbol()
const POLICY_PANEL           = Symbol()

const panelsDefinitions = {
    [ORGANIZATION_PANEL]     : { name: "Organizations",  ComponentContainer:OrganizationPanelContainer },
    [ACCOUNT_PANEL]          : { name: "Accounts",       ComponentContainer:AccountPanelContainer },
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

const TabsPanelContainer = ({
    listTabs,
    panelFocusSymbol,
    onCloseTab,
    onFocusTab,
    componentContainer
}) => {

    return <div className="m-3 card-tabs d-flex flex-column flex-grow-1" style={{ height: "100%" }}>
                <ul className="nav nav-tabs" role="tablist">
                    {
                        listTabs.map(({ name, panelSymbol }, index) =>
                            <li key={index}
                                className={`nav-item cursor-pointer ${panelFocusSymbol === panelSymbol ? "active" : ""}`}
                                onClick={() => onFocusTab(panelSymbol)}>
                                <a className={`nav-link py-1 pe-0`}>{name}<button onClick={() => onCloseTab(panelSymbol)} className="btn btn-sm btn-link">{X_ICON}</button></a>
                            </li>
                        )
                    }
                </ul>
                <div className="tab-content flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    {componentContainer}
                </div>
            </div>
}

const useTabsPanelStateManager = (definitions: any) => {

    const [panelsOpened, setPanelsOpened] = React.useState<symbol[]>([])

    const [panelFocusSymbol, setPanelFocusSymbol] = React.useState<symbol | null>(null)

    const _PanelIsOpen = (panelSymbol: symbol) => panelsOpened.includes(panelSymbol)
    const OpenPanel    = (panelSymbol: symbol) => { 
        setPanelsOpened((prevPanels) => !_PanelIsOpen(panelSymbol) ? [...prevPanels, panelSymbol] : prevPanels) 
        setPanelFocusSymbol(panelSymbol)
    }
    const ClosePanel   = (panelSymbol: symbol) => { setPanelsOpened((prevPanels) => prevPanels.filter((p) => p !== panelSymbol)) }
    const ListOpenedTabs = () => panelsOpened.map((panelSymbol) => ({ name: definitions[panelSymbol]?.name, panelSymbol }))

    const GetPanelComponent = (panelSymbol: symbol) => {
        const panelDef = definitions[panelSymbol]
        if (!panelDef || !panelDef.ComponentContainer) return null
        const ComponentContainer = panelDef.ComponentContainer
        return <ComponentContainer/>
    }

    const ChangeFocusTo = (panelSymbol: symbol) => {
        if (!_PanelIsOpen(panelSymbol)) return
        setPanelFocusSymbol(panelSymbol)
    }

    const GetPanelFocusSymbol = () => panelFocusSymbol

    return {
        OpenPanel,
        ListOpenedTabs,
        ClosePanel,
        ChangeFocusTo,
        GetPanelFocusSymbol,
        GetPanelComponent
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
                                    <TabsPanelContainer 
                                        panelFocusSymbol={panelState.GetPanelFocusSymbol()}
                                        listTabs={panelState.ListOpenedTabs()} 
                                        onFocusTab={panelState.ChangeFocusTo}
                                        componentContainer={panelState.GetPanelComponent(panelState.GetPanelFocusSymbol()!)}
                                        onCloseTab={panelState.ClosePanel}/>
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
            <nav className="navbar navbar-expand-lg bg-orange-lt fixed-top">
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