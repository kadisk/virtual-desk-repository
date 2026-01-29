import * as React from "react"

const START_ICON     = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const RESTART_ICON   = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
const STOP_ICON      = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>
const SETTINGS_ICON  = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -8.979 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.992 16.992 0 0 1 2.522 10.376" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>
const WORLD_OFF_ICON = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.657 5.615a9 9 0 1 0 12.717 12.739m1.672 -2.322a9 9 0 0 0 -12.066 -12.084" /><path d="M3.6 9h5.4m4 0h7.4" /><path d="M3.6 15h11.4m4 0h1.4" /><path d="M11.5 3a17.001 17.001 0 0 0 -1.493 3.022m-.847 3.145c-.68 4.027 .1 8.244 2.34 11.833" /><path d="M12.5 3a16.982 16.982 0 0 1 2.549 8.005m-.207 3.818a16.979 16.979 0 0 1 -2.342 6.177" /><path d="M3 3l18 18" /></svg>


const GetStatusBadgeClasses = (status: string) => {
    switch (status) {
        case "RUNNING":
            return "badge bg-green-lt text-green"
		case "FINISHED":
            return "badge bg-cyan-lt text-cyan"
        case "FAILURE":
            return "badge bg-red-lt text-red"
        case "TERMINATED":
			return "badge bg-gray-lt text-gray"
        case "STOPPED":
			return "badge bg-orange-lt text-orange"
		case "RESTARTING":
		case  "CREATED":
		case "STARTING":
			return "badge bg-azure-lt text-azure"
		case "STOPPING":
			return "badge bg-yellow-lt text-yellow"
		case "WAITING":
		case "LOADING":
            return "badge bg-purple-lt text-purple"
        default:
            return "badge bg-gray-lt text-gray"
    }
}

const ServiceCard = ({
    serviceIdSelected,
    serviceId,
    status,
    onSelectService,
    serviceName,
    originRepositoryNamespace,
    originPackageName,
    originPackageType,
    onStartService,
    onStopService
}) => {

    return <div className={`card card-link mb-3 hover-shadow-lg cursor-pointer ${serviceIdSelected === serviceId ? "border-dark" : ""}`}
                onClick={() => onSelectService(serviceId)}>
                <div className="card-header py-2">
                    <div>
                        <h4 className="card-title"><span className={`${GetStatusBadgeClasses(status)} me-2`}>{status}</span><strong>{serviceName}</strong></h4>
                        <p className="card-subtitle">{originRepositoryNamespace}/{originPackageName}/{originPackageType}</p>
                    </div>
                </div>
                {
                        ( status === "STOPPING" || status === "STARTING" || status === "RESTARTING")
                        &&<div className="card-body">
                                <div className="progress progress-sm">
                                    <div className="progress-bar progress-bar-indeterminate"></div>
                                </div>
                            </div>
                }
                <div className="card-footer bg-blue-lt">
                    <div className="btn-list justify-content-end">
                        {
                            ( status === "STOPPED"
                            || status === "TERMINATED" )
                            && <button className="btn btn-primary" onClick={() => onStartService(serviceId)}>
                                    {START_ICON}start
                                </button>
                        }
                        {
                            status === "RUNNING"
                            && <>
                                    <button className="btn btn-danger" onClick={() => onStopService(serviceId)}>
                                        {STOP_ICON}stop
                                    </button>
                                </>
                        }
                        <a className="btn btn-sencondary" href={`#/my-services/service-settings/${serviceId}`}>
                            {SETTINGS_ICON}settings
                        </a>
                    </div>
                </div>
            </div>
    
}

export default ServiceCard