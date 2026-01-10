
import OrganizationPanelContainer from "../Containers/OrganizationPanel.container"
import AccountPanelContainer from "../Containers/AccountsPanel.container/AccountPanel.container"
import UserPanelContainer from "../Containers/UserPanel.container"

import * as PanelSymbols from "../Symbols/Tabs.symbols"

export default {
    [PanelSymbols.ORGANIZATION_PANEL]     : { name: "Organizations",   ComponentContainer:OrganizationPanelContainer },
    [PanelSymbols.ACCOUNT_PANEL]          : { name: "Accounts",        ComponentContainer:AccountPanelContainer },
    [PanelSymbols.USER_PANEL]             : { name: "Users",           ComponentContainer:UserPanelContainer },
    [PanelSymbols.SERVICE_IDENTITY_PANEL] : { name: "Service Identity", },
    [PanelSymbols.DEVICE_PANEL]           : { name: "Devices",          },
    [PanelSymbols.ROLE_PANEL]             : { name: "Roles",            },
    [PanelSymbols.PERMISSION_PANEL]       : { name: "Permissions",      },
    [PanelSymbols.POLICY_PANEL]           : { name: "Policies",         },
}