
import * as React from "react"
import CreatePermissionModal from "./CreatePermission.modal"

import PERMISSIONS from "./PERMISSIONS.mock"

const PermissionPanelContainer = () => {

    const [isCreateDeviceModalOpen, setIsCreateDeviceModalOpen] = React.useState(false)

    return <>
            {isCreateDeviceModalOpen && <CreatePermissionModal onClose={() => setIsCreateDeviceModalOpen(false)} />}
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
                                    <th>namespace</th>
                                    <th>action</th>
                                    <th>description</th>
                                    <th>created_at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    PERMISSIONS.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.id}</td>
                                            <td className="text-secondary">{org.namespace}</td>
                                            <td className="text-secondary">{org.action}</td>
                                            <td className="text-secondary">{org.description}</td>
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