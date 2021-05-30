import React from "react";
import BasePage from '../BasePage/BasePage';

export default class HomePage extends BasePage<{}> {
    renderMain(): JSX.Element {
        return (
            <div>
                <p>Ovo je početna stranica...</p>
            </div>
        );
    }
    
}
