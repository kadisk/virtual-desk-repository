import * as React from "react"

import DefaultPage from "../Components/DefaultPage"


const LIST_APPS = [
    {
        title: "My Apps",
        description: "Gerencie e Hospede seus Apps",
        link: "#my-apps"
    },
    {        
        title: "Identity Access Manager",
        description: "Crie novos usuários, gerencie permissões e regras",
        link: "#iam"
    },
    {
        title: "Virtual Desk Control Panel",
        description: "Controle avançado plataforma",
        link: "#control-panel"

    },
    {
        title: "Portal KADISK",
        description: "Portal da KADISK Engenharia de Software",
        link: "http://kadisk.com.local"
    }, 
    {
        title: "worms.solutions",
        description: "Portal da Empresa Worms Solutions",
        link: "http://worms.solutions.local"   
    },
    {
        title: "Engineering 3D Viewer",
        description: "Sistema de visualização trimensional focada em engenharia",
        link: "#3d-viewer"
    },  
    {
        title: "chadodante.shop",
        description: "Portal de Chá de Bebe",
        link: "http://chadodante.shop.local"
    }
]

const UserPanelPage = () =>
    <DefaultPage>
        <div className="page-body">
            <div className="container-xl">
                <div className="row row-cards">
                    {
                        LIST_APPS
                        .map(({ title, description, link }, index) =>
                            <div className="col-md-6 col-lg-3" key={index}>
                                <div className="card">
                                    <div className="card-body">
                                        <div><strong><a href={link}>{title}</a></strong></div>
                                        <div>{description}</div>
                                    </div>
                                </div>
                            </div>)      
                    }
                </div>
            </div>
        </div>
    </DefaultPage>

export default UserPanelPage