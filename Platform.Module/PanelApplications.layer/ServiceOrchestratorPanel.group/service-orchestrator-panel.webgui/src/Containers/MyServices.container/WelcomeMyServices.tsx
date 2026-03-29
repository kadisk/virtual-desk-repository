import * as React from "react"

const WelcomeMyServices = () => {
    return (
        <div className="container-xl">
            <div className="empty">
                <h1 className="empty-title">No repositories found</h1>

                <p className="empty-subtitle text-secondary">
                    No repository is currently available for this workspace.
                </p>

                <p className="empty-subtitle text-secondary">
                    To import and configure a new repository, you must use the{" "}
                    <a
                        href="http://repository-manager-panel.app.local:9000/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Repository Manager
                    </a>.
                </p>
            </div>
        </div>
    )
}

export default WelcomeMyServices