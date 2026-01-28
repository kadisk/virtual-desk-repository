import * as React from "react"


const MENU_CONFIG = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-heart-monitor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" /><path d="M4 9h6l1 -2l2 4l1 -2h6" /><path d="M4 14h16" /><path d="M14 17v.01" /><path d="M17 17v.01" /></svg>,
        title: "Services panel",
        href: "#my-services"
    },
    {
        icon: <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-brand-docker"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 12.54c-1.804 -.345 -2.701 -1.08 -3.523 -2.94c-.487 .696 -1.102 1.568 -.92 2.4c.028 .238 -.32 1 -.557 1h-14c0 5.208 3.164 7 6.196 7c4.124 .022 7.828 -1.376 9.854 -5c1.146 -.101 2.296 -1.505 2.95 -2.46z" /><path d="M5 10h3v3h-3z" /><path d="M8 10h3v3h-3z" /><path d="M11 10h3v3h-3z" /><path d="M8 7h3v3h-3z" /><path d="M11 7h3v3h-3z" /><path d="M11 4h3v3h-3z" /><path d="M4.571 18c1.5 0 2.047 -.074 2.958 -.78" /><path d="M10 16l0 .01" /></svg>,
        title:"Container Manager",
        href: "#container-manager"

    }
]

const WelcomeMenu = () => {
    return <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="navbar">
                <div className="container-xl">
                    <ul className="navbar-nav">

                        {
                            MENU_CONFIG
                                .map(({ icon, title, href}) => {

                                    return <li className={`nav-item`}>
                                                <a className={`nav-link`} href={href || "#"}>
                                                    <span className="nav-link-icon d-md-none d-lg-inline-block">{icon}</span>
                                                    <span className="nav-link-title">{title}</span>
                                                </a>
                                            </li>
                                })
                            }
                    </ul>
                </div>
            </div>
        </div>
    </header>
}

export default WelcomeMenu