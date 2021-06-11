import React from "react";
import BasePage from '../../../BasePage/BasePage';
import CategoryModel from '../../../../../../03-back-end/src/components/category/model';
import { Link } from "react-router-dom";
import CategoryService from "../../../../services/CategoryService";
import EventRegister from '../../../../api/EventRegister';
import { Redirect } from "react-router-dom";
import { Button, Card, CardDeck, Form, FormControl, InputGroup } from "react-bootstrap";
import CategoryDashboardListItem from './CategoryDashboardListItem';

class CategoryDashboardListState {
    categories: CategoryModel[] = [];
    errorMessage: string = "";
    isDoctorLoggedIn: boolean = true;
    isAddCategoryOptionShown: boolean = false;
    newCategoryName: string = "";
    addCategoryMessage: string = "";
    editCategoryMessage: string = "";
}
export default class CategoryDashboardList extends BasePage<{}> {
    state: CategoryDashboardListState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            categories: [],
            errorMessage: "",
            isDoctorLoggedIn: true,
            isAddCategoryOptionShown: true,
            newCategoryName: "",
            addCategoryMessage: "",
            editCategoryMessage: ""
        };
    }

    componentDidMount() {
        this.getCategories();

        EventRegister.on("AUTH_EVENT", this.authEventHandler.bind(this));
        EventRegister.on("CATEGORY_EVENT", this.categoryEventHandler.bind(this));
    }

    componentWillUnmount() {
        EventRegister.off("AUTH_EVENT", this.authEventHandler.bind(this));
        EventRegister.off("CATEGORY_EVENT", this.categoryEventHandler.bind(this));
    }

    private categoryEventHandler() {
        this.getCategories();
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

    private onChangeInput(field: "newCategoryName"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }

    private toggleAddCategoryMenu() {
        this.setState({
            isAddCategoryOptionShown: !this.state.isAddCategoryOptionShown
        });
    }

    private isAddCategoryFormValid() {
        return this.state.newCategoryName.length > 2;
    }

    private addNewCategory() {
        if (!this.isAddCategoryFormValid()) return;

        CategoryService.addNewCategory(this.state.newCategoryName)
        .then(res => {
            if (res.success === false) {
                this.setState({
                    addCategoryMessage: res.message
                });
            } else {
                this.setState({
                    addCategoryMessage: "Kategorija uspešno dodata"
                });

                this.getCategories();

                setTimeout(() => {
                    this.setState({
                        addCategoryMessage: "",
                        newCategoryName: ""
                    })
                    this.toggleAddCategoryMenu();
                }, 3000);
            }
        });
    }

    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        return (
            <>
                { this.state.errorMessage.length > 0 && <p>{ this.state.errorMessage }</p> }
                <h2>Kategorije usluga klinike</h2>
                <Button onClick={() => this.toggleAddCategoryMenu() } variant={this.state.isAddCategoryOptionShown ? "danger" : "primary"}>
                    { this.state.isAddCategoryOptionShown ? "Zatvori dodavanje kategorije": "Nova kategorija" }
                </Button>
                { this.state.isAddCategoryOptionShown &&
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>Nova kategorija</Card.Title>                        
                            <Card.Text as="div">
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Naziv kategorije:</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Unesite naziv kategorije"
                                        value={ this.state.newCategoryName }
                                        onChange={ this.onChangeInput("newCategoryName") }
                                    />
                                    <InputGroup.Append>
                                        <Button
                                            variant="success"
                                            disabled={!this.isAddCategoryFormValid()}
                                            onClick={ () => this.addNewCategory() }
                                        >
                                            Dodaj
                                        </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Card.Text>
                            <Card.Text>{ this.state.addCategoryMessage }</Card.Text>
                        </Card.Body>
                    </Card>
                }
                <CardDeck className="row">
                    {
                        this.state.categories.map(category => (
                            <CategoryDashboardListItem key={ "category-list-item-" + category.categoryId } category={ category } />
                        ))
                    }
                </CardDeck>
            </>
        );
    }
}
