
import * as React from "react"


import PANELS_DEFINITIONS from "../Definitions/Panels.definitions"

import useTabsPanelStateManager from "../Hooks/useTabsPanelStateManager"

import IAMSidebarMenu from "../Components/IAMSidebarMenu"

import TabsPanelContainer from "../Containers/TabsPanel.container"

const IAMHomePanelContainer = () => {

    const panelState = useTabsPanelStateManager(PANELS_DEFINITIONS)

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


export default IAMHomePanelContainer
