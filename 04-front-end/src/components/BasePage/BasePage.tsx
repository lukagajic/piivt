import React, { Component } from "react";

import { Row, Col } from "react-bootstrap";

class BasePageProperties {
    sidebar?: JSX.Element;
}

export { BasePageProperties };

export default abstract class BasePage<Properties extends BasePageProperties> extends Component<Properties> {
    constructor(props: Properties) {
        super(props);
    }

    abstract renderMain(): JSX.Element;

    render(): JSX.Element {
        const sidebarSizeOnMd = this.props.sidebar ? 3 : 0;
        const sidebarSizeOnLg = this.props.sidebar ? 4 : 0;

        return (
            <div className="page-holder">
                <Row>
                    <Col className="page-body" sm={12} md={ 12 -sidebarSizeOnMd } lg={ 12 - sidebarSizeOnLg }>
                        { this.renderMain() }
                    </Col>

                    <Col className="page-sidebar" sm={12} md={ sidebarSizeOnMd } lg={ sidebarSizeOnLg }>
                        { this.props.sidebar }
                    </Col>
                </Row>
            </div>
        );
    }
}
