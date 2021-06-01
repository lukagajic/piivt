import React from 'react';
import './Application.sass';

import { Button, Container } from "react-bootstrap";
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from '../HomePage/HomePage';
import CategoryPage from '../CategoryPage/CategoryPage';
import DoctorLogin from '../DoctorLogin/DoctorLogin';

function Application() {
  return (
    <BrowserRouter>
      <Container className="Application">
        <div className="Application-header">
            <img className="Application-logo" src="/logo.jpg" alt="E-medic Logo" />
        </div>

        <TopMenu />

        <div className="Application-body">
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/category" component={CategoryPage} />
            <Route path="/patient">
              Pacijenti
            </Route>
            <Route path="/profile">
              Moj nalog
            </Route>
            <Route path="/doctor/login" component={DoctorLogin} />
          </Switch>
        </div>

        <div>
          <p className="text-center">&copy; { new Date().getFullYear() } - Praktikum Internet i Veb tehnologije</p>
        </div>
      </Container>
    </BrowserRouter>
  );
}

export default Application;
