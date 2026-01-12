
import * as React from "react"

const X_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="m-0 icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>

import GetActiveIfFocus from "../Utils/GetActiveIfFocus"

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
                                className={`nav-item cursor-pointer`}
                                onClick={() => onFocusTab(panelSymbol)}>
                                <a className={`nav-link py-1 pe-0 ${GetActiveIfFocus(panelFocusSymbol, panelSymbol) ? "active" : ""}`}>{name}<button onClick={() => onCloseTab(panelSymbol)} className="btn btn-sm btn-link">{X_ICON}</button></a>
                            </li>
                        )
                    }
                </ul>
                <div className="tab-content flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                    {componentContainer}
                </div>
            </div>
}

export default TabsPanelContainer