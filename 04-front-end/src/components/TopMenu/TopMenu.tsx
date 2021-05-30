import React from 'react';

import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TopMenu() {
    return (
        <Nav fill variant="tabs" className="justify-content-center">
            <Nav.Item>
                <Link className="nav-link" to="/">
                    Početna strana
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="nav-link" to="/category">
                    Kategorije usluga
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="nav-link" to="/patient">
                    Pacijenti
                </Link>
            </Nav.Item>
            <Nav.Item>
                <Link className="nav-link" to="/profile">
                    Moj nalog
                </Link>
            </Nav.Item>            
        </Nav>        
    );
}
