import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import qs                     from "query-string"
import { 
	useLocation,
	useNavigate,

  } from "react-router-dom"

import GetAPI from "../../Utils/GetAPI"

import WelcomeRepositoryManager from "./WelcomeRepositoryManager"
import ImportRepositoryModal from "./ImportRepository.modal"
import UpdateRepositoryManagerModal from "./UpdateRepositoryManager.modal"
import ImportingModal from "./Importing.modal"
import NamespaceTable from "./Namespace.table"
import ImportedRepositoriesOffcanvas from "./ImportedRepositories.offcanvas"

import QueryParamsActionsCreator    from "../../Actions/QueryParams.actionsCreator"

const DEFAULT_MODE = Symbol()
const IMPORT_SELECT_MODE = Symbol()
const IMPORTING_MODE = Symbol()
const NO_REPOSITORIES_MODE = Symbol()
const LOADING_MODE = Symbol()
const UPDATE_REPOSITORY_MODE = Symbol()

const REPOSITORIES_MANAGER_MODE = Symbol()

const RepositoryHomeContainer = ({
    SetQueryParams,
    RemoveQueryParam,
	QueryParams,
    AddQueryParam,
    HTTPServerManager
}) => {

    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = qs.parse(location.search.substr(1))

    const [importDataCurrent, setImportDataCurrent] = useState<{ repositoryNamespace: string, sourceCodeURL: string }>()
    const [interfaceModeType, changeMode] = useState<any>(LOADING_MODE)
    const [ namespaces, setNamespaces ] = useState([])
    const [ namespaceIdSelected, setNamespaceIdSelected ] = useState<any>()
    const [ namespaceSelected, setNamespaceSelected ] = useState()
    const [ recentRepositoryImported, setRecentRepositoryImported ] = useState()

    useEffect(() => {
        if(Object.keys(queryParams).length > 0){
            SetQueryParams(queryParams)
        }
        FetchNamespaces()
    }, [])

    useEffect(() => {
        const search = qs.stringify(QueryParams)
        navigate({search: `?${search}`})
    }, [QueryParams])


    useEffect(() => {

        if (interfaceModeType === LOADING_MODE) {
            FetchStatus()
        }

    }, [interfaceModeType])


    const _RepositoryServiceAPI = () =>
        GetAPI({
            apiName: "RepositoryServiceManager",
            serverManagerInformation: HTTPServerManager
        })

    const FetchNamespaces = async () => {
        const api = _RepositoryServiceAPI()
        const response = await api.ListNamespaces()
        setNamespaces(response.data)
    }

    const FetchStatus = async () => {
        const api = _RepositoryServiceAPI()
        const response = await api.CheckRepositoryImported()
        if (response.data === "READY") {
            changeMode(DEFAULT_MODE)
        } else if (response.data === "NO_REPOSITORIES") {
            changeMode(NO_REPOSITORIES_MODE)
        }
    }

    const handleImportingMode = (importData) => {
        setImportDataCurrent(importData)
        changeMode(IMPORTING_MODE)
    }

    const handleFinishedImportModal = () => changeMode(LOADING_MODE)

    const handleManageRepository = ({ id, namespace }) => {
        AddQueryParam({ key: "namespace", value: id })
        setNamespaceIdSelected(id)
        setNamespaceSelected(namespace)
        changeMode(REPOSITORIES_MANAGER_MODE)
    }

    const handleCloseImportedRepositories = () => {
        RemoveQueryParam({ key: "namespace" })
        setNamespaceIdSelected(null)
        changeMode(DEFAULT_MODE)
    }

    const handleUpdateRepository = (recentRepositoryImported) => { 
        setRecentRepositoryImported(recentRepositoryImported)
        changeMode(UPDATE_REPOSITORY_MODE)
    }

    return <>
        <div className="container-xl">
            <div className="row g-2 align-items-center">
                {
                    interfaceModeType === DEFAULT_MODE
                    && <div className="col-auto ms-auto d-print-none">
                        <div className="btn-list">
                            <span className="d-none d-sm-inline">
                                <button className="btn btn-outline-purple" onClick={() => changeMode(REPOSITORIES_MANAGER_MODE)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M17 16v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" /></svg>
                                    Repository manager
                                </button>
                            </span>
                            
                            <button className="btn btn-purple" onClick={() => changeMode(IMPORT_SELECT_MODE)}>
                                <svg  xmlns="http://www.w3.org/2000/svg"  width={24}  height={24}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folder-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 19h-7a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v3.5" /><path d="M19 22v-6" /><path d="M22 19l-3 -3l-3 3" /></svg>
                                Import new repository
                            </button>
                        </div>
                    </div>
                }
            </div>
            {
                namespaces
                && namespaces.length > 0
                && <NamespaceTable 
                        namespaces={namespaces} 
                        onManageRepository={handleManageRepository}/>
            }
        </div>

        {
            interfaceModeType === IMPORT_SELECT_MODE
            && <ImportRepositoryModal onImport={handleImportingMode} onClose={() => changeMode(LOADING_MODE)} />
        }

        {
            interfaceModeType === REPOSITORIES_MANAGER_MODE
            && <ImportedRepositoriesOffcanvas 
                                namespaceId={namespaceIdSelected}
                                namespace={namespaceSelected}
                                onClose={() => handleCloseImportedRepositories()} 
                                onUpdateRespository={(recentRepositoryImported) => handleUpdateRepository(recentRepositoryImported)}/>
        }

        {
            interfaceModeType === UPDATE_REPOSITORY_MODE
            && namespaceIdSelected
            && <UpdateRepositoryManagerModal 
                    namespaceId={namespaceIdSelected}
                    namespace={namespaceSelected}
                    recentRepositoryImported={recentRepositoryImported}
                    onClose={() => handleCloseImportedRepositories()} />
        }

        {
            interfaceModeType === NO_REPOSITORIES_MODE
            && <WelcomeRepositoryManager onImportNew={() => changeMode(IMPORT_SELECT_MODE)} />
        }
        {
            interfaceModeType === IMPORTING_MODE
            && <ImportingModal importData={importDataCurrent} onFinishedImport={handleFinishedImportModal} />
        }
        {
            interfaceModeType === LOADING_MODE
            && <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }
    </>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    SetQueryParams    : QueryParamsActionsCreator.SetQueryParams,
    AddQueryParam     : QueryParamsActionsCreator.AddQueryParam,
    RemoveQueryParam  : QueryParamsActionsCreator.RemoveQueryParam
}, dispatch)
const mapStateToProps = ({ HTTPServerManager, QueryParams }: any) => ({
    QueryParams,
    HTTPServerManager
})
export default connect(mapStateToProps, mapDispatchToProps)(RepositoryHomeContainer)