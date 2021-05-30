import React from "react";
import BasePage from '../BasePage/BasePage';
import axios from "axios";
import CategoryModel from '../../../../03-back-end/src/components/category/model';
import { Link } from "react-router-dom";

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
        axios({
            method: "get",
            baseURL: "http://localhost:9001",
            url: "/category",
            timeout: 10000,
            headers: {
                Authorization: "Bearer FAKE-TOKEN"
            },
            maxRedirects: 0
        })
        .then(res => {
            if (!Array.isArray(res.data)) {
                throw new Error("Invalid data received");
            }
            this.setState({
                errorMessage: "",
                categories: res.data
            });
        })
        .catch(err => {
            this.setState({
                categories: [],
                errorMessage: "Nije moguće učitati kategorije usluga klinike"
            })
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
