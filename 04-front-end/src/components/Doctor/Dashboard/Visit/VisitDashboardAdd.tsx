import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import BasePage, { BasePageProperties }  from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import CategoryService from '../../../../services/CategoryService';
import ServiceModel from '../../../../../../03-back-end/src/components/service/model';
import VisitService, { IAddVisit } from '../../../../services/VisitService';
import ServiceService from '../../../../services/ServiceService';
import PatientModel from '../../../../../../03-back-end/src/components/patient/model';
import PatientService from '../../../../services/PatientService';


class VisitDashboardAddProperties extends BasePageProperties {
    match?: {
        params: {
            pId: string;
        }
    }
}

interface VisitDashboardAddState {  
    patient: PatientModel | null;
    services: ServiceModel[];
    redirectBackToVisitList: boolean;
    isDoctorLoggedIn: boolean;
    message: string;

    activeVisitServices: {
        serviceId: number;
        description: string;

    }[];

    visitedAt: string;
}

export default class VisitDashboardAdd extends BasePage<VisitDashboardAddProperties> {
    state: VisitDashboardAddState;

    constructor(props: VisitDashboardAddProperties) {
        super(props);

        this.state = {
            patient: null,
            services: [],
            redirectBackToVisitList: false,
            isDoctorLoggedIn: true,
            message: "",
            activeVisitServices: [],
            visitedAt: new Date().toISOString().substring(0, 10)
        };
    }

    componentDidMount() {
        this.getServices();
        this.getPatient();
        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    private getPatient() {
        PatientService.getPatientById(this.getPatientId())
            .then(res => {
                if (res === null) {
                    this.setState({
                        errorMessage: "Nije moguće dodavanje posete, jer je došlo do greške prilikom učitavanja... pacijenata"
                    });
                    return;
                }

                this.setState({
                    patient: res
                });
            })
    }
    

    private getServices() {
        ServiceService.getAll()
            .then(services => {
                if (services.length === 0) {                   
                    return this.setState({
                        services: [],
                        errorMessage: "Nije moguće učitati listu usluga klinike"
                    });
                }

                this.setState({
                    errorMessage: "",
                    services: services
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

    private getPatientId(): number {
        return Number(this.props.match?.params.pId);
    }


    private getVisit() {
        VisitService.getVisitById(this.getPatientId())
            .then(res => {
                this.setState({
                    visit: res,
                    activeVisitServices: res?.services
                });
            });
    }
    


    private createSelectOptionGroup(service: ServiceModel): JSX.Element {
        return (
            <option key={ "service-option-" + service.serviceId } value={ service.serviceId }>
                { service.name }
            </option>
        );
    }

    private isFormValid(): boolean {               
         return this.state.activeVisitServices.every(vsr => vsr.serviceId !== 0 && vsr.description.length >= 2)
         && new Date(this.state.visitedAt).getDate() >= (new Date().getDate());      
    }

    

    private onChangeSelect(index: number): (event: React.ChangeEvent<HTMLSelectElement>) => void {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            this.setState((state: VisitDashboardAddState) => {
                state.activeVisitServices[index].serviceId = +(event.target.value)
                return state;
            });
        }
    }

    private onChangeDate(): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                visitedAt: event?.target.value
            });
        }
    }

    private onChangeInput(index: number, type: "visitedAt" | "description"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (index === -1) {
                this.setState({
                    [type]: event.target.value
                });
                
                return;
            }
            this.setState((state: VisitDashboardAddState) => {
                switch(type) {
                    case "description":
                        state.activeVisitServices[index][type] = event.target.value;
                        break;
                }
                
                return state;
            });
        }
    }

    private addButtonClickHandler() {
        if (!this.isFormValid()) return;
        
        const data: IAddVisit = {
            patientId: this.getPatientId(),
            visitedAt: this.state.visitedAt,
            services: this.state.activeVisitServices
        };

        VisitService.addVisit(data)
        .then(res => {
            console.log('Stigao rezultat');
            if (res.success === false) {
                this.setState({
                    message: res.message
                });
                
                return;
            }
            
            this.setState({
                redirectBackToVisitList: true
            });
        });
    }


