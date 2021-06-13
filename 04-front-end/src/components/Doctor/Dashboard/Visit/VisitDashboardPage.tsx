import { Button, Card, Col, Row } from 'react-bootstrap';
import BasePage, { BasePageProperties }  from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import VisitModel from '../../../../../../03-back-end/src/components/visit/model';
import VisitService from '../../../../services/VisitService';
import "./VisitDashboardPage.sass";


class VisitDashboardPageProperties extends BasePageProperties {
    match?: {
        params: {
            vId: string;
        }
    }
}

interface VisitDashboardPageState {  
    visit: VisitModel | null;
    redirectBackToServiceList: boolean;
    isDoctorLoggedIn: boolean;
}

export default class VisitDashboardPage extends BasePage<VisitDashboardPageProperties> {
    state: VisitDashboardPageState;

    constructor(props: VisitDashboardPageProperties) {
        super(props);

        this.state = {
            visit: null,
            redirectBackToServiceList: false,
            isDoctorLoggedIn: true
        }
    }

    componentDidMount() {
        this.getVisit();
        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
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
                    visit: res
                });
            });
    }


    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        if (this.state.visit === null) {
            return (
                <>
                    <h2>Pacijent nije pronađen</h2>
                    <Link to="/dashboard/patient/">Spisak pacijenata</Link>
                </>
            )
        }

        if (this.state.redirectBackToServiceList) {
            return ( <Redirect to="/dashboard/service" /> );
        }

        return(
            <>             
                <Row className="mt-2">
                    <Col md={{ span: 8, offset: 2 }} sm={12}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <b>Detalji o poseti</b>
                                </Card.Title>
                                <Card.Text as="div">
                                    <Link className="btn btn-success" to={"/dashboard/patient/" + this.state.visit.patientId + "/visit"} >&#8592; Vratite se nazad</Link>  
                                </Card.Text>
                                <Card.Text as="div">
                                    <Row className="mt-2">
                                        <Col xs={12} md={{ span: 10, offset: 1 }}>
                                            <h3>
                                                Datum posete:
                                            </h3>
                                            <p className="h5">
                                                { new Date(this.state.visit.visitedAt).toLocaleDateString() }
                                            </p>

                                            <h3>
                                                Pregled izvršio:
                                            </h3>
                                            <p className="h5">
                                                { `${this.state.visit.doctor.title} ${this.state.visit.doctor.forename} ${this.state.visit.doctor.surname}` }
                                            </p>

                                            <h3>
                                                Pregled poslednji izmenio:
                                            </h3>
                                            <p className="h5">
                                                { `${this.state.visit.doctor.title} ${this.state.visit.editorDoctor.forename} ${this.state.visit.editorDoctor.surname}` }
                                            </p>

                                            <h3>
                                                Ukupna cena:
                                            </h3>
                                            <p className="h5">
                                                { this.state.visit.totalPrice } RSD
                                            </p>

                                        </Col>
                                    </Row>
                                </Card.Text>
                                <hr />
                                <Card.Text as="div">
                                    <h4>Usluge</h4>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Izvršena usluga</th>
                                                <th>Detalji</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.state.visit.services.map(vsr => (
                                                <tr>
                                                    <td className="fixed-width">
                                                        { vsr.service?.name }
                                                    </td>

                                                    <td>
                                                        { vsr.description }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    </table>                                    
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}
