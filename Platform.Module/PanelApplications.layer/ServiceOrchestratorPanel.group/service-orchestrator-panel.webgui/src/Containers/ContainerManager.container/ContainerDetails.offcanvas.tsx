import * as React from "react"
import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"


const ContainerDetailsOffcanvas = ({
    containerId,
    onClose,
    HTTPServerManager
}) => {

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">Nome do container</h2>
                        </div>
                    </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onClose()}></button>
                </div>
                <div className="offcanvas-body">
                body        
                </div>
                
            </div>
}


const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ContainerDetailsOffcanvas)