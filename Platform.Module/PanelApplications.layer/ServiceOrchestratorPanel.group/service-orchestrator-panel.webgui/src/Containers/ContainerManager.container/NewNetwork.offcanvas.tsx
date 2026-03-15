import * as React from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { useState } from "react"
import GetAPI from "../../Utils/GetAPI"

const NewNetworkOffcanvas = ({
    onClose,
    HTTPServerManager
}) => {
    const [formData, setFormData] = useState({
        name: '',
        driver: 'bridge',
        options: [],
        ipamDriver: 'default',
        ipamConfig: [],
        internal: false,
        attachable: false,
        ingress: false,
        enableIPv6: false,
        labels: [],
        scope: 'local',
        configFrom: '',
        checkDuplicate: false,
        configOnly: false
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { key: '', value: '' }]
        }))
    }

    const updateOption = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((opt, i) => i === index ? { ...opt, [field]: value } : opt)
        }))
    }

    const removeOption = (index) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
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
            labels: prev.labels.map((lab, i) => i === index ? { ...lab, [field]: value } : lab)
        }))
    }

    const removeLabel = (index) => {
        setFormData(prev => ({
            ...prev,
            labels: prev.labels.filter((_, i) => i !== index)
        }))
    }

    const addIpamConfig = () => {
        setFormData(prev => ({
            ...prev,
            ipamConfig: [...prev.ipamConfig, { Subnet: '', IPRange: '', Gateway: '', AuxAddresses: {} }]
        }))
    }

    const updateIpamConfig = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            ipamConfig: prev.ipamConfig.map((config, i) => i === index ? { ...config, [field]: value } : config)
        }))
    }

    const removeIpamConfig = (index) => {
        setFormData(prev => ({
            ...prev,
            ipamConfig: prev.ipamConfig.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const optionsObj = formData.options.reduce((acc, opt) => {
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
                Options: optionsObj,
                IPAM: {
                    Driver: formData.ipamDriver,
                    Config: formData.ipamConfig
                },
                Internal: formData.internal,
                Attachable: formData.attachable,
                Ingress: formData.ingress,
                EnableIPv6: formData.enableIPv6,
                Labels: labelsObj,
                Scope: formData.scope,
                ConfigFrom: formData.configFrom || undefined,
                CheckDuplicate: formData.checkDuplicate,
                ConfigOnly: formData.configOnly
            }

            const ContainerManagerAPI = GetAPI({
                apiName: "ContainerManager",
                serverManagerInformation: HTTPServerManager,
            })

            await ContainerManagerAPI.CreateNewNetwork({ options })
            onClose()
        } catch (err) {
            setError(err.message || 'Error creating network')
        } finally {
            setLoading(false)
        }
    }

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"600px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">New Network</h2>
                        </div>
                    </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onClose()}></button>
                </div>

                <div className="offcanvas-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Network Name</label>
                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Driver</label>
                            <select className="form-select" name="driver" value={formData.driver} onChange={handleChange}>
                                <option value="bridge">bridge</option>
                                <option value="host">host</option>
                                <option value="overlay">overlay</option>
                                <option value="macvlan">macvlan</option>
                                <option value="none">none</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Driver Options</label>
                            {formData.options.map((opt, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input type="text" className="form-control" placeholder="Key" value={opt.key} onChange={(e) => updateOption(index, 'key', e.target.value)} />
                                    <input type="text" className="form-control" placeholder="Value" value={opt.value} onChange={(e) => updateOption(index, 'value', e.target.value)} />
                                    <button type="button" className="btn btn-outline-danger" onClick={() => removeOption(index)}>Remove</button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addOption}>Add Option</button>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">IPAM Driver</label>
                            <input type="text" className="form-control" name="ipamDriver" value={formData.ipamDriver} onChange={handleChange} placeholder="default" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">IPAM Config</label>
                            {formData.ipamConfig.map((config, index) => (
                                <div key={index} className="border p-3 mb-3">
                                    <div className="mb-2">
                                        <input type="text" className="form-control" placeholder="Subnet (e.g., 192.168.1.0/24)" value={config.Subnet} onChange={(e) => updateIpamConfig(index, 'Subnet', e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <input type="text" className="form-control" placeholder="IPRange (optional)" value={config.IPRange} onChange={(e) => updateIpamConfig(index, 'IPRange', e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <input type="text" className="form-control" placeholder="Gateway (e.g., 192.168.1.1)" value={config.Gateway} onChange={(e) => updateIpamConfig(index, 'Gateway', e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <textarea className="form-control" placeholder="AuxAddresses (JSON object)" value={JSON.stringify(config.AuxAddresses)} onChange={(e) => {
                                            try {
                                                updateIpamConfig(index, 'AuxAddresses', JSON.parse(e.target.value))
                                            } catch {
                                                updateIpamConfig(index, 'AuxAddresses', {})
                                            }
                                        }} rows={2} />
                                    </div>
                                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeIpamConfig(index)}>Remove Config</button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addIpamConfig}>Add IPAM Config</button>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Labels</label>
                            {formData.labels.map((lab, index) => (
                                <div key={index} className="input-group mb-2">
                                    <input type="text" className="form-control" placeholder="Key" value={lab.key} onChange={(e) => updateLabel(index, 'key', e.target.value)} />
                                    <input type="text" className="form-control" placeholder="Value" value={lab.value} onChange={(e) => updateLabel(index, 'value', e.target.value)} />
                                    <button type="button" className="btn btn-outline-danger" onClick={() => removeLabel(index)}>Remove</button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={addLabel}>Add Label</button>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Scope</label>
                            <select className="form-select" name="scope" value={formData.scope} onChange={handleChange}>
                                <option value="local">local</option>
                                <option value="swarm">swarm</option>
                                <option value="global">global</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Config From</label>
                            <input type="text" className="form-control" name="configFrom" value={formData.configFrom} onChange={handleChange} />
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="internal" checked={formData.internal} onChange={handleChange} />
                            <label className="form-check-label">Internal</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="attachable" checked={formData.attachable} onChange={handleChange} />
                            <label className="form-check-label">Attachable</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="ingress" checked={formData.ingress} onChange={handleChange} />
                            <label className="form-check-label">Ingress</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="enableIPv6" checked={formData.enableIPv6} onChange={handleChange} />
                            <label className="form-check-label">Enable IPv6</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="checkDuplicate" checked={formData.checkDuplicate} onChange={handleChange} />
                            <label className="form-check-label">Check Duplicate</label>
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" name="configOnly" checked={formData.configOnly} onChange={handleChange} />
                            <label className="form-check-label">Config Only</label>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Network'}
                        </button>
                    </form>
                </div>
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(NewNetworkOffcanvas)