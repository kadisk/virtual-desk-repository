import { useState, createElement } from 'react'

const useTabsPanelStateManager = (definitions: any) => {

    const [panelsOpened, setPanelsOpened] = useState<symbol[]>([])

    const [panelFocusSymbol, setPanelFocusSymbol] = useState<symbol | null>(null)

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
        return createElement(ComponentContainer)
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

export default useTabsPanelStateManager