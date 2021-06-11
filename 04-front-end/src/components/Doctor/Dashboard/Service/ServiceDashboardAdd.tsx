import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import ServiceService, { IAddService } from '../../../../services/ServiceService';
import BasePage  from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import CategoryService from '../../../../services/CategoryService';
import CategoryModel from '../../../../../../03-back-end/src/components/category/model';


interface ServiceDashboardAddState {
    name: string;
    description: string;
    price: string;
    priceForChildren: string;
    priceForSeniors: string;
    isDoctorLoggedIn: boolean;
    errorMessage: string;
    categories: CategoryModel[];
    message: string;
    selectedCategory: string;
    redirectBackToServiceList: boolean;
}

export default class ServiceDashboardAdd extends BasePage<{}> {
    state: ServiceDashboardAddState;

    constructor(props: any) {
        super(props);

        this.state = {
            name: "",
            description: "",
            price: "150",
            priceForChildren: "150",
            priceForSeniors: "150",
            isDoctorLoggedIn: true,
            errorMessage: "",
            categories: [],
            message: "",
            selectedCategory: "",
            redirectBackToServiceList: false
        };
    }

    componentDidMount() {
        this.getCategories();

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

    private onChangeInput(field: "name" | "description" | "price" | "priceForChildren" | "priceForSeniors"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }

    private createSelectOptionGroup(category: CategoryModel): JSX.Element {
        return (
            <option key={ "category-option-" + category.categoryId } value={ category.categoryId }>
                { category.name }
            </option>
        );
    }

    private isFormValid(): boolean {
        return this.state.name.length > 2 &&
            this.state.description.length > 2 &&
            +(this.state.price) >= 150 &&
            +(this.state.priceForChildren) >= 150 &&
            +(this.state.priceForSeniors) >= 150 &&
            this.state.selectedCategory !== ""
    }

    private onChangeSelect(field: "selectedCategory"): (event: React.ChangeEvent<HTMLSelectElement>) => void {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            this.setState({
                [field]: event.target?.value + "",
            });
        }
    }

    private addButtonClickHandler() {
        if (!this.isFormValid()) return;

        const data: IAddService = {
            name: this.state.name,
            description: this.state.description,
            price: Number(this.state.price),
            priceForChildren: Number(this.state.priceForChildren),
            priceForSeniors: Number(this.state.priceForSeniors),
            categoryId: Number(this.state.selectedCategory)
        };

        ServiceService.addService(data)
        .then(res => {
            if (res) return this.setState({ redirectBackToServiceList: true });
            else return this.setState({
                message: "Došlo je do greške prilikom dodavanja usluge."
            });
        })
    }

    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        if (this.state.errorMessage.length > 0) {
            return (
                <>
                    <p>Nije moguće dodavanje nove usluge, jer je došlo do greške prilikom učitavanja kategorija</p>
                    <Link to="dashboard/service/">Vratite se nazad</Link>
                </>
            );
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
                                    <b>Dodavanje nove usluge</b>
                                </Card.Title>
                                <Card.Text as="div">
                                    <Link className="btn btn-success" to="/dashboard/service/">&#8592; Vratite se nazad</Link>  
                                </Card.Text>
                                <Card.Text as="div">
                                    <Row className="mt-2">
                                        <Col xs={12} md={{ span: 10, offset: 1 }}>

                                            <Form.Group>
                                                <Form.Label>Naziv:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite naziv usluge"
                                                    value={ this.state.name }
                                                    onChange={ this.onChangeInput("name") }
                                                />
                                                { this.state.name.length < 2 && (<small className="red-text">Prekratak naziv</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Opis:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite opis usluge"
                                                    value={ this.state.description }
                                                    maxLength={ 255 }
                                                    onChange={ this.onChangeInput("description") }
                                                />
                                                { this.state.description.length < 2 && (<small className="red-text">Prekratak opis</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Cena usluge:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={150} step={1} max={1000000}
                                                    placeholder="Unesite cenu usluge"
                                                    value={ this.state.price }
                                                    onChange={ this.onChangeInput("price") }
                                                />
                                                { (+(this.state.price) < 150) && (<small className="red-text">Cena usluge mora iznositi najmanje 150 dinara</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Cena usluge za decu:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={150} step={1} max={1000000}
                                                    placeholder="Unesite cenu usluge za decu"
                                                    value={ this.state.priceForChildren }
                                                    onChange={ this.onChangeInput("priceForChildren") }
                                                />
                                                { (+(this.state.priceForChildren) < 150) && (<small className="red-text">Cena usluge za decu mora iznositi najmanje 150 dinara</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Cena usluge za penzionere:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={1} step={1} max={1000000}
                                                    placeholder="Unesite cenu usluge za penzionere"
                                                    value={ this.state.priceForSeniors }
                                                    onChange={ this.onChangeInput("priceForSeniors") }
                                                />
                                                { (+(this.state.priceForChildren) < 150) && (<small className="red-text">Cena usluge za penzionere mora iznositi najmanje 150 dinara</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Kategorija usluge:</Form.Label>
                                                <Form.Control as="select"
                                                    value={ this.state.selectedCategory }
                                                    onChange={ this.onChangeSelect("selectedCategory") }>
                                                    <option value="">Izaberite kategoriju</option>
                                                    { this.state.categories.map(category => this.createSelectOptionGroup(category)) }
                                                </Form.Control>
                                                { this.state.selectedCategory === "" && (<small className="red-text">Morate izabrati kategoriju</small>) }
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" className="mt-3" disabled={!this.isFormValid()}
                                                    onClick= { () => this.addButtonClickHandler() } >
                                                    Dodajte novu uslugu
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
