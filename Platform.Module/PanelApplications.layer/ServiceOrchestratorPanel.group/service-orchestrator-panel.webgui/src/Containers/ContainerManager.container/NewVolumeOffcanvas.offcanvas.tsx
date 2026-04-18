import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { useState } from "react"
import GetAPI from "../../Utils/GetAPI"

const NewVolumeOffcanvas = ({
    onClose,
    HTTPServerManager
}) => {
    const [formData, setFormData] = useState({
        name: '',
        driver: 'local',
        driverOpts: [],
        labels: []
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const addDriverOpt = () => {
        setFormData(prev => ({
            ...prev,
            driverOpts: [...prev.driverOpts, { key: '', value: '' }]
        }))
    }

    const updateDriverOpt = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            driverOpts: prev.driverOpts.map((opt, i) =>
                i === index ? { ...opt, [field]: value } : opt
            )
        }))
    }

    const removeDriverOpt = (index) => {
        setFormData(prev => ({
            ...prev,
            driverOpts: prev.driverOpts.filter((_, i) => i !== index)
        }))
    }

    const addLabel = () => {
        setFormData(prev => ({
            ...prev,
            labels: [...prev.labels, { key: '', value: '' }]
        }))
    }

    const updateLabel = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            labels: prev.labels.map((lab, i) =>
                i === index ? { ...lab, [field]: value } : lab
            )
        }))
    }

    const removeLabel = (index) => {
        setFormData(prev => ({
            ...prev,
            labels: prev.labels.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const driverOptsObj = formData.driverOpts.reduce((acc, opt) => {
                if (opt.key) acc[opt.key] = opt.value
                return acc
            }, {})

            const labelsObj = formData.labels.reduce((acc, lab) => {
                if (lab.key) acc[lab.key] = lab.value
                return acc
            }, {})

            const options = {
                Name: formData.name,
                Driver: formData.driver,
                DriverOpts: driverOptsObj,
                Labels: labelsObj
            }

            const ContainerManagerAPI = GetAPI({
                apiName: "ContainerManager",
                serverManagerInformation: HTTPServerManager,
            })

            await ContainerManagerAPI.CreateNewVolume({ options })
            onClose()
        } catch (err) {
            setError(err.message || 'Error creating volume')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="offcanvas offcanvas-end show bg-gray-50" style={{ width: "600px" }}>
            <div className="offcanvas-header">
                <h2 className="page-title">New Volume</h2>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="offcanvas-body">
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label className="form-label">Volume Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Driver</label>
                        <select
                            className="form-select"
                            name="driver"
                            value={formData.driver}
                            onChange={handleChange}
                        >
                            <option value="local">local</option>
                            <option value="nfs">nfs</option>
                            <option value="tmpfs">tmpfs</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Driver Options</label>

                        {formData.driverOpts.map((opt, index) => (
                            <div key={index} className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Key"
                                    value={opt.key}
                                    onChange={(e) => updateDriverOpt(index, 'key', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Value"
                                    value={opt.value}
                                    onChange={(e) => updateDriverOpt(index, 'value', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeDriverOpt(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={addDriverOpt}
                        >
                            Add Option
                        </button>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Labels</label>

                        {formData.labels.map((lab, index) => (
                            <div key={index} className="input-group mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Key"
                                    value={lab.key}
                                    onChange={(e) => updateLabel(index, 'key', e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Value"
                                    value={lab.value}
                                    onChange={(e) => updateLabel(index, 'value', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => removeLabel(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={addLabel}
                        >
                            Add Label
                        </button>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Volume'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })

export default connect(mapStateToProps, mapDispatchToProps)(NewVolumeOffcanvas)