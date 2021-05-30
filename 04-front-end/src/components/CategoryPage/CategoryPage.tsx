import React from "react";
import BasePage from '../BasePage/BasePage';

class CategoryPageState {
    categories: { name: string; services: string[] }[] = [];
}
export default class CategoryPage extends BasePage<{}> {
    state: CategoryPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        this.setState({
            categories: [
                {
                    categoryId: 1,
                    name: "Prva kategorija",
                    services: [
                        "Usluga 1 prve kategorije",
                        "Usluga 2 prve kategorije"
                    ]
                },
                {
                    categoryId: 2,
                    name: "Druga kategorija",
                    services: [
                        "Usluga 1 druge kategorije",
                        "Usluga 2 druge kategorije"
                    ]
                }
            ]
        });
    }

    renderMain(): JSX.Element {
        return (
            <>
                <h2>Kategorije usluga klinike</h2>
                <ul>
                    {
                        this.state.categories.map(category => (
                            <div key={category.name} style={{ border: "1px solid blue", borderRadius: "5px", padding: "5px", margin: "5px 0px 5px 0px" }}>
                                <h3>{category.name}</h3>
                                <ul>
                                    {
                                        category.services.map(service => (
                                            <p key={service}>{service}</p>
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
