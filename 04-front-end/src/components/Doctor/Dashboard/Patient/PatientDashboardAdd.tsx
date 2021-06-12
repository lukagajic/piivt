import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import BasePage  from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import PatientService, { IAddPatient } from '../../../../services/PatientService';


interface PatientDashboardAddState {
    forename: string;
    surname: string;
    bornAt: string;
    gender: "male" | "female";
    email: string;
    personalIdentityNumber: string;
    phoneNumber: string;
    address: string;

    genderValues: ("male" | "female")[];

    isDoctorLoggedIn: boolean;
    errorMessage: string;
    message: string;
    redirectBackToPatientList: boolean;
}

export default class PatientDashboardAdd extends BasePage<{}> {
    state: PatientDashboardAddState;

    constructor(props: any) {
        super(props);

        this.state = {
            forename: "",
            surname: "",
            bornAt: "1990-01-01",
            gender: "male",
            email: "",
            personalIdentityNumber: "",
            address: "",
            phoneNumber: "",
            genderValues: [],

            isDoctorLoggedIn: true,
            errorMessage: "",
            message: "",
            redirectBackToPatientList: false
        };
    }

    componentDidMount() {
        this.getGenders();
        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    private getGenders() {
        PatientService.getGenders()
            .then(genders => {
                if (genders.length === 0) {                  
                    return this.setState({
                        genderValues: [],
                        errorMessage: "Došlo je do greške prilikom učitavanja podataka"
                    });
                }
                this.setState({
                    errorMessage: "",
                    genderValues: genders
                });
            });
    }
    
    private authEventHandler(status: string) {
        if (status === "force_login") {
            this.setState({
                isDoctorLoggedIn: false
            });
        }
    }

    private onChangeInput(field: "forename" | "surname" | "bornAt" | "gender" | "email" | "personalIdentityNumber" | "address" | "phoneNumber"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }

    private createSelectOptionGroup(gender: string): JSX.Element {
        return (
            <option key={ "gender-option-" + gender } value={ gender }>
                { gender === "male" ? "Muški" : "Ženski" }
            </option>
        );
    }

    private isFormValid(): boolean {        
        return this.state.forename.length >= 2 && 
        this.state.surname.length >= 2 &&
        this.state.email.length >= 8 &&
        this.state.personalIdentityNumber.length === 13 && 
        (this.state.personalIdentityNumber.match(/^[0-9]{13}$/) ?? false) &&
        this.state.phoneNumber.length >= 5 &&
        this.state.address.length >= 10;
                
               
    }

    private onChangeSelect(field: "gender"): (event: React.ChangeEvent<HTMLSelectElement>) => void {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            this.setState({
                [field]: event.target?.value + "",
            });
        }
    }

    private addButtonClickHandler() {
        console.log('evo nas')
        if (!this.isFormValid()) return;

        const data: IAddPatient = {
            forename: this.state.forename,
            surname: this.state.surname,
            email: this.state.email,
            address: this.state.address,
            bornAt: this.state.bornAt,
            gender: this.state.gender,
            personalIdentityNumber: this.state.personalIdentityNumber,
            phoneNumber: this.state.personalIdentityNumber
        }

        PatientService.addPatient(data)
        .then(res => {
            console.log(res);
            if (res.success === false) {
                this.setState({
                    message: res.message
                });
            } else {
                this.setState({
                    redirectBackToPatientList: true
                });               
            }
        });
    }

    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        if (this.state.errorMessage.length > 0) {
            return (
                <>
                    <p>Nije moguće dodavanje novog pacijenta, jer je došlo do greške prilikom učitavanja...</p>
                    <Link to="dashboard/service/">Vratite se nazad</Link>
                </>
            );
        }

        if (this.state.redirectBackToPatientList) {
            return ( <Redirect to="/dashboard/patient" /> );
        }

        return(
            <>             
                <Row className="mt-2">
                    <Col md={{ span: 8, offset: 2 }} sm={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Dodavanje novog pacijenta</b>
                                </Card.Title>
                                <Card.Text as="div">
                                    <Link className="btn btn-success" to="/dashboard/patient/">&#8592; Vratite se nazad</Link>  
                                </Card.Text>
                                <Card.Text as="div">
                                    <Row className="mt-2">
                                        <Col xs={12} md={{ span: 10, offset: 1 }}>

                                            <Form.Group>
                                                <Form.Label>Ime:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite ime pacijenta"
                                                    value={ this.state.forename }
                                                    onChange={ this.onChangeInput("forename") }
                                                />
                                                { this.state.forename.length < 2 && (<small className="red-text">Prekratko ime</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Prezime:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite prezime pacijenta"
                                                    value={ this.state.surname }
                                                    maxLength={ 255 }
                                                    onChange={ this.onChangeInput("surname") }
                                                />
                                                { this.state.surname.length < 2 && (<small className="red-text">Prekratko prezime</small>) }
                                            </Form.Group>



                                            <Form.Group>
                                                <Form.Label>E-mail:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite e-mail pacijenta"
                                                    value={ this.state.email }
                                                    onChange={ this.onChangeInput("email") }
                                                />
                                                { this.state.email.length < 8 && (<small className="red-text">Prekratak e-mail</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Pol:</Form.Label>
                                                <Form.Control as="select"
                                                    value={ this.state.gender }
                                                    onChange={ this.onChangeSelect("gender") }>
                                                    { this.state.genderValues.map(gender => this.createSelectOptionGroup(gender)) }
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Datum rođenja:</Form.Label>
                                                <Form.Control
                                                    value={this.state.bornAt}
                                                    type="date"
                                                    onChange={ this.onChangeInput("bornAt") }
                                                />
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>JMBG:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite pacijentov JMBG"
                                                    value={ this.state.personalIdentityNumber }
                                                    onChange={ this.onChangeInput("personalIdentityNumber") }
                                                />
                                                { (this.state.personalIdentityNumber.length < 13 || !this.state.personalIdentityNumber.match(/^[0-9]{13}$/)) && (<small className="red-text">JMBG treba da sadrži 13 cifara</small>) }
                                            </Form.Group>


                                            <Form.Group>
                                                <Form.Label>Broj telefona:</Form.Label>
                                                <Form.Control
                                                    type="phone"
                                                    placeholder="Unesite broj telefona pacijenta"
                                                    value={ this.state.phoneNumber }
                                                    maxLength={ 255 }
                                                    onChange={ this.onChangeInput("phoneNumber") }
                                                />
                                                { this.state.phoneNumber.length < 5 && (<small className="red-text">Prekratak broj telefona</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Adresa:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite adresu pacijenta"
                                                    value={ this.state.address }
                                                    onChange={ this.onChangeInput("address") }
                                                />
                                                { this.state.address.length < 10 && (<small className="red-text">Prekratka adresa</small>) }
                                            </Form.Group>
                                            
                                            <Form.Group>
                                                <Button variant="primary" className="mt-3" disabled={!this.isFormValid()}
                                                    onClick= { () => this.addButtonClickHandler() } >
                                                    Dodajte novog pacijenta
                                                </Button>
                                            </Form.Group>

                                        </Col>
                                    </Row>

                                    {
                                        this.state.message
                                        ? (<p className="mt-3 alert alert-danger">{ this.state.message }</p>)
                                        : ""
                                    }
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}
