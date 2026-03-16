import React from "react"


const ImagesTable = ({ images, onViewImageDetails }) => <div className="table-responsive">
    <table className="table table-vcenter card-table table-striped">
        <thead>
            <tr>
                <th>RepoTags</th>
                <th>Id</th>
                <th>Created</th>
                <th>Size</th>
            </tr>
        </thead>
        <tbody>
            {images.map((image, idx) => (
                <tr className="cursor-pointer" onClick={() => onViewImageDetails(image.Id)} key={image.Id || idx}>
                    <td data-label="RepoTags" style={{ verticalAlign: "top", wordBreak: "break-all" }}>
                        {Array.isArray(image.RepoTags) && image.RepoTags.length > 0
                            ? image.RepoTags.map((tag, i) => (
                                <div key={i} style={{ background: "#e3f2fd", borderRadius: 4, padding: "2px 6px", marginBottom: 2, display: "inline-block", color: "#1565c0" }}>{tag}</div>
                            ))
                            : <span className="text-muted">-</span>
                        }
                    </td>
                    <td data-label="Id" style={{ verticalAlign: "top", fontFamily: "monospace", fontSize: "0.97em", color: "#444", wordBreak: "break-all" }}>
                        {image.Id}
                    </td>
                    <td>
                        {image.Created ? new Date(image.Created * 1000).toLocaleString() : "-"}
                    </td>
                    <td data-label="Size" style={{ verticalAlign: "top", whiteSpace: "nowrap", fontWeight: 500 }}>
                        {image.Size >= 1024 * 1024 * 1024
                            ? `${(image.Size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                            : `${(image.Size / (1024 * 1024)).toFixed(2)} MB`
                        }
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

export default ImagesTable