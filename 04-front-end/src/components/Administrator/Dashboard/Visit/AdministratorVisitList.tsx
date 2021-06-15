import VisitModel from '../../../../../../03-back-end/src/components/visit/model';
import { isRoleLoggedIn } from '../../../../api/api';
import EventRegister from '../../../../api/EventRegister';
import BasePage from '../../../BasePage/BasePage';
import VisitService from '../../../../services/VisitService';
import { Card, Col, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

interface AdministratorVisitListState {
    visits: VisitModel[];
    isAdminLoggedIn: boolean;
}

export default class AdministratorVisitList extends BasePage<{}> {
    state: AdministratorVisitListState;

    constructor(props: any) {
        super(props);
        
        this.state = {
            visits: [],
            isAdminLoggedIn: true
        };

    }

    private getVisits() {
        VisitService.getAll()
            .then(data => {
                this.setState({
                    visits: data
                });
            })
    }

    componentDidMount() {
        isRoleLoggedIn("administrator")
        .then(loggedIn => {
            if (!loggedIn) {
                EventRegister.emit("AUTH_EVENT", "force_login");
                this.setState({
                    isAdminLoggedIn: false
                });
                return;
            }
            this.getVisits();
        });
    }

    renderMain(): JSX.Element {
        if(!this.state.isAdminLoggedIn) {
            return <Redirect to="/administrator/logout" /> 
        }

        if (this.state.visits.length === 0) return <h2>Nema poseta za pregled</h2>
        
        return (   
            <>
                <h2>Sve posete</h2>
                <Row className="mt-2">
                    <Col md={{ span: 6, offset: 3}}>
                    {
                        this.state.visits.map(visit => (
                            
                            <Card className="my-2" key={"admin-visit-item-" + visit.visitId}>
                                <Card.Title className="m-2">
                                    Pacijent: { visit.patient.forename + " " + visit.patient.surname }
                                </Card.Title>
                                <Card.Body>
                                    <Card.Text as="div">
                                        <p>
                                            Izvršio: { visit.doctor.forename + " " + visit.doctor.surname }
                                        </p>
                                        <p>
                                            Poslednji izmenio: { visit.editorDoctor.forename + " " + visit.editorDoctor.surname }
                                        </p>
                                        <hr />
                                        <p>
                                            Datum: { new Date(visit.visitedAt).toLocaleDateString() }
                                        </p>
                                        <p>
                                            Ukupna cena: { visit.totalPrice } RSD
                                        </p>
                                        <p>
                                            Status: <b>{ visit.isActive ? "Aktivna" : "Uklonjena" }</b>
                                        </p>
                                    </Card.Text>
                                    <hr />
                                    <Card.Text as="div">
                                        <h4>Izvršene usluge</h4>
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Pružena usluga</th>
                                                    <th>Opis:</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                visit.services.map((vsr, index) => (
                                                    <tr key={"admin-vsr-item-" + index}>
                                                        <td>
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
                        ))
                    }
                    </Col>
                </Row>
            </>
        )
    }

}