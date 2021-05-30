import React from "react";
import BasePage from '../BasePage/BasePage';

export default class CategoryPage extends BasePage<{}> {
    renderMain(): JSX.Element {
        return (
            <div>
                <p>Ovo su dostupne kategorije usluga klinike</p>
            </div>
        );
    }
}
