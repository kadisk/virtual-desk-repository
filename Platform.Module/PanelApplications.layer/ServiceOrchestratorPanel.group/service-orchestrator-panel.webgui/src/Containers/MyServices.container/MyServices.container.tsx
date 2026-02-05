import * as React from "react"
import { useEffect, useState, useRef } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import qs                     from "query-string"
import { 
	useLocation,
	useNavigate,
	useParams
  } from "react-router-dom"

import GetAPI from "../../Utils/GetAPI"

import WelcomeMyServices from "./WelcomeMyServices"
import ImportRepositoryModal from "./ImportRepository.modal"
import ServiceProvisioningModal from "./ServiceProvisioning.modal"
import NamespaceAndRepositoryManagerModal from "./NamespaceAndRepositoryManager.modal"
import ImportingModal from "./Importing.modal"
import ServiceDetailsOffcanvas from "./ServiceDetails.offcanvas"

import useWebSocket from "../../Hooks/useWebSocket"

import ServiceOverview from "./ServiceOverview.view"
import ServiceDetails from "./ServiceDetails.view"

import QueryParamsActionsCreator    from "../../Actions/QueryParams.actionsCreator"

const DEFAULT_MODE = Symbol()
const IMPORT_SELECT_MODE = Symbol()
const IMPORTING_MODE = Symbol()
const NO_REPOSITORIES_MODE = Symbol()
const LOADING_MODE = Symbol()
const SERVICE_PROVISIONING_MODE = Symbol()
const REPOSITORIES_MANAGER_MODE = Symbol()

const OVERVIEW_TAB = Symbol()
const DETAILS_TAB = Symbol()

