
import OrganizationPanelContainer from "../Containers/OrganizationPanel.container"
import AccountPanelContainer from "../Containers/AccountsPanel.container/AccountPanel.container"
import UserPanelContainer from "../Containers/UserPanel.container"
import DevicePanelContainer from "../Containers/DevicePanel.container"
import ServiceIdentityPanelContainer from "../Containers/ServiceIdentity.container/ServiceIdentityPanel.container"  
import RolePanelContainer from "../Containers/RolesPanel.container/RolePanel.container"
import PermissionPanelContainer from "../Containers/PermissionsPanel.container/PermissionPanel.container"
import PolicyPanelContainer from "../Containers/PoliciesPanel.container"

import * as PanelSymbols from "../Symbols/Tabs.symbols"
import { Component } from "react"

export default {
    [PanelSymbols.ORGANIZATION_PANEL]     : { name: "Organizations",    ComponentContainer:OrganizationPanelContainer },
    [PanelSymbols.ACCOUNT_PANEL]          : { name: "Accounts",         ComponentContainer:AccountPanelContainer },
    [PanelSymbols.USER_PANEL]             : { name: "Users",            ComponentContainer:UserPanelContainer },
    [PanelSymbols.SERVICE_IDENTITY_PANEL] : { name: "Service Identity", ComponentContainer:ServiceIdentityPanelContainer },
    [PanelSymbols.DEVICE_PANEL]           : { name: "Devices",          ComponentContainer:DevicePanelContainer },
    [PanelSymbols.ROLE_PANEL]             : { name: "Roles",            ComponentContainer:RolePanelContainer },
    [PanelSymbols.PERMISSION_PANEL]       : { name: "Permissions",      ComponentContainer:PermissionPanelContainer },
    [PanelSymbols.POLICY_PANEL]           : { name: "Policies",         ComponentContainer:PolicyPanelContainer },
}