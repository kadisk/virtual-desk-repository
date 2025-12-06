import * as React from "react"

//@ts-ignore
import logoVirtualDesk2 from "../../Assets/logo-virtual-desk2.svg"


const ICON_USER = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-user"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>

const WelcomeHeader = () => {
    return <header className="navbar navbar-expand-md sticky-top d-print-none">
        <div className="container-xl">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
                <a href=".">
                    <img src={logoVirtualDesk2} width={200} />
                </a>
            </div>
            <div className="navbar-nav flex-row order-md-last"> 
                <div className="nav-item dropdown">
                    <div className="d-none d-xl-block ps-2">
                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                          {ICON_USER}
                        </span>
                        kaio.cezar
                    </div>
                </div>
            </div>
        </div>
    </header>
}

export default WelcomeHeader
