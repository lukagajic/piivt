import React from 'react'
import BasePage from '../BasePage/BasePage';

import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import EventRegister from '../../api/EventRegister';
import AuthService from '../../services/AuthService';
import { Redirect } from 'react-router-dom';

class AdministratorLoginState {
    username: string = "";
    password: string = "";
    message: string = "";
    isLoggedIn: boolean = false;
}

export default class AdministratorLogin extends BasePage<{}> {
    state: AdministratorLoginState;

    constructor(props: any) {
        super(props);

        this.state = {
            username: "",
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

        if (status === "administrator_login_failed") {
            if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/username") {
                return this.setState({
                    message: "Korisničko ime nije ispravno ili ne ispunjava ograničenja"
                });
            }

            if (Array.isArray(data?.data) && data?.data[0]?.instancePath === "/password") {
                return this.setState({
                    message: "Lozinka nije ispravna ili ne ispunjava ograničenja"
                });
            }

            if (data?.status === 404) {
                return this.setState({
                    message: "Administrator nije pronađen, pokušajte ponovo"
                });
            }

            if (data === "Pogrešna uloga korisnika") {
                return this.setState({
                    message: "Uneti parametri su pogrešni ili nemate pristup sistemu!"
                });
            }
        }
        if (status === "administrator_login") {
            return this.setState({
                username: "",
                password: "",
                message: "",
                isLoggedIn: true
            });
        }
    }

    renderMain(): JSX.Element {
        if (this.state.isLoggedIn) {
            return (
                <Redirect to="/administrator/dashboard" />
            );
        }

        return (
            <Row className="mt-3">
                <Col sm={12} md={ { span: 6, offset: 3 } } lg={ { span: 4, offset: 4 } }>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <b>Prijavite se kao administrator</b>
                            </Card.Title>
                            <Card.Text as="div">
                                <Form>
                                    <Form.Group>
                                        <Form.Label>Korisničko ime</Form.Label>
                                        <Form.Control 
                                            type="text"
                                            placeholder="Unesite Vaše korisničko ime"
                                            value={this.state.username}
                                            onChange={ this.onChangeInput("username") } />
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


    private onChangeInput(field: "username" | "password"): 
        (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value
            });
        }
    }

    private handleLoginButtonClick() {
       AuthService.attemptAdministratorLogin(this.state.username, this.state.password);
    }

}
