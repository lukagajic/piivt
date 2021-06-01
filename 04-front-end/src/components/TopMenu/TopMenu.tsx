import React, { Component } from 'react';

import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import EventRegister from '../../api/EventRegister';

class TopMenuState {
    currentMenuType: "doctor" | "administrator" | "visitor" = "visitor";
}

export default class TopMenu extends Component{
    state: TopMenuState;

    constructor(props: any) {
        super(props);

        this.state = {
            currentMenuType: "visitor"
        };
    }

    componentDidMount() {
        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    private authEventHandler(message: string) {
        if (message === "force_login" || message === "doctor_logout" || message === "administrator_logout") {
            this.setState({
                currentMenuType: "visitor"
            });
        }

        if (message === "doctor_login") {
            this.setState({
                currentMenuType: "doctor"
            });
        }

        if (message === "administrator_login") {
            this.setState({
                currentMenuType: "administrator"
            });
        }
    }

    render(): JSX.Element {
        if (this.state.currentMenuType === "visitor") {
            return (
                <Nav fill variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/doctor/login">
                            Prijavite se kao doktor
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/login">
                            Prijavite se kao administrator
                        </Link>
                    </Nav.Item>
                </Nav>
            );
        }
        
        if (this.state.currentMenuType === "administrator") {
            return (
                <Nav fill variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/">
                            Početna strana
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link className="nav-link" to="/dashbord/visits">
                            Evidencija svih poseta
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/logout">
                            Odjavite se
                        </Link>
                    </Nav.Item>
                </Nav>
            );
        }

        return (
            <Nav fill variant="tabs" className="justify-content-center">
                <Nav.Item>
                    <Link className="nav-link" to="/">
                        Početna strana
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link className="nav-link" to="/dashbord/patients">
                        Moji pacijenti
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link className="nav-link" to="/dashbord/categories">
                        Kategorije usluga klinike
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link className="nav-link" to="/doctor/account">
                        Moj nalog
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link className="nav-link" to="/doctor/logout">
                        Odjavite se
                    </Link>
                </Nav.Item>
            </Nav>
        );        
    }
}
