
import * as React from "react"
import CreateAccountModal from "./CreateAccount.modal"

import ACCOUNTS from "./ACCOUNTS.mock"

const AccountPanelContainer = () => {

    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = React.useState(false)

    return <>
            {isCreateOrgModalOpen && <CreateAccountModal onClose={() => setIsCreateOrgModalOpen(false)} />}
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
                                    ACCOUNTS.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.id}</td>
                                            <td className="text-secondary">{org.name}</td>
                                            <td className="text-secondary">{org.type}</td>  
                                            <td className="text-secondary">{org.environment}</td>
                                            <td className="text-secondary">{org.isolation_level}</td>
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


export default AccountPanelContainer