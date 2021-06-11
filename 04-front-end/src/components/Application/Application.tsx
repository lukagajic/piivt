import React, { Component } from 'react';
import './Application.sass';

import { Container } from "react-bootstrap";
import TopMenu from '../TopMenu/TopMenu';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CategoryDashboardList from '../Doctor/Dashboard/Category/CategoryDashboardList';
import DoctorLogin from '../Doctor/DoctorLogin';
import EventRegister from '../../api/EventRegister';
import api from '../../api/api';
import DoctorLogout from '../Doctor/DoctorLogout';
import AdministratorLogin from '../Administrator/AdministratorLogin';
import AdministratorLogout from '../Administrator/AdministratorLogout';
import ServiceDashboardList from '../Doctor/Dashboard/Service/ServiceDashboardList';

class ApplicationState {
  authorizedRole: "doctor" | "administrator" | "visitor" = "visitor";
}
class Application extends Component {
  state: ApplicationState;

  constructor(props: any) {
    super(props);

    this.state = {
      authorizedRole: "visitor"
    };
  }

  componentDidMount() {
    EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    this.checkRole("doctor");
    this.checkRole("administrator");
  }

  componentWillUnmount() {
    EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
  }

  private checkRole(role: "doctor" | "administrator") {
    api("get", "/auth/" + role + "/ok", role)
      .then(res => {
        if (res?.data === "OK") {
          this.setState({
            authorizedRole: role
          });

          EventRegister.emit("AUTH_EVENT", role + "_login");

        }
      })
      .catch(err => {
        // ...
      })
  }

  private authEventHandler(message: string) {
    if (message === "force_login" || message === "doctor_logout" || message === "administrator_logout") {
        this.setState({
          authorizedRole: "visitor"
        });
    }

    if (message === "doctor_login") {
        this.setState({
          authorizedRole: "doctor"
        });
    }

    if (message === "administrator_login") {
        this.setState({
          authorizedRole: "administrator"
        });
    }
  }

  render(): JSX.Element {
    return (
      <BrowserRouter>
        <Container className="Application">
          <div className="Application-header">
              <img className="Application-logo" src="/logo.jpg" alt="E-medic Logo" />
          </div>
  
          <TopMenu currentMenuType={ this.state.authorizedRole } />
  
          <div className="Application-body">
            <Switch>
              <Route path="/dashboard/category" component={CategoryDashboardList} />
              <Route exact path="/dashboard/service" component={ServiceDashboardList} />
              <Route path="/patient">
                Pacijenti
              </Route>
              <Route path="/profile">
                Moj nalog
              </Route>
              <Route path="/doctor/login" component={DoctorLogin} />
              <Route path="/doctor/logout" component={DoctorLogout} />

              <Route path="/administrator/login" component={AdministratorLogin} />
              <Route path="/administrator/logout" component={AdministratorLogout} />
            </Switch>
          </div>
  
          <div>
            <p className="text-center">&copy; { new Date().getFullYear() } - Praktikum Internet i Veb tehnologije</p>
          </div>
        </Container>
      </BrowserRouter>
    );
  }
  
}

export default Application;
