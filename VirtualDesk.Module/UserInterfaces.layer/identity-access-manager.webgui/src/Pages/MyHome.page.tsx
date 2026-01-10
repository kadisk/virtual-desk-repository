
import * as React from "react"

import BlankPage from "../Components/BlankPage"

//@ts-ignore
import logoIAM from "../../Assets/logo-IAM-final-2.svg"

import IAMHomePanelContainer from "../Containers/IAMHomePanel.container"    

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