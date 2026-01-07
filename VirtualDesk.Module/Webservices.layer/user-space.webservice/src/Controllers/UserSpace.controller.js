
const LIST_APPS = [
    {
        title: "My Apps",
        description: "Gerencie e Hospede seus Apps",
        link: "/my-apps-panel"
    },
    {        
        title: "Identity Access Manager",
        description: "Crie novos usuários, gerencie permissões e regras",
        link: "/identity-access-manager"
    },
    {
        title: "Virtual Desk Control Panel",
        description: "Controle avançado plataforma",
        link: "http://virtualdesk.app.local:9000/"

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


const UserSpaceController = (params) => {

    const ListMyApps = ({ authenticationData }) => {
        const { userId, username } = authenticationData
        return LIST_APPS
    }

    const controllerServiceObject = {
        controllerName   : "UserSpaceController",
        ListMyApps
    }

    return Object.freeze(controllerServiceObject)
}

module.exports = UserSpaceController