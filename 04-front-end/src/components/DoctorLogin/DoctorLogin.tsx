import React from 'react'
import BasePage from '../BasePage/BasePage';

import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import EventRegister from '../../api/EventRegister';
import AuthService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';

class DoctorLoginState {
    email: string = "";
    password: string = "";
    message: string = "";
    isLoggedIn: boolean = false;
}

export default class DoctorLogin extends BasePage<{}> {
    state: DoctorLoginState;

    constructor(props: any) {
        super(props);

        this.state = {
            email: "",
            password: "",
            message: "",
            isLoggedIn: false
        };
    }

    componentDidMount() {
        EventRegister.on("AUTH_EVENT", this.handleAuthEvent.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.handleAuthEvent.bind(this));
    }

    private handleAuthEvent(status: string, data: any) {

        if (status === "doctor_login_failed") {
            if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/email") {
                return this.setState({
                    message: "E-adresa nije ispravna ili ne ispunjava ograničenja"
                });
            }

            if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/password") {
                return this.setState({
                    message: "Lozinka nije ispravna ili ne ispunjava ograničenja"
                });
            }

            if (data?.status === 404) {
                return this.setState({
                    message: "Korisnik nije pronađen, pokušajte ponovo"
                });
            }

            if (data === "Pogrešna uloga korisnika") {
                return this.setState({
                    message: "Uneti parametri su pogrešni ili nemate pristup sistemu!"
                });
            }
        }
        if (status === "doctor_login") {
            return this.setState({
                email: "",
                password: "",
                message: "",
                isLoggedIn: true
            });
        }
    }

    renderMain(): JSX.Element {
        if (this.state.isLoggedIn) {
            return (
                <Redirect to="/dashboard/category" />
            );
        }

        return (
            <Row>
                <Col sm={12} md={ { span: 6, offset: 3 } } lg={ { span: 4, offset: 4 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <b>Prijavite se kao doktor</b>
                            </Card.Title>
                            <Card.Text as="div">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control 
                                            type="email"
                                            placeholder="Unesite Vašu adresu e-pošte"
                                            value={this.state.email}
                                            onChange={ this.onChangeInput("email") } />
                                    </Form.Group>
                                        <Form.Label>Lozinka</Form.Label>
                                        <Form.Control 
                                            type="password"
                                            placeholder="Unesite Vašu lozinku"
                                            value={this.state.password}
                                            onChange={ this.onChangeInput("password") } />
                                    <Form.Group>    
                                        <Button variant="primary" className="mt-3"
                                            onClick={ () => this.handleLoginButtonClick() }>
                                            Prijavite se
                                        </Button>
                                    </Form.Group>
                                    { this.state.message && <p className="mt-3">{ this.state.message }</p> }
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }


    private onChangeInput(field: "email" | "password"): 
        (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value
            });
        }
    }

    private handleLoginButtonClick() {
        AuthService.attemptDoctorLogin(this.state.email, this.state.password);
    }

}
