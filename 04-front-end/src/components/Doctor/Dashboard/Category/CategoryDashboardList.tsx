import React from "react";
import BasePage from '../../../BasePage/BasePage';
import CategoryModel from '../../../../../../03-back-end/src/components/category/model';
import { Link } from "react-router-dom";
import CategoryService from "../../../../services/CategoryService";
import EventRegister from '../../../../api/EventRegister';
import { Redirect } from "react-router-dom";
import { CardDeck } from "react-bootstrap";
import CategoryDashboardListItem from './CategoryDashboardListItem';

class CategoryDashboardListState {
    categories: CategoryModel[] = [];
    errorMessage: string = "";
    isDoctorLoggedIn: boolean = true;
}
export default class CategoryDashboardList extends BasePage<{}> {
    state: CategoryDashboardListState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            categories: [],
            errorMessage: "",
            isDoctorLoggedIn: true
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

    renderMain(): JSX.Element {
        if (this.state.isDoctorLoggedIn === false) {
            return <Redirect to="/doctor/login" />
        }

        return (
            <>
                { this.state.errorMessage.length > 0 && <p>{ this.state.errorMessage }</p> }
                <h2>Kategorije usluga klinike</h2>
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
