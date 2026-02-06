import * as React from "react"

const START_ICON     = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const STOP_ICON      = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>
const SETTINGS_ICON  = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-world-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 12a9 9 0 1 0 -8.979 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.9" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a16.992 16.992 0 0 1 2.522 10.376" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>

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
        case "CREATED":
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

const ServiceDetails = ({
    serviceIdSelected,
    servicesList,
    onSelectService,
    onStartService,
    onStopService
}) => {
    return <div className="py-4">
        <div className="card">
            <div className="table-responsive">
                <table className="table table-vcenter card-table table-striped">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th><strong>Service</strong> ID | Name</th>
                            <th><strong>Package</strong> ID | Name | Type</th>
                            <th><strong>Repository</strong> ID | Namespace</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            servicesList.map((provisionedService, index) => (
                                <tr key={index} className="cursor-pointer" style={serviceIdSelected === provisionedService.serviceId ? {border: "2px solid #9f9f9f"} : {}} onClick={() => onSelectService(provisionedService.serviceId)}>
                                    <td><span className={`${GetStatusBadgeClasses(provisionedService.status)} me-2`}>{provisionedService.status}</span></td>
                                    <td>{provisionedService.serviceId} | {provisionedService.serviceName}</td>
                                    <td className="text-secondary">{provisionedService.originPackageId} | {provisionedService.originPackageName} | {provisionedService.originPackageType}</td>
                                    <td className="text-secondary">{provisionedService.originRepositoryId} | {provisionedService.originRepositoryNamespace}</td>
                                    <td>
                                        {
                                            ( provisionedService.status === "STOPPED"
                                            || provisionedService.status === "TERMINATED" )
                                            && <button className="btn btn-primary" onClick={() => onStartService(provisionedService.serviceId)}>
                                                    {START_ICON}start
                                                </button>
                                        }
                                        {
                                            provisionedService.status === "RUNNING"
                                            && <>
                                                    <button className="btn btn-danger" onClick={() => onStopService(provisionedService.serviceId)}>
                                                        {STOP_ICON}stop
                                                    </button>
                                                </>
                                        }
                                    </td>
                                    <td>
                                        <a className="btn btn-sencondary" href={`#/my-services/service-settings/${provisionedService.serviceId}`}>
                                            {SETTINGS_ICON}settings
                                        </a>
                                    </td>
                                </tr>))
                        }
                        
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}


export default ServiceDetails