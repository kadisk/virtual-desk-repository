
import React from "react"

const GetStatusBadgeClasses = (status: string) => {
    switch (status) {
        case "running":
            return "badge bg-green-lt text-green"
        case "exited":
            return "badge bg-red-lt text-red"
        default:
            return "badge bg-orange-lt text-orange"
    }
}

const ContainerTable = ({
    containers,
    onRemoveContainer,
    onStopContainer, 
    onStartContainer,
    onShowContainerLogHistory
    }) => <div className="table-responsive">
                                <table className="table table-vcenter card-table table-striped">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>State | Status</th>
                                            <th>Name | Image</th>
                                            <th>Network</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            containers.map(({
                                                State,
                                                Status,
                                                Id,
                                                Names,
                                                Image,
                                                NetworkSettings: {Networks},
                                                Command
                                            }) =>
                                            <tr>
                                                <td>
                                                    <button className="btn btn-azure btn-sm">
                                                        more details
                                                    </button>
                                                </td>
                                                <td>
                                                    <div className="flex-fill">
                                                        <span className={GetStatusBadgeClasses(State)}>{State}</span>
                                                        <div>{Status}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex-fill">
                                                        <div>{Names[0]}</div>
                                                        <div className="text-secondary"><strong>Image </strong>{Image}</div>
                                                        <code>
                                                            {Command}
                                                        </code>
                                                        <div className="btn-list justify-content-end mt-2">

                                                            <button className="btn btn-sm btn-primary" onClick={() => onShowContainerLogHistory(Id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logs"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12h.01" /><path d="M4 6h.01" /><path d="M4 18h.01" /><path d="M8 18h2" /><path d="M8 12h2" /><path d="M8 6h2" /><path d="M14 6h6" /><path d="M14 12h6" /><path d="M14 18h6" /></svg> log history
                                                            </button>
                                                            {
                                                                State === "exited"
                                                                && <button className="btn btn-sm btn-primary" onClick={() => onStartContainer(Id)}>
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>start
                                                                </button>
                                                            }
                                                            {
                                                                State === "exited"
                                                                && <button className="btn btn-sm btn-danger" onClick={() => onRemoveContainer(Id)}>
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>delete
                                                                </button>
                                                            }
                                                            {
                                                                State === "running"
                                                                && <button className="btn btn-sm btn-yellow">
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>pause
                                                                </button>
                                                            }
                                                            {
                                                                State === "running"
                                                                && <button className="btn btn-sm btn-orange">
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-refresh"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>restart
                                                                </button>
                                                            }
                                                            {
                                                                State === "running"
                                                                && <button className="btn btn-sm btn-orange" onClick={() => onStopContainer(Id)}>
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>stop
                                                                </button>
                                                            }
                                                            {
                                                                State === "running"
                                                                && <button className="btn btn-sm btn-danger">
                                                                    <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cancel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M18.364 5.636l-12.728 12.728" /></svg>kill
                                                                </button>
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex-fill">
                                                        {
                                                            Object.keys(Networks)
                                                            .map( networkName => {
                                                                return <>
                                                                    <div><strong>Network</strong> {networkName}</div>
                                                                    {Networks[networkName].IPAddress && <div><strong>IP</strong> {Networks[networkName].IPAddress}</div>}
                                                                    {Networks[networkName].Gateway && <div className="text-secondary"><strong>Gateway</strong> {Networks[networkName].Gateway}</div>}
                                                                    {Networks[networkName].MacAddress && <div className="text-secondary"><strong>MAC</strong> {Networks[networkName].MacAddress}</div>}
                                                                </>
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    
                                                </td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>

export default ContainerTable