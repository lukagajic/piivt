import { Button } from 'react-bootstrap';
import BasePage from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import ConfirmAction from '../../../Misc/ConfirmAction';
import PatientModel from '../../../../../../03-back-end/src/components/patient/model';
import PatientService from '../../../../services/PatientService';

class PatientDashboardListState {
    patients: PatientModel[] = [];
    errorMessage: string = "";
    isDoctorLoggedIn: boolean = true;
    showDeleteDialog: boolean;
    deleteDialogYesHandler: () => void;
    deleteDialogNoHandler: () => void;
    patientDeleteMessage: string;
}

export default class PatientDashboardList extends BasePage<{}> {
    state: PatientDashboardListState;

    constructor(props: any) {
        super(props);

        this.state = {
            patients: [],
            errorMessage: "",
            isDoctorLoggedIn: true,
            showDeleteDialog: false,
            deleteDialogYesHandler: () => {},
            deleteDialogNoHandler: () => {
                this.setState({
                    showDeleteDialog: false,
                })
            },
            patientDeleteMessage: ""
        };
    }

    componentDidMount() {
        this.getPatients();

        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
    }

    private getDeleteHandler(patientId: number) {
        return () => {
            this.setState({
                showDeleteDialog: true,
                deleteDialogYesHandler: () => {
                   PatientService.deletePatient(patientId)
                   .then(res => {
                        let messageToShow = res ? "Pacijent obrisan!" : "Došlo je do greške prilikom brisanja pacijenta"
                        
                        this.setState({
                            patientDeleteMessage: messageToShow
                        });
                        
                        if (res) {
                            this.getPatients();
                        }

                        this.setState({
                            showDeleteDialog: false
                        });

                        setTimeout(() => {
                            this.setState({
                                patientDeleteMessage: ""
                            });
                        }, 2000);
                   })
                }
            });
        };
    }

    private authEventHandler(status: string) {
        if (status === "force_login") {
            this.setState({
                isDoctorLoggedIn: false
            });
        }
    }

    private getPatients() {
        PatientService.getAllForDoctor()
            .then(patients => {
                if (patients.length === 0) {                   
                    return this.setState({
                        patients: [],
                        // TODO napisati informativniju poruku
                        errorMessage: "Nemate nijednog pacijenta"
                    });
                }

                this.setState({
                    errorMessage: "",
                    patients: patients
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
                            title="Brisanje usluge iz liste?"
                            message="Da li ste sigurni da želite da uklonite uslugu iz liste?"
                            yesHandler={ this.state.deleteDialogYesHandler }
                            noHandler={ this.state.deleteDialogNoHandler } />
                    ): ""
                }

                { this.state.errorMessage.length > 0 && <p>{ this.state.errorMessage }</p> }

                <h2>Pacijenti</h2>
                <Link className="btn btn-success" to="/dashboard/patient/add">&#43; Dodaj pacijenta</Link>
                
                <p>{ this.state.patientDeleteMessage }</p>
                
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Ime</th>
                            <th>Prezime</th>
                            <th>Datum rođenja</th>
                            <th>Pol</th>
                            <th>E-mail</th>
                            <th>JMBG</th>
                            <th>Adresa</th>
                            <th>Opcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.patients.map(patient => (
                                <tr key={ "patient-list-item-" + patient.patientId }>
                                    <td>
                                        { patient.forename }
                                    </td>
                                    <td>
                                        { patient.surname }
                                    </td>
                                    <td>
                                        { new Date(patient.bornAt).toLocaleDateString() }
                                    </td>
                                    <td>
                                        { patient.gender === "male" ? "M" : "Ž" }
                                    </td>
                                    <td>
                                        { patient.email } 
                                    </td>
                                    <td>
                                        { patient.personalIdentityNumber }
                                    </td>
                                    <td>
                                        { patient.address }
                                    </td>
                                    <td>
                                        <Link className="btn btn-primary btn-sm" to= { "/dashboard/patient/" + patient.patientId + "/visit"}>Sve posete</Link>
                                        <Link className="btn btn-secondary btn-sm mx-1" to= { "/dashboard/patient/edit/" + patient.patientId }>Izmeni</Link>
                                        <Button onClick={ this.getDeleteHandler(patient.patientId) } size="sm" variant="danger">
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
