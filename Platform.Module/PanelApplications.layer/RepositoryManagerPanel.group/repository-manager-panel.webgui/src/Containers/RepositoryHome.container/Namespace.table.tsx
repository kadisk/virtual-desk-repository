import * as React from "react"

const NamespaceTable = ({ 
    namespaces,
    onManageRepository,
}) =>
    <div className="py-4">
        <div className="card">
            <div className="table-responsive">
                <table className="table table-vcenter card-table table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID | Namespace</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            namespaces
                            .map(({id, namespace}) => 
                            <tr>
                                <td>
                                    <button className="btn btn-purple btn-sm" onClick={() => onManageRepository({ id, namespace })}>
                                        manage repository
                                    </button>
                                </td>
                                <td>{id} | {namespace}</td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>

export default NamespaceTable