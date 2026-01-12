
import * as React from "react"
import CreateUserModal from "./CreateDevice.modal"

import DEVICES from "./DEVICES.mock"

const DevicePanelContainer = () => {

    const [isCreateDeviceModalOpen, setIsCreateDeviceModalOpen] = React.useState(false)

    return <>
            {isCreateDeviceModalOpen && <CreateUserModal onClose={() => setIsCreateDeviceModalOpen(false)} />}
            <div className="card tab-pane active show flex-grow-1 d-flex flex-column">
                <div className="card-header">
                    <div className="row w-full">
                        <div className="col"></div>
                        <div className="col-md-auto col-sm-12">
                            <div className="ms-auto d-flex flex-wrap btn-list">
                                <button className="btn btn-orange" onClick={() => setIsCreateDeviceModalOpen(true)}>New Device</button>
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
                                    <th>owner type</th>
                                    <th>device type</th>
                                    <th>platform</th>
                                    <th>model</th>
                                    <th>manufacturer</th>
                                    <th>fingerprint</th>
                                    <th>firmware version</th>
                                    <th>attestation level</th>
                                    <th>trust state</th>
                                    <th>created_at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    DEVICES.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.id}</td>
                                            <td className="text-secondary">{org.owner_type}</td>
                                            <td className="text-secondary">{org.device_type}</td>  
                                            <td className="text-secondary">{org.platform}</td>
                                            <td className="text-secondary">{org.model}</td>
                                            <td className="text-secondary">{org.manufacturer}</td>
                                            <td className="text-secondary">{org.fingerprint}</td>
                                            <td className="text-secondary">{org.firmware_version}</td>
                                            <td className="text-secondary">{org.attestation_level}</td>
                                            <td className="text-secondary">{org.trust_state}</td>
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


export default DevicePanelContainer