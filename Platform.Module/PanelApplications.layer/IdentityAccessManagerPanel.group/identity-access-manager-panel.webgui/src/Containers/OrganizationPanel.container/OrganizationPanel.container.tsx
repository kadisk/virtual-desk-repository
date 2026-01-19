import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

import CreateOrganizationModal from "./CreateOrganization.modal"


const OrganizationPanelContainer = ({ HTTPServerManager }) => {

    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = React.useState(false)

    const [organizations, setOrganizations] = useState([])

    useEffect(() => {

        FetchOrganizations()

    }, [])

    const GetOrganizationsAPI = () =>
        GetAPI({
            apiName: "Organizations",
            serverManagerInformation: HTTPServerManager
        })

    const FetchOrganizations = async () => {
        const api = GetOrganizationsAPI()
        try {
            const response = await api.ListOrganizations()
            setOrganizations(response.data)
        } catch (error) {
            console.log("Error fetching organizations:", error)
        }
    }

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
                                    <th>status</th>
                                    <th>updated at</th>
                                    <th>created at</th>
                                    <th className="w-1"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    organizations.map((org, index) =>
                                        <tr key={index}>
                                            <td className="text-secondary">{org.name}</td>
                                            <td className="text-secondary">{org.status}</td>
                                            <td className="text-secondary">{org.updatedAt}</td>
                                            <td className="text-secondary">{org.createdAt}</td>
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

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationPanelContainer)