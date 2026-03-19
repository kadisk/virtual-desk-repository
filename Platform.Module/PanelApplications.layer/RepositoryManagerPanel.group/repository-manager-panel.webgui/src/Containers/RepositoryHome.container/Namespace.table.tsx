import * as React from "react"

const NamespaceTable = ({ namespaces }) =>
    <div className="py-4">
        <div className="card">
            <div className="table-responsive">
                <table className="table table-vcenter card-table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Namespace</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            namespaces
                            .map(({id, namespace}) => 
                            <tr>
                                <td className="text-secondary">{id}</td>
                                <td className="text-secondary">{namespace}</td>
                                <td>
                                    <div className="btn-list flex-nowrap">
                                        <button className="btn btn-1">manage</button>
                                    </div>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>

export default NamespaceTable