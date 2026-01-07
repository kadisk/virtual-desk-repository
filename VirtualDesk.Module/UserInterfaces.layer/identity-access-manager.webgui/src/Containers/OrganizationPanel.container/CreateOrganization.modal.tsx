import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

const CreateOrganizationModal = ({
    onClose,
    HTTPServerManager
}) => {

    return <div className="modal modal-blur show" role="dialog" aria-hidden="false" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
        <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Service Provisioning</h5>
                    <button type="button" className="btn-close" onClick={onClose} />
                </div>
                <div className="modal-body">
                    <div className="col-12">
                        <div className="card">{"DFGSFGDFGFG"}</div>
                    </div>
                </div>

                <div className="modal-footer d-flex justify-content-between">
                    <div>
                        <button className="btn btn-link link-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }: any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganizationModal)
