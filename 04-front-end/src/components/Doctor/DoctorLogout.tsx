import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { saveAuthToken, saveRefreshToken } from '../../api/api';
import EventRegister from '../../api/EventRegister';

class DoctorLogoutState {
    logoutDone: boolean = false;
}

export default class DoctorLogout extends Component {
    state: DoctorLogoutState;

    constructor(props: any) {
        super(props);

        this.state = {
            logoutDone: false
        };
    }

    componentDidMount() {
        saveAuthToken("doctor", "");
        saveRefreshToken("doctor", "");

        this.setState({
            logoutDone: true
        });

        EventRegister.emit("AUTH_EVENT", "doctor_logout");
    }

    render() {
        if (this.state.logoutDone) {
            return (
                <Redirect to="/doctor/login" />
            );
        }

        return (
            <p>Odjavljujemo vas...</p>
        );
    }
}