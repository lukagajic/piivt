import React, { Component } from 'react';

import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

class TopMenuProperties {
    currentMenuType: "doctor" | "administrator" | "visitor" = "visitor";
}

export default class TopMenu extends Component<TopMenuProperties>{
    constructor(props: TopMenuProperties) {
        super(props);
    }

    render(): JSX.Element {
        if (this.props.currentMenuType === "visitor") {
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
        
        if (this.props.currentMenuType === "administrator") {
            return (
                <Nav fill variant="tabs" className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/dashboard/visit">
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
                    <Link className="nav-link" to="/dashboard/category">
                        Kategorije usluga klinike
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link className="nav-link" to="/dashboard/service">
                        Usluge klinike
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link className="nav-link" to="/dashboard/patient">
                        Moji pacijenti
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
