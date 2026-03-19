import * as React from "react"

import DefaultPage from "../Components/DefaultPage"
import RepositoryHomeContainer from "../Containers/RepositoryHome.container"

const RepositoryHomePage = () =>
    <DefaultPage>
        <div className="page-body">
            <RepositoryHomeContainer/>
        </div>
    </DefaultPage>

export default RepositoryHomePage