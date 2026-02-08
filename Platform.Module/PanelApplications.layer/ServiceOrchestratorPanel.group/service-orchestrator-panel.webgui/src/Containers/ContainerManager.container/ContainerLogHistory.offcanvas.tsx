import * as React from "react"
import { useEffect, useState, useRef} from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import GetAPI from "../../Utils/GetAPI"


import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { WebLinksAddon } from "xterm-addon-web-links"
import "xterm/css/xterm.css"

const ContainerLogHistoryOffcanvas = ({
    containerId,
    onClose,
    HTTPServerManager,
}) => {

    const terminalRef = useRef(null)
    const term = useRef(null)
    const fitAddon = useRef(null)

    const [loading, setLoading] = useState(false)

    const getContainerManagerAPI = () =>
        GetAPI({
            apiName: "ContainerManager",
            serverManagerInformation: HTTPServerManager,
        })


    useEffect(() => {
        fetchContainerLogs()
    }, [containerId])

    useEffect(() => {
        // Inicializa o terminal apenas uma vez quando o modal é aberto
        if (!term.current) {
            term.current = new Terminal({
                theme: { 
                    background: "#1e1e1e", 
                    foreground: "#e0e0e0",
                    cursor: "#ffffff",
                    cursorAccent: "#1e1e1e"
                },
                // ensure lone LF is treated as EOL so lines break correctly
                convertEol: true,
                fontSize: 13,
                fontFamily: '"Courier New", monospace',
                cursorBlink: true,
                disableStdin: true, // Impede entrada do usuário
                allowTransparency: false,
                scrollback: 5000 // Aumenta o histórico de scroll
            })

            // Adiciona a extensão para links
            term.current.loadAddon(new WebLinksAddon())

            fitAddon.current = new FitAddon()
            term.current.loadAddon(fitAddon.current)
            term.current.open(terminalRef.current)
            fitAddon.current.fit()
        }
    }, [])

    const fetchContainerLogs = async () => {
        setLoading(true)
        try {
            const api = getContainerManagerAPI()
            const response = await api.GetContainerLogHistory({ containerIdOrName: containerId })

            // server now returns { isBase64: boolean, data: string }
            let payload = response.data
            let text = ''

            if (payload && typeof payload === 'object' && payload.isBase64) {
                // decode base64 to UTF-8 preserving raw bytes (ESC sequences)
                const base64 = payload.data
                try {
                    const binary = atob(base64)
                    const bytes = new Uint8Array(binary.length)
                    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
                    text = new TextDecoder('utf-8').decode(bytes)
                } catch (e) {
                    // fallback: attempt simple atob->string
                    try { text = atob(base64) } catch (ee) { text = base64 }
                }
            } else if (payload && typeof payload === 'object' && payload.data) {
                text = String(payload.data)
            } else {
                text = typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
            }

            // convert any literal escaped newlines into real ones
            if (text.indexOf('\\n') !== -1 && text.indexOf('\n') === -1) {
                text = text.replace(/\\r\\n/g,'\r\n').replace(/\\n/g,'\n').replace(/\\r/g,'\r')
            }

            // If ANSI escape sequences were escaped (e.g. "\\u001b[31m"), convert
            // them back to the real ESC char so xterm can render colors. Keep this
            // step for any double-escaped payloads.
            const unescapeAnsi = (s:string) => s
                .replace(/\\u001b/g, '\x1b')
                .replace(/\\x1b/g, '\x1b')
                .replace(/\\033/g, '\x1b')
                .replace(/\\e/g, '\x1b')
                .replace(/\\x1b\\\[/g, '\x1b[')
                .replace(/\\u001b\\\[/g, '\x1b[')

            text = unescapeAnsi(text)

            // Clear previous content and write raw data (preserves ANSI)
            try { term.current.clear() } catch (e) {}
            term.current.write(text)
            // refit and scroll to bottom
            try { fitAddon.current.fit() } catch (e) {}
        } catch (error) {
            console.error("Error showing container logs:", error)
        } finally {
            setLoading(false)
        }
    }

    return <div className="offcanvas offcanvas-end show bg-gray-50" data-bs-backdrop="false" style={{"width":"1500px"}}>
                <div className="offcanvas-header">
                    <div className="row g-3 align-items-center">
                        <div className="col">
                            <h2 className="page-title">Log History</h2>
                        </div>
                        </div>
                    <button type="button" className="btn-close text-reset" onClick={() => onClose()}></button>
                </div>
                <div className="offcanvas-body" style={{ display: 'flex', flexDirection: 'column', overflowY: 'hidden' }}>
                    {loading && <div className="spinner-border"></div>}
                    <div 
                        ref={terminalRef} 
                        style={{ 
                            height: "calc(100vh - 200px)", 
                            width: "100%", 
                            backgroundColor: "#1e1e1e",
                            overflow: 'auto',
                            flex: 1
                        }} 
                    />
                </div>
            </div>
}

const mapDispatchToProps = (dispatch:any) => bindActionCreators({}, dispatch)
const mapStateToProps = ({ HTTPServerManager }:any) => ({ HTTPServerManager })
export default connect(mapStateToProps, mapDispatchToProps)(ContainerLogHistoryOffcanvas)