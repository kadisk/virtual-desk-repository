
import * as React from "react"
import CreateServiceIdentityModal from "./CreateServiceIdentity.modal"

import SERVICE_IDENTITY from "./SERVICE_IDENTITY.mock"

const ServiceIdentityPanelContainer = () => {

    const [isCreateDeviceModalOpen, setIsCreateDeviceModalOpen] = React.useState(false)

    return <>
            {isCreateDeviceModalOpen && <CreateServiceIdentityModal onClose={() => setIsCreateDeviceModalOpen(false)} />}
            <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                <div className="card-header">
                    <div className="row w-full">
                        <div className="col"></div>
                        <div className="col-md-auto col-sm-12">
                            <div className="ms-auto d-flex flex-wrap btn-list">
                                <button className="btn btn-orange" onClick={() => setIsCreateDeviceModalOpen(true)}>New Service Identity</button>
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
                                    <th>description</th>
                                    <th>credential_type</th>
                                    <th>status</th>
                                    <th>created_at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    SERVICE_IDENTITY.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.id}</td>
                                            <td className="text-secondary">{org.name}</td>
                                            <td className="text-secondary">{org.description}</td>
                                            <td className="text-secondary">{org.credential_type}</td>
                                            <td className="text-secondary">
                                                <label className="form-check form-switch form-switch-3">
                                                    <input className="form-check-input" type="checkbox" checked={org.status === "Active"}/>
                                                </label>    
                                            </td>
                                            <td className="text-secondary">{org.created_at}</td>
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


export default ServiceIdentityPanelContainer