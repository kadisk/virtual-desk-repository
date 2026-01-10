
import OrganizationPanelContainer from "../Containers/OrganizationPanel.container"
import AccountPanelContainer from "../Containers/AccountsPanel.container/AccountPanel.container"

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

export default {
    [ORGANIZATION_PANEL]     : { name: "Organizations",  ComponentContainer:OrganizationPanelContainer },
    [ACCOUNT_PANEL]          : { name: "Accounts",       ComponentContainer:AccountPanelContainer },
    [USER_PANEL]             : { name: "Users",            },
    [SERVICE_IDENTITY_PANEL] : { name: "Service Identity", },
    [DEVICE_PANEL]           : { name: "Devices",          },
    [ROLE_PANEL]             : { name: "Roles",            },
    [PERMISSION_PANEL]       : { name: "Permissions",      },
    [POLICY_PANEL]           : { name: "Policies",         },
}