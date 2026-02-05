import * as React from "react"

import DefaultPage from "../Components/DefaultPage"

import ContainerManagerContainer from "../Containers/ContainerManager.container"

const ContainerManagerPage = () => 
	<DefaultPage>
		<div className="page-body mt-1"><ContainerManagerContainer/></div>
	</DefaultPage>


export default ContainerManagerPage
