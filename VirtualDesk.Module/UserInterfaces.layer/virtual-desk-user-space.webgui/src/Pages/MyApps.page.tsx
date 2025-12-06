import * as React from "react"

import BlankPage from "../Components/BlankPage"

//@ts-ignore
import logoMyApps from "../../Assets/logo-my-apps.svg"

const MyAppsPage = () =>
    <BlankPage>
        <>
            <nav className="navbar navbar-expand-lg bg-azure-lt fixed-top" style={{ zIndex: 9999 }}>
                <div className="container-fluid">
                    <div className="navbar-brand d-flex align-items-center p-0">
                        <img src={logoMyApps} width={150} className="me-2" />
                    </div>
                </div>
            </nav>
        </>
    </BlankPage>

export default MyAppsPage