    private removeFromList(index: number) {
        const activeVisitServices = [...this.state.activeVisitServices];
        const newActiveVisitServices = [];

        for (let i = 0; i < activeVisitServices.length; i++) {
            if (i === index) {
                continue;
            }

            newActiveVisitServices.push(activeVisitServices[i]);
        }
        this.setState({
            activeVisitServices: newActiveVisitServices
        });
    }

    private addToVisitServices() {
        const activeVisitServices = [...this.state.activeVisitServices];

        activeVisitServices.push({
            description: "",
            serviceId: 0
        });

        this.setState({
            activeVisitServices: activeVisitServices
        });
    }

    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        if (this.state.patient === null) {
            return (
                <>
                    <h2>Pacijent nije pronađen</h2>
                    <Link to="/dashboard/patient/">Spisak pacijenata</Link>
                </>
            )
        }

        if (this.state.redirectBackToVisitList) {
            return ( <Redirect to={"/dashboard/patient/" + this.state.patient?.patientId + "/visit" } />);
        }

        return(
            <>             
                <Row className="mt-2">
                    <Col md={{ span: 8, offset: 2 }} sm={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Nova poseta za pacijenta: { `${this.state.patient.forename} ${this.state.patient.surname}` }</b>
                                </Card.Title>
                                <Card.Text as="div" className="my-2">
                                    <Link className="btn btn-success" to="/dashboard/service/">&#8592; Vratite se nazad</Link>  
                                </Card.Text>
                                <Card.Text as="div">
                                    <h4>Detalji posete:</h4>
                                    <Row className="mt-2">
                                        <Col xs={12} md={{ span: 10, offset: 1 }}>
                                            <Card className="my-2">
                                                <Card.Body>        
                                                    <Card.Text as="div">
                                                        <Form.Group>
                                                            <Form.Label>
                                                                <b>Datum posete</b>
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={this.state.visitedAt}
                                                                onChange = { this.onChangeInput(-1, "visitedAt") }
                                                            />
                                                            { new Date(this.state.visitedAt).getDate() < (new Date().getDate()) && <small className="red-text">Datum posete ne može da bude u prošlosti !</small>}
                                                        </Form.Group>
                                                    </Card.Text>
                                                </Card.Body>
                                            </Card>
                                        {
                                            this.state.activeVisitServices.map((vsr, index) => (
                                                <Card key={"visit-add-element" + index } className="my-3">
                                                    <Card.Body>
                                                        <Card.Text as="div">
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    <b>Detalji izvršene usluge</b>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    value={vsr.description}
                                                                    onChange = { this.onChangeInput(index, "description") }
                                                                    rows={10}
                                                                />
                                                                { vsr.description.length < 2 && <small className="red-text">Prekratak opis!</small> }
                                                            </Form.Group>
                                                        </Card.Text>
                                                        <Card.Text as="div">
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    <b>Tip usluge</b>
                                                                </Form.Label>
                                                                <Form.Control as="select"
                                                                    value={ vsr.serviceId + "" }
                                                                    onChange={ this.onChangeSelect(index) }>
                                                                    <option value="0">Izaberite tip usluge</option>
                                                                    { this.state.services.map(service => this.createSelectOptionGroup(service)) }
                                                                </Form.Control>
                                                                { vsr.serviceId === 0 && <small className="red-text">Morate izabrati uslugu!</small> }
                                                            </Form.Group>
                                                        </Card.Text>
                                                        <Card.Text as="div" className="mt-2">
                                                            <Button variant="danger" onClick={ () => this.removeFromList(index) }>Ukloni</Button>
                                                        </Card.Text>

                                                    </Card.Body>
                                                </Card>
                                            ))
                                        }
                                        <Button onClick={ () => this.addToVisitServices() } variant="primary">Dodaj uslugu</Button>
                                        <hr />
                                        <Button disabled={ !this.isFormValid() } variant="success" onClick={ () => this.addButtonClickHandler() }>Potvrdi</Button>
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
