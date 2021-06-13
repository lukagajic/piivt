import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import BasePage, { BasePageProperties }  from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import CategoryService from '../../../../services/CategoryService';
import ServiceModel from '../../../../../../03-back-end/src/components/service/model';
import VisitService, { IEditVisit } from '../../../../services/VisitService';
import VisitModel, { VisitServiceRecord } from '../../../../../../03-back-end/src/components/visit/model';
import ServiceService from '../../../../services/ServiceService';


class VisitDashboardEditProperties extends BasePageProperties {
    match?: {
        params: {
            vId: string;
        }
    }
}

interface VisitDashboardEditState {  
    visit: VisitModel | null;
    services: ServiceModel[];
    redirectBackToVisitList: boolean;
    isDoctorLoggedIn: boolean;
    message: string;

    activeVisitServices: VisitServiceRecord[];
}

export default class VisitDashboardEdit extends BasePage<VisitDashboardEditProperties> {
    state: VisitDashboardEditState;

    constructor(props: VisitDashboardEditProperties) {
        super(props);

        this.state = {
            visit: null,
            services: [],
            redirectBackToVisitList: false,
            isDoctorLoggedIn: true,
            message: "",
            activeVisitServices: []
        };
    }

    componentDidMount() {
        this.getServices();
        this.getVisit();
        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
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

    private getVisitId(): number {
        return Number(this.props.match?.params.vId);
    }


    private getVisit() {
        VisitService.getVisitById(this.getVisitId())
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
         return this.state.activeVisitServices.every(vsr => vsr.serviceId !== 0 && vsr.description.length >= 2);      
    }

    private getCategories() {
        CategoryService.getAll()
            .then(categories => {
                if (categories.length === 0) {                   
                    return this.setState({
                        categories: [],
                        errorMessage: "Nije moguće učitati kategorije usluga klinike"
                    });
                }

                this.setState({
                    errorMessage: "",
                    categories: categories
                });
            });
    }

    private onChangeSelect(visitServiceId: number): (event: React.ChangeEvent<HTMLSelectElement>) => void {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            this.setState((state: VisitDashboardEditState) => {
                let selectedVsr: VisitServiceRecord | undefined = state.activeVisitServices.find(avs => avs.visitServiceId === visitServiceId);
                
                if (!selectedVsr) return state;
                
                selectedVsr.serviceId = +(event.target.value);
                return state;
            });
        }
    }

    private onChangeInput(visitServiceId: number): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState((state: VisitDashboardEditState) => {
                let selectedVsr: VisitServiceRecord | undefined = state.activeVisitServices.find(avs => avs.visitServiceId === visitServiceId);

                if (!selectedVsr) return state;

                selectedVsr.description = event.target.value;

                return state;
            });
        }
    }

    private editButtonClickHandler() {
        const servicesToAdd: { visitServiceId: number; serviceId: number; visitId: number; description: string; }[] = [];

        for (const avs of this.state.activeVisitServices) {
            servicesToAdd.push({
                visitServiceId: avs.visitServiceId ?? 0,
                visitId: this.getVisitId(),
                serviceId: avs.serviceId,
                description: avs.description
            });
        }

        const data: IEditVisit = {
            services: servicesToAdd
        };

        VisitService.editVisit(this.getVisitId(), data)
        .then(res => {
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
            visitServiceId: 0,
            visitId: this.getVisitId(),
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

        if (this.state.visit === null) {
            return (
                <>
                    <h2>Poseta nije pronađena</h2>
                    <Link to="/dashboard/patient/">Spisak pacijenata</Link>
                </>
            )
        }

        if (this.state.redirectBackToVisitList) {
            return ( <Redirect to={"/dashboard/patient/" + this.state.visit?.patientId + "/visit" } />);
        }

        return(
            <>             
                <Row className="mt-2">
                    <Col md={{ span: 8, offset: 2 }} sm={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Izmena posete</b>
                                </Card.Title>
                                <Card.Text as="div" className="my-2">
                                    <Link className="btn btn-success" to="/dashboard/service/">&#8592; Vratite se nazad</Link>  
                                </Card.Text>
                                <Card.Text as="div">
                                    <h4>Usluge:</h4>
                                    <Row className="mt-2">
                                        <Col xs={12} md={{ span: 10, offset: 1 }}>
                                        {
                                            this.state.activeVisitServices.map((vsr, index) => (
                                                <Card key={"visit-edit-element-" + index} className="my-3">
                                                    <Card.Body>
                                                        <Card.Text as="div">
                                                            <Form.Group>
                                                                <Form.Label>
                                                                    <b>Detalji izvršene usluge</b>
                                                                </Form.Label>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    value={vsr.description}
                                                                    onChange = { this.onChangeInput(vsr.visitServiceId ?? 0) }
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
                                                                    onChange={ this.onChangeSelect(vsr.visitServiceId ?? 0) }>
                                                                    { vsr.visitServiceId === 0 && <option value="0">Izaberite tip usluge</option> }
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
                                        <Button disabled={ !this.isFormValid() } variant="success" onClick={ () => this.editButtonClickHandler() }>Izvrši izmene</Button>
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
