import * as React             from "react"
import {useEffect, useState}  from "react"
import { connect }            from "react-redux"
import { bindActionCreators } from "redux"

import DefaultPage from "../Components/DefaultPage"

import GetAPI from "../Utils/GetAPI"

const UserPanelPage = ({ HTTPServerManager }) => {

    const [ appList, setAppList ] = useState([])

    useEffect(() => {
        fetchMyApp()
    }, [])

    const _GetUserSpaceAPI = () => 
        GetAPI({ 
            apiName:"UserSpace",  
            serverManagerInformation: HTTPServerManager
        })

    const fetchMyApp = async () => {
        setAppList([])
        const api = _GetUserSpaceAPI()
        const response = await api.ListMyApps()
        setAppList(response.data)
    }

    return <DefaultPage>
                <div className="page-body">
                    <div className="container-xl">
                        <div className="row row-cards">
                            {
                                appList
                                .map(({ title, description, link }, index) =>
                                    <div className="col-md-6 col-lg-3" key={index}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div><strong><a href={link}>{title}</a></strong></div>
                                                <div>{description}</div>
                                            </div>
                                        </div>
                                    </div>)      
                            }
                        </div>
                    </div>
                </div>
            </DefaultPage>
}
    




const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)

const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(UserPanelPage)
