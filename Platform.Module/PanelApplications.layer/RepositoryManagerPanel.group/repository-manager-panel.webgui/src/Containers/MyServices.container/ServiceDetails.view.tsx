import * as React from "react"

const START_ICON     = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
const STOP_ICON      = <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>
const HEART_MONITOR_ICON  = <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-heart-rate-monitor"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10" /><path d="M7 20h10" /><path d="M9 16v4" /><path d="M15 16v4" /><path d="M7 10h2l2 3l2 -6l1 3h3" /></svg>

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
                            <th></th>
                            <th>Status</th>
                            <th><strong>Service</strong> ID | Name</th>
                            <th><strong>Package</strong> ID | Name | Type</th>
                            <th><strong>Repository</strong> ID | Namespace</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            servicesList.map((provisionedService, index) => (
                                <tr key={index} className="cursor-pointer" style={serviceIdSelected === provisionedService.serviceId ? {border: "2px solid #9f9f9f"} : {}} >
                                    <td>
                                        {
                                            serviceIdSelected !== provisionedService.serviceId
                                            && <button className="btn btn-azure btn-sm" onClick={() => onSelectService(provisionedService.serviceId)}>
                                                    more details
                                                </button>
                                        }
                                    </td>
                                    <td><span className={`${GetStatusBadgeClasses(provisionedService.status)} me-2`}>{provisionedService.status}</span></td>
                                    <td>{provisionedService.serviceId} | {provisionedService.serviceName}</td>
                                    <td className="text-secondary">{provisionedService.originPackageId} | {provisionedService.originPackageName} | {provisionedService.originPackageType}</td>
                                    <td className="text-secondary">{provisionedService.originRepositoryId} | {provisionedService.originRepositoryNamespace}</td>
                                    <td>
                                        {
                                            ( provisionedService.status === "STOPPED"
                                            || provisionedService.status === "TERMINATED" )
                                            && <button className="btn btn-cyan btn-sm" onClick={() => onStartService(provisionedService.serviceId)}>
                                                    {START_ICON}start
                                                </button>
                                        }
                                        {
                                            provisionedService.status === "RUNNING"
                                            && <>
                                                    <button className="btn btn-danger btn-sm" onClick={() => onStopService(provisionedService.serviceId)}>
                                                        {STOP_ICON}stop
                                                    </button>
                                                </>
                                        }
                                        <a className="btn bg-gray-100 btn-sm ms-2" href={`#/my-services/service-settings/${provisionedService.serviceId}`}>
                                            {HEART_MONITOR_ICON} service monitor
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