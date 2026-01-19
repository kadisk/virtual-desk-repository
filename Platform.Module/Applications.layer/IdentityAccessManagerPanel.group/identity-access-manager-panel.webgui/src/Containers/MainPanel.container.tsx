
import * as React from "react"

import PANELS_DEFINITIONS from "../Definitions/Panels.definitions"
import useTabsPanelStateManager from "../Hooks/useTabsPanelStateManager"
import SidebarMenu from "../Components/SidebarMenu"
import TabsPanelContainer from "../Containers/TabsPanel.container"

const MainPanelContainer = () => {

    const {
        OpenPanel,
        ListOpenedTabs,
        ClosePanel,
        ChangeFocusTo,
        GetPanelFocusSymbol,
        GetPanelComponent
    } = useTabsPanelStateManager(PANELS_DEFINITIONS)

    const handleClickMenuItem = (panel: symbol) => OpenPanel(panel)

    return <div className="d-flex" style={{ height: "94vh", overflow: "hidden", marginTop: "56px" }}>
                <SidebarMenu panelFocusSymbol={GetPanelFocusSymbol()} onClickMenuItem={handleClickMenuItem}/>
                <div
                    className="page-wrapper flex-grow-1 d-flex flex-column"
                    style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
                    <div className="container-fluid flex-grow-1 d-flex p-0">
                        <div className="row flex-grow-1 m-0">
                            <div className="col-12 p-0">
                                <div className="d-flex align-items-start" style={{ gap: "1rem" }}>
                                    <TabsPanelContainer 
                                        panelFocusSymbol={GetPanelFocusSymbol()}
                                        listTabs={ListOpenedTabs()} 
                                        onFocusTab={ChangeFocusTo}
                                        componentContainer={GetPanelComponent(GetPanelFocusSymbol()!)}
                                        onCloseTab={ClosePanel}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
}


export default MainPanelContainer
