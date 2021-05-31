import React from "react";
import BasePage from '../BasePage/BasePage';
import CategoryModel from '../../../../03-back-end/src/components/category/model';
import { Link } from "react-router-dom";
import CategoryService from "../../services/CategoryService";

class CategoryPageState {
    categories: CategoryModel[] = [];
    errorMessage: string = "";
}
export default class CategoryPage extends BasePage<{}> {
    state: CategoryPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            categories: [],
            errorMessage: ""
        };
    }

    componentDidMount() {
        this.getCategories();
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
        return (
            <>
                { this.state.errorMessage.length > 0 && <p>{ this.state.errorMessage }</p> }
                <h2>Kategorije usluga klinike</h2>
                <ul>
                    {
                        this.state.categories.map(category => (
                            <div key={category.categoryId} style={{ border: "1px solid blue", borderRadius: "5px", padding: "5px", margin: "5px 0px 5px 0px" }}>
                                <h3>{category.name}</h3>
                                <ul>
                                    {
                                        category.services.map(service => (
                                            <Link to={`/service/${service.serviceId}`} key={service.serviceId}>
                                                { service.name }
                                            </Link>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </ul>
            </>
        );
    }
}
