import * as React from "react"

import DefaultPage from "../Components/DefaultPage"

const UserPanelPage = () =>
    <DefaultPage>
        <div className="page-body">
            <div className="container-xl">
                <div className="row row-cards">
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <div><strong><a href="#my-apps">My Apps</a></strong></div>
                            <div>Gerencie e Hospede seus Apps</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <h3 className="card-title"><strong>Identity Access Manager</strong></h3>
                            <div>Crie novos usuários, gerencie permissões e regras</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <h3 className="card-title"><strong>Virtual Desk Control Panel</strong></h3>
                            <div>Controle avançado plataforma</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <div><strong><a href="http://kadisk.com.local">Portal KADISK</a></strong></div>
                            <div>Portal da KADISK Engenharia de Software</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <div><strong><a href="http://worms.solutions.local">worms.solutions</a></strong></div>
                            <div>Portal da Empresa Worms Solutions</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <h3 className="card-title"><strong>Engineering 3D Viewer</strong></h3>
                            <div>Sistema de visualização trimensional focada em engenharia</div>
                        </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                        <div className="card">
                        <div className="card-body">
                            <div><strong><a href="http://chadodante.shop.local">chadodante.shop</a></strong></div>
                            <div>Portal de Chá de Bebe</div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultPage>

export default UserPanelPage