import { Button } from 'react-bootstrap';
import BasePage, { BasePageProperties } from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import ConfirmAction from '../../../Misc/ConfirmAction';
import VisitModel from '../../../../../../03-back-end/src/components/visit/model';
import VisitService from '../../../../services/VisitService';
import ServiceService from '../../../../services/ServiceService';
import PatientModel from '../../../../../../03-back-end/src/components/patient/model';
import PatientService from '../../../../services/PatientService';

class VisitDashboardListProperties extends BasePageProperties {
    match: {
        params: {
            pId: string;
        }
    }
}

class VisitDashboardListState {
    patient: PatientModel | null;
    visits: VisitModel[] = [];
    errorMessage: string = "";
    isDoctorLoggedIn: boolean = true;
    showDeleteDialog: boolean;
    deleteDialogYesHandler: () => void;
    deleteDialogNoHandler: () => void;
    visitDeleteMessage: string;
}

export default class VisitDashboardList extends BasePage<VisitDashboardListProperties> {
    state: VisitDashboardListState;

    constructor(props: VisitDashboardListProperties) {
        super(props);

        this.state = {
            patient: null,
            visits: [],
            errorMessage: "",
            isDoctorLoggedIn: true,
            showDeleteDialog: false,
            deleteDialogYesHandler: () => {},
            deleteDialogNoHandler: () => {
                this.setState({
                    showDeleteDialog: false,
                })
            },
            visitDeleteMessage: ""
        };
    }

    componentDidMount() {
        this.getPatient();
        this.getVisits();
        this.getServices();

        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    private getPatient() {
        PatientService.getPatientById(this.getPatientId())
            .then(data => {
                if (data === null) {
                    this.setState({
                        errorMessage: "Nema podataka o pacijentu"
                    })
                }
                this.setState({
                    patient: data,
                    errorMessage: ""
                });
            })
    }

    private getDeleteHandler(visitId: number) {
        return () => {
            this.setState({
                showDeleteDialog: true,
                deleteDialogYesHandler: () => {
                    VisitService.deleteVisit(visitId)
                    .then(res => {
                        let messageToShow = res ? "Poseta obrisana!" : "Došlo je do greške prilikom brisanja posete"

                        this.setState({
                            visitDeleteMessage: messageToShow
                        });
                        
                        if (res) {
                            this.getVisits();   
                        }

                        this.setState({
                            showDeleteDialog: false
                        });

                        setTimeout(() => {
                            this.setState({
                                visitDeleteMessage: ""
                            });
                        }, 2000);
                    })
                 }
            });
        }
    }
    

    private authEventHandler(status: string) {
        if (status === "force_login") {
            this.setState({
                isDoctorLoggedIn: false
            });
        }
    }

    private getServices() {
        ServiceService.getAll()
            .then(services => {
                if (services.length === 0) {                   
                    return this.setState({
                        services: [],
                        errorMessage: "Nema dostupnih usluga"
                    });
                }

                this.setState({
                    errorMessage: "",
                    services: services
                });
            });
    }

    private getPatientId() {
        return Number(this.props.match.params.pId);
    }

    private getVisits() {
        VisitService.getAllByPatient(this.getPatientId())
            .then(visits => {
                if (visits.length === 0) {                   
                    return this.setState({
                        visits: [],
                        errorMessage: "Nema dostupnih poseta"
                    });
                }

                this.setState({
                    errorMessage: "",
                    visits: visits
                });
            });
    }
    
    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        return(
            <>
                {
                    this.state.showDeleteDialog ? (
                        <ConfirmAction
                            title="Brisanje posete iz liste?"
                            message="Da li ste sigurni da želite da uklonite posetu iz liste?"
                            yesHandler={ this.state.deleteDialogYesHandler }
                            noHandler={ this.state.deleteDialogNoHandler } />
                    ): ""
                }

                { this.state.errorMessage.length > 0 && <p>{ this.state.errorMessage }</p>}

                <h2>Karton pacijenta: { this.state.patient?.forename + " " + this.state.patient?.surname }</h2>
                <h3>Sve posete</h3>
                <Link className="btn btn-success" to={"/dashboard/patient/" + this.getPatientId() + "/visit/add"}>&#43; Nova poseta</Link>
                
                <p>{ this.state.visitDeleteMessage }</p>
                
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Dodao podatke</th>
                            <th>Izmenio podatke</th>
                            <th>Broj izvršenih usluga</th>
                            <th>Ukupna cena</th>
                            <th>Opcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.visits.map(visit => (
                                <tr key={ "visit-list-item-" + visit.visitId }>
                                    <td>
                                        { new Date(visit.visitedAt).toLocaleDateString() }
                                    </td>
                                    <td>
                                        { visit.doctor.forename + " " + visit.doctor.surname }
                                    </td>
                                    <td>
                                        { visit.editorDoctor.forename + " " + visit.editorDoctor.surname }
                                    </td>
                                    <td>
                                        { visit.services.length }
                                    </td>
                                    <td>
                                        { visit.totalPrice } RSD
                                    </td>
                                    
                                    <td>
                                        <Link className="btn btn-primary btn-sm" to= { "/dashboard/patient/visit/" + visit.visitId }>Detalji</Link>
                                        <Link className="btn btn-secondary btn-sm mx-1" to= { "/dashboard/patient/visit/edit/" + visit.visitId }>Izmeni usluge</Link>
                                        <Button onClick={ this.getDeleteHandler(visit.visitId) } size="sm" variant="danger">
                                            Obriši / Sakrij
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </>
        )
    }
}
