import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import ServiceService, { IAddService, IEditService } from '../../../../services/ServiceService';
import BasePage, { BasePageProperties }  from '../../../BasePage/BasePage';
import { Link, Redirect } from "react-router-dom";
import EventRegister from '../../../../api/EventRegister';
import CategoryService from '../../../../services/CategoryService';
import CategoryModel from '../../../../../../03-back-end/src/components/category/model';
import ServiceModel from '../../../../../../03-back-end/src/components/service/model';


class ServiceDashboardEditProperties extends BasePageProperties {
    match?: {
        params: {
            sId: string;
        }
    }
}

interface ServiceDashboardEditState {  
    categories: CategoryModel[];
    service: ServiceModel | null;
    redirectBackToServiceList: boolean;
    isDoctorLoggedIn: boolean;
    message: string;


    newServiceName: string;
    newServiceDescription: string;
    newServiceCatalogueCode: string;
    newServicePrice: string;
    newServicePriceForChildren: string;
    newServicePriceForSeniors: string;
    newServiceCategory: string;
}

export default class ServiceDashboardEdit extends BasePage<ServiceDashboardEditProperties> {
    state: ServiceDashboardEditState;

    constructor(props: ServiceDashboardEditProperties) {
        super(props);

        this.state = {
            categories: [],
            service: null,
            redirectBackToServiceList: false,
            isDoctorLoggedIn: true,
            message: "",

            newServiceName: "",
            newServiceDescription: "",
            newServiceCatalogueCode: "",
            newServicePrice: "",
            newServicePriceForChildren: "",
            newServicePriceForSeniors: "",
            newServiceCategory: ""
        };
    }

    componentDidMount() {
        this.getCategories();
        this.getServiceData();
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

    private getServiceId(): number {
        return Number(this.props.match?.params.sId);
    }

    private getServiceData() {
        ServiceService.getServiceById(this.getServiceId())
            .then(res => {
                this.setState({
                    service: res,

                    newServiceName: res?.name,
                    newServiceDescription: res?.description,
                    newServiceCatalogueCode: res?.catalogueCode,
                    newServicePrice: res?.price + "",
                    newServicePriceForChildren: res?.priceForChildren + "",
                    newServicePriceForSeniors: res?.priceForSeniors + "",
                    newServiceCategory: res?.categoryId + ""
                });
            });
    }

    private onChangeInput(field: "newServiceName" | "newServiceDescription" | "newServiceCatalogueCode" | "newServicePrice" | "newServicePriceForChildren" | "newServicePriceForSeniors"): (event: React.ChangeEvent<HTMLInputElement>) => void {
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
         return this.state.newServiceName.length > 2 &&
            this.state.newServiceDescription.length > 2 &&
            this.state.newServiceCatalogueCode.length === 7 &&
            +(this.state.newServicePrice) >= 150 &&
            +(this.state.newServicePriceForChildren) >= 150 &&
            +(this.state.newServicePriceForSeniors) >= 150;        
    }

    private onChangeSelect(field: "newServiceCategory"): (event: React.ChangeEvent<HTMLSelectElement>) => void {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            this.setState({
                [field]: event.target?.value + "",
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

    private editButtonClickHandler() {
        if (!this.isFormValid()) return;

        const data: IEditService = {
            name: this.state.newServiceName,
            description: this.state.newServiceDescription,
            catalogueCode: this.state.newServiceCatalogueCode,
            price: Number(this.state.newServicePrice),
            priceForChildren: Number(this.state.newServicePriceForChildren),
            priceForSeniors: Number(this.state.newServicePriceForSeniors),
            categoryId: Number(this.state.newServiceCategory)
        };

        ServiceService.editService(this.getServiceId(), data)
        .then(res => {
            if (res.success === false) {
                this.setState({
                    message: res.message
                });
                
                return;
            }
            
            this.setState({
                redirectBackToServiceList: true
            });
        });
    }

    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        if (this.state.service === null) {
            return (
                <>
                    <h2>Usluga nije pronađena</h2>
                    <Link to="/dashboard/service/">Spisak usluga</Link>
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
                                    <b>Izmena usluge</b>
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
                                                    value={ this.state.newServiceName }
                                                    onChange={ this.onChangeInput("newServiceName") }
                                                />
                                                { this.state.newServiceName.length < 2 && (<small className="red-text">Prekratak naziv</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Opis:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite opis usluge"
                                                    value={ this.state.newServiceDescription }
                                                    maxLength={ 255 }
                                                    onChange={ this.onChangeInput("newServiceDescription") }
                                                />
                                                { this.state.newServiceDescription.length < 2 && (<small className="red-text">Prekratak opis</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Kataloški broj:</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Unesite kataloški broj usluge"
                                                    value={ this.state.newServiceCatalogueCode }
                                                    maxLength={ 7 }
                                                    minLength={ 7 }
                                                    onChange={ this.onChangeInput("newServiceCatalogueCode") }
                                                />
                                                { this.state.newServiceCatalogueCode.length !== 7 && (<small className="red-text">Kataloški broj mora imati tačno 7 karaktera</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Cena usluge:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={150} step={1} max={1000000}
                                                    placeholder="Unesite cenu usluge"
                                                    value={ this.state.newServicePrice }
                                                    onChange={ this.onChangeInput("newServicePrice") }
                                                />
                                                { (+(this.state.newServicePrice) < 150) && (<small className="red-text">Cena usluge mora iznositi najmanje 150 dinara</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Cena usluge za decu:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={150} step={1} max={1000000}
                                                    placeholder="Unesite cenu usluge za decu"
                                                    value={ this.state.newServicePriceForChildren }
                                                    onChange={ this.onChangeInput("newServicePriceForChildren") }
                                                />
                                                { (+(this.state.newServicePriceForChildren) < 150) && (<small className="red-text">Cena usluge za decu mora iznositi najmanje 150 dinara</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Cena usluge za penzionere:</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min={1} step={1} max={1000000}
                                                    placeholder="Unesite cenu usluge za penzionere"
                                                    value={ this.state.newServicePriceForSeniors }
                                                    onChange={ this.onChangeInput("newServicePriceForSeniors") }
                                                />
                                                { (+(this.state.newServicePriceForSeniors) < 150) && (<small className="red-text">Cena usluge za penzionere mora iznositi najmanje 150 dinara</small>) }
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Kategorija usluge:</Form.Label>
                                                <Form.Control as="select"
                                                    value={ this.state.newServiceCategory }
                                                    onChange={ this.onChangeSelect("newServiceCategory") }>
                                                    { this.state.categories.map(category => this.createSelectOptionGroup(category)) }
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" className="mt-3" disabled={!this.isFormValid()}
                                                    onClick= { () => this.editButtonClickHandler() } >
                                                    Izmenite uslugu
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
