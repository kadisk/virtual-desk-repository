
import * as React from "react"
import CreateOrganizationModal from "./CreateOrganization.modal"

import ORGANIZATIONS from "./ORGANIZATIONS.mock"

const OrganizationPanelContainer = () => {

    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = React.useState(false)

    return <>
            {isCreateOrgModalOpen && <CreateOrganizationModal onClose={() => setIsCreateOrgModalOpen(false)} />}
            <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                <div className="card-header">
                    <div className="row w-full">
                        <div className="col"></div>
                        <div className="col-md-auto col-sm-12">
                            <div className="ms-auto d-flex flex-wrap btn-list">
                                <button className="btn btn-orange" onClick={() => setIsCreateOrgModalOpen(true)}>New Organization</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-table">
                    <div className="table-responsive">
                        <table className="table table-vcenter card-table table-striped">
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>type</th>
                                    <th>description</th>
                                    <th>status</th>
                                    <th>created_at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ORGANIZATIONS.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.name}</td>
                                            <td className="text-secondary">{org.segment}</td>
                                            <td className="text-secondary">{org.description}</td>
                                            <td className="text-secondary">
                                                <label className="form-check form-switch form-switch-3">
                                                    <input className="form-check-input" type="checkbox" checked/>
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


export default OrganizationPanelContainer