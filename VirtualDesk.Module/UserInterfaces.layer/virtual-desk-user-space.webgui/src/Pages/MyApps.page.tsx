import * as React from "react"

import BlankPage from "../Components/BlankPage"

//@ts-ignore
import logoMyApps from "../../Assets/logo-my-apps.svg"

const WORLD_ICON = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" /></svg>
const X_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="m-0 icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>

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
            <div className="d-flex" style={{ height: "94vh", overflow: "hidden", marginTop: "56px" }}>
                <aside className="navbar navbar-vertical navbar-expand-lg d-flex flex-column" style={{ width: "auto", position: "relative", overflowY: "auto" }}>
                    <div className="col-12 border-bottom bg-dark-lt">
                        <div className="d-flex justify-content-start align-items-center p-1 bg-dark text-dark-fg">
                            <span className="mb-0 d-flex align-items-center">
                                WEB APPS
                            </span>
                        </div>
                        <div className="p-2">
                            <ul className="list-group">
                                <li className="list-group-item border-0 p-0 cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        <span>{WORLD_ICON} worms.solutions </span>
                                    </div>
                                </li>
                                <li className="list-group-item border-0 p-0 cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        <span>{WORLD_ICON} kadisk.com </span>
                                    </div>
                                </li>
                                <li className="list-group-item border-0 p-0 cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        <span>{WORLD_ICON} engineering-3d-viewer.v-desk.app</span>
                                    </div>
                                </li>
                                <li className="list-group-item border-0 p-0 cursor-pointer">
                                    <div className="d-flex align-items-center">
                                        <span>{WORLD_ICON} chadodante.shop </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
                <div 
                    className="page-wrapper flex-grow-1 d-flex flex-column" 
                    style={{ overflowY: "auto", minWidth: 0, paddingTop: ".5rem", margin: 0 }}>
                        <div className="container-fluid flex-grow-1 d-flex p-0">
                            <div className="row flex-grow-1 m-0">
                                <div className="col-12 p-0">
                                    <div className="px-3 d-flex align-items-start">
           
                                        <div className="col">
                                        </div>
                                        <div className="col-auto ms-auto d-print-none">
                                            <div className="btn-list">
                                                <span className="d-none d-sm-inline">
                                                    <button className="btn btn-indigo">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                                                        Publish Web App
                                                    </button>
                                                </span>
                                                <button className="btn btn-outline-indigo">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M17 16v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" /></svg>
                                                    Manager your Repos
                                                </button>
                                            </div>
                                        </div>
                    
                                    </div>
                                    <div className="d-flex align-items-start" style={{ gap: "1rem" }}>
                                        <div className="m-3 card-tabs d-flex flex-column flex-grow-1" style={{ height: "100%" }}>
                                            <ul className="nav nav-tabs" role="tablist">
                                                <li className="nav-item cursor-pointer">
                                                    <a className={`nav-link py-1 pe-0`}>Publish APP<button className="btn btn-sm btn-link">{X_ICON}</button></a>
                                                </li>
                                            </ul>
                                            <div className="tab-content flex-grow-1 d-flex" style={{ minHeight: 0 }}>
                                                <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="mb-3">
                                                                    <label className="form-label">Subdomain</label>
                                                                    <div className="input-group">
                                                                        <input type="text" className="form-control" placeholder="subdomain"/>
                                                                        <span className="input-group-text"> .v-desk.app </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 mb-3">
                                                                <span className="d-none d-sm-inline">
                                                                    <button className="btn btn-cyan">
                                                                        Configure Package
                                                                    </button>
                                                                </span>
                                                            </div>
                                                            <div className="col-12 mb-3">
                                                                <span className="d-none d-sm-inline">
                                                                    <button className="btn btn-pink">
                                                                        Publish
                                                                    </button>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    </BlankPage>

export default MyAppsPage