import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"

const ImportedRepositoriesOffcanvas = ({
    namespaceId,
    namespace,
    onClose,
    onUpdateRespository,
    HTTPServerManager,
}) => {

    const [ repositories, setRepositories ] = useState<any>([])

    useEffect(() => {
        fetchImportedRepositoriesData()
    }, [namespaceId])


    const getRepositoryServiceManagerAPI = () =>
		GetAPI({
			apiName: "RepositoryServiceManager",
			serverManagerInformation: HTTPServerManager
		})

	const fetchImportedRepositoriesData = async () => {
        setRepositories([])
		const api = getRepositoryServiceManagerAPI()
		const response = await api.ListRepositories({ namespaceId })
        setRepositories(response.data)
	}

    const getRecentRepositoryImported = () => { 
        const [ recentRepositoryImported ] = repositories
        return recentRepositoryImported
    }


    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">{namespace}</h2>
                        </div>
                        </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onClose()}></button>
                </div>
                <div className="offcanvas-body">
                    <div className="table-responsive bg-gray-100">
                        <table className="table table-vcenter card-table">
                            <thead>
                                <tr>
                                    <th className="p-1" >imported at</th>
                                    <th className="p-1" >source type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    repositories
                                    .map(({
                                        id,
                                        sourceType,
                                        createdAt
                                    }) => 
                                        <tr>
                                            <td className="p-1"><strong>{createdAt}</strong></td>
                                            <td className="p-1">{sourceType}</td>
                                        </tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="btn-list justify-content-end mt-3">
                        <a className="btn btn-outline-purple" onClick={() => onUpdateRespository(getRecentRepositoryImported())}>
                            update repository
                        </a>
                    </div>
                </div>
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ImportedRepositoriesOffcanvas)