const MyServicesContainer = ({
    SetQueryParams,
	QueryParams,
    AddQueryParam,
    HTTPServerManager
}) => {

    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = qs.parse(location.search.substr(1))

    const [importDataCurrent, setImportDataCurrent] = useState<{ repositoryNamespace: string, sourceCodeURL: string }>()
    const [interfaceModeType, changeMode] = useState<any>(LOADING_MODE)
    const [provisionedServicesList, setProvisionedServicesList] = useState([])

    const [serviceIdSelected, setServiceIdSelected] = useState()

    const [tabsCurrent, setTabsCurrent] = useState<any>()

    const provisionedServicesListRef = useRef(provisionedServicesList)

    useEffect(() => {
        if(Object.keys(queryParams).length > 0){
            SetQueryParams(queryParams)
        }
    }, [])

    useEffect(() => {
        const search = qs.stringify(QueryParams)
        navigate({search: `?${search}`})
    }, [QueryParams])


    useEffect(() => {
        
        if(QueryParams.tabView){
            if(QueryParams.tabView === "OVERVIEW_TAB"){
                setTabsCurrent(OVERVIEW_TAB)
            } else if(QueryParams.tabView === "DETAILS_TAB"){
                setTabsCurrent(DETAILS_TAB)
            } 
        }

    }, [QueryParams?.tabView])


    useEffect(() => {
        provisionedServicesListRef.current = provisionedServicesList
    }, [provisionedServicesList])

    useEffect(() => {

        if (interfaceModeType === LOADING_MODE) {
            fetchMyServicesStatus()
        } else if (interfaceModeType === DEFAULT_MODE) {
            fetchProvisionedServices()
        }

    }, [interfaceModeType])

    const _MyServicesAPI = () =>
        GetAPI({
            apiName: "MyServicesManager",
            serverManagerInformation: HTTPServerManager
        })
    const _RepositoryServiceAPI = () =>
        GetAPI({
            apiName: "RepositoryServiceManager",
            serverManagerInformation: HTTPServerManager
        })

    const updateServiceStatus = ({ serviceId, status }) => {
        const listWithStatusUpdated = provisionedServicesListRef.current
            .map((serviceData) => {
                if (parseInt(serviceId) === serviceData.serviceId) {
                    serviceData.status = status
                }
                return serviceData
            })
        setProvisionedServicesList(listWithStatusUpdated)
    }

    useWebSocket({
        socket: _MyServicesAPI().ServicesStatusChange,
        onMessage: updateServiceStatus,
        onConnection: () => { },
        onDisconnection: () => { }
    })

    const fetchMyServicesStatus = async () => {
        const api = _RepositoryServiceAPI()
        const response = await api.CheckRepositoryImported()
        if (response.data === "READY") {
            changeMode(DEFAULT_MODE)
        } else if (response.data === "NO_REPOSITORIES") {
            changeMode(NO_REPOSITORIES_MODE)
        }
    }

    const startService = async (serviceId) => {
        const api = _MyServicesAPI()
        await api.StartService({ serviceId })
    }

    const stopService = async (serviceId) => {
        const api = _MyServicesAPI()
        await api.StopService({ serviceId })
    }

    const fetchProvisionedServices = async () => {
        const api = _MyServicesAPI()
        const response = await api.ListProvisionedServices()
        setProvisionedServicesList(response.data)
    }

    const handleUseFromMyWorkspace = () => {
        console.log("== handleUseFromMyWorkspace")
    }

    const handleStartService = (serviceId) => startService(serviceId)

    const handleStopService = (serviceId) => stopService(serviceId)

    const handleImportingMode = (importData) => {
        setImportDataCurrent(importData)
        changeMode(IMPORTING_MODE)
    }

    const handleFinishedImportModal = () => changeMode(LOADING_MODE)

    const handleSelectService = (serviceId) => setServiceIdSelected(serviceId)

    const handleCloseServiceDetails = () => setServiceIdSelected(undefined)

    return <>
        {
            serviceIdSelected !== undefined
            && <ServiceDetailsOffcanvas
                serviceId={serviceIdSelected}
                onCloseServiceDetails={() => handleCloseServiceDetails()} />
        }
        <div className="container-xl">
            <div className="row g-2 align-items-center">
                <div className="col">
                    <h2 className="page-title">Services</h2>
                </div>
                {
                    interfaceModeType === DEFAULT_MODE
                    && <div className="col-auto ms-auto d-print-none">
                        <div className="btn-list">
                            <span className="d-none d-sm-inline">
                                <button className="btn btn-cyan" onClick={() => changeMode(SERVICE_PROVISIONING_MODE)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-world-upload"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12a9 9 0 1 0 -9 9" /><path d="M3.6 9h16.8" /><path d="M3.6 15h8.4" /><path d="M11.578 3a17 17 0 0 0 0 18" /><path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" /><path d="M18 21v-7m3 3l-3 -3l-3 3" /></svg>
                                    Service provisioning
                                </button>
                            </span>
                            <button className="btn btn-outline-cyan" onClick={() => changeMode(REPOSITORIES_MANAGER_MODE)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 3h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M17 16v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" /></svg>
                                Repository manager
                            </button>
                        </div>
                    </div>
                }
            </div>
            <ul className="nav nav-bordered mb-4">
                <li className="nav-item cursor-pointer">
                    <a className={`nav-link ${tabsCurrent === OVERVIEW_TAB ? "active" : ""}`} onClick={() => AddQueryParam("tabView", "OVERVIEW_TAB")}>Overview</a>
                </li>
                <li className="nav-item cursor-pointer">
                    <a className={`nav-link ${tabsCurrent === DETAILS_TAB ? "active" : ""}`} onClick={() => AddQueryParam("tabView", "DETAILS_TAB")}>Details</a>
                </li>
            </ul>


            {
                tabsCurrent === OVERVIEW_TAB
                && <ServiceOverview
                    servicesList={provisionedServicesList}
                    serviceIdSelected={serviceIdSelected}
                    onSelectService={handleSelectService}
                    onStartService={handleStartService}
                    onStopService={handleStopService} />
            }

            {
                tabsCurrent === DETAILS_TAB
                && <ServiceDetails
                    servicesList={provisionedServicesList}
                    onSelectService={handleSelectService}
                    onStartService={handleStartService}
                    onStopService={handleStopService} />
            }
        </div>
        {
            interfaceModeType === IMPORT_SELECT_MODE
            && <ImportRepositoryModal onImport={handleImportingMode} onClose={() => changeMode(DEFAULT_MODE)} />
        }
        {
            interfaceModeType === SERVICE_PROVISIONING_MODE
            && <ServiceProvisioningModal onClose={() => changeMode(DEFAULT_MODE)} />
        }
        {
            interfaceModeType === REPOSITORIES_MANAGER_MODE
            && <NamespaceAndRepositoryManagerModal onImportNew={() => changeMode(IMPORT_SELECT_MODE)} onClose={() => changeMode(DEFAULT_MODE)} />
        }
        {
            interfaceModeType === NO_REPOSITORIES_MODE
            && <WelcomeMyServices onImportNew={() => changeMode(IMPORT_SELECT_MODE)} onUseFromMyWorkspace={handleUseFromMyWorkspace} />
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
export default connect(mapStateToProps, mapDispatchToProps)(MyServicesContainer)