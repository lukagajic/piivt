import { Button } from 'react-bootstrap';
import ServiceModel from '../../../../../../03-back-end/src/components/service/model';
import ServiceService from '../../../../services/ServiceService';
import BasePage from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';

class ServiceDashboardListState {
    services: ServiceModel[] = [];
    errorMessage: string = "";
    isDoctorLoggedIn: boolean = true;
}

export default class ServiceDashboardList extends BasePage<{}> {
    state: ServiceDashboardListState;

    constructor(props: any) {
        super(props);

        this.state = {
            services: [],
            errorMessage: "",
            isDoctorLoggedIn: true
        };
    }

    componentDidMount() {
        this.getServices();

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
    
    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        return(
            <>
                { this.state.errorMessage.length > 0 && <p>{ this.state.errorMessage }</p> }
                <h2>Usluge klinike</h2>
                <Link className="btn btn-success" to="/dashboard/service/add">&#43; Nova usluga</Link>
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Naziv</th>
                            <th>Opis</th>
                            <th>Cena</th>
                            <th>Cena za decu</th>
                            <th>Cena za penzionere</th>
                            <th>Kategorija</th>
                            <th>Opcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.services.map(service => (
                                <tr key={ "service-list-item-" + service.serviceId }>
                                    <td>
                                        { service.name }
                                    </td>
                                    <td>
                                        { service.description }
                                    </td>
                                    <td>
                                        { service.price } RSD
                                    </td>
                                    <td>
                                        { service.priceForChildren } RSD
                                    </td>
                                    <td>
                                        { service.priceForSeniors } RSD
                                    </td>
                                    <td>
                                        { service.category?.name ?? "Greška prilikom učitavanja kategorije" }
                                    </td>
                                    <td>
                                        <Link className="btn btn-secondary btn-sm" to= { "/dashboard/service/edit/" + service.serviceId }>Izmeni</Link>
                                        <Button size="sm" className="mx-1" variant="danger">
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
