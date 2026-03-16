
import React from "react"

const VolumesTable = ({
    volumes,
    onViewVolumeDetails
    }) => <div className="table-responsive">
                                <table className="table table-vcenter card-table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Name | Mount Point</th>
                                            <th>Driver | Scope</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            volumes.map(({
                                                Name,
                                                Mountpoint,
                                                Driver,
                                                Scope,
                                                Labels,
                                                CreatedAt
                                            }) =>
                                            <tr  className="cursor-pointer" onClick={() => onViewVolumeDetails(Name)}>
                                                
                                                <td>
                                                    <div className="flex-fill">
                                                        <div>{Name}</div>
                                                        <div className="text-secondary">{Mountpoint}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex-fill">
                                                        <div><strong>Driver </strong>{Driver}</div>
                                                        <div className="text-secondary"><strong>Scope </strong>{Scope}</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {CreatedAt}
                                                </td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                            </div>

export default VolumesTable