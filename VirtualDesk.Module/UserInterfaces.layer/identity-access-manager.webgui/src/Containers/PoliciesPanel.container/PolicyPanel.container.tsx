
import * as React from "react"
import CreatePolicyModal from "./CreatePolicy.modal"

import POLICIES from "./POLICIES.mock"

const PermissionPanelContainer = () => {

    const [isCreateDeviceModalOpen, setIsCreateDeviceModalOpen] = React.useState(false)

    return <>
            {isCreateDeviceModalOpen && <CreatePolicyModal onClose={() => setIsCreateDeviceModalOpen(false)} />}
            <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                <div className="card-header">
                    <div className="row w-full">
                        <div className="col"></div>
                        <div className="col-md-auto col-sm-12">
                            <div className="ms-auto d-flex flex-wrap btn-list">
                                <button className="btn btn-orange" onClick={() => setIsCreateDeviceModalOpen(true)}>New Permission</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-table">
                    <div className="table-responsive">
                        <table className="table table-vcenter card-table table-striped">
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th>effect</th>
                                    <th>priority</th>
                                    <th>resource pattern</th>
                                    <th>condition expression</th>
                                    <th>resource pattern</th>
                                    <th>status</th>
                                    <th>created_at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    POLICIES.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.id}</td>
                                            <td className="text-secondary">{org.name}</td>
                                            <td className="text-secondary">{org.effect}</td>
                                            <td className="text-secondary">{org.priority}</td>
                                            <td className="text-secondary">{org.resource_pattern}</td>
                                            <td className="text-secondary">{org.condition_expression && JSON.stringify(org.condition_expression)}</td>
                                            <td className="text-secondary">{org.resource_pattern}</td>
                                            <td className="text-secondary">
                                                <label className="form-check form-switch form-switch-3">
                                                    <input className="form-check-input" type="checkbox" checked={org.status === "Active"}/>
                                                </label>    
                                            </td>
                                            <td className="w-1">
                                                <a className="btn btn-sm btn-link">Edit</a>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    </>
}


export default PermissionPanelContainer