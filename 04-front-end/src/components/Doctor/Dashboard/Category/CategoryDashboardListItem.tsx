import React, { Component } from "react";
import CategoryModel from "../../../../../../03-back-end/src/components/category/model";
import { Col, Card, Button, InputGroup, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import CategoryService from "../../../../services/CategoryService";
import EventRegister from '../../../../api/EventRegister';
import ConfirmAction from "../../../Misc/ConfirmAction";

interface CategoryDashboardListItemProperties {
    category: CategoryModel;
}

interface CategoryDashboardListItemState {
    isFieldEditable: boolean;
    categoryName: string;
    message: string;
    showDeleteDialog: boolean;
    deleteDialogYesHandler: () => void;
    deleteDialogNoHandler: () => void;
}

export default class CategoryDashboardListItem extends Component<CategoryDashboardListItemProperties> {
    state: CategoryDashboardListItemState;

    constructor(props: CategoryDashboardListItemProperties) {
        super(props);

        this.state = {
            isFieldEditable: false,
            categoryName: this.props.category.name,
            message: "",
            showDeleteDialog: false,
            deleteDialogYesHandler: () => {},
            deleteDialogNoHandler: () => {
                this.setState({
                    showDeleteDialog: false,
                })
            }
        }
    }


    private handleConfirmEditButtonClick() {
        if (this.state.categoryName.length === 0) {
            return this.exitEditMode();
        }

        CategoryService.editCategory(this.props.category.categoryId, this.state.categoryName)
            .then(res => {
                if (res.success === false) {
                    this.setState({
                        message: res.message
                    });
                } else {
                    this.setState({
                        message: "Kategorija uspešno izmenjena"
                    });

                    EventRegister.emit("CATEGORY_EVENT", "category.update");

                    setTimeout(() => {
                        this.setState({
                            message: "",
                            isFieldEditable: ""
                        });
                    }, 2000);
                }
            });
    }

    private switchToEditMode() {
        this.setState({
            isFieldEditable: true
        });
    }

    private exitEditMode() {
        this.setState({
            isFieldEditable: false,
            categoryName: this.props.category.name
        });
    }

    private onChangeInput(field: "categoryName"): (event: React.ChangeEvent<HTMLInputElement>) => void {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
                [field]: event.target.value,
            });
        }
    }

    private getDeleteHandler(categoryId: number) {
        return () => {
            this.setState({
                showDeleteDialog: true,
                deleteDialogYesHandler: () => {
                   CategoryService.deleteCategory(categoryId)
                   .then(res => {
                        if (res) {
                            EventRegister.emit("CATEGORY_EVENT", "category-delete-success");
                        } else {
                            EventRegister.emit("CATEGORY_EVENT", "category-delete-fail");
                        }
                        
                        this.setState({
                            showDeleteDialog: false
                        });
                   })
                }
            });
        };
    }

    render() {
        return (
            <>
                {
                    this.state.showDeleteDialog ? (
                        <ConfirmAction
                            title="Brisanje kategorije iz liste?"
                            message="Da li ste sigurni da želite da uklonite kategoriju iz liste?"
                            yesHandler={ this.state.deleteDialogYesHandler }
                            noHandler={ this.state.deleteDialogNoHandler } />
                    ): ""
                }

                <Col xs={ 12 } sm={ 6 } md={ 4 } lg={ 3 } className="mt-3">
                    <Card>
                        <Card.Body>
                            <Card.Title>                   
                                {
                                    this.state.isFieldEditable ?
                                    (
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                value={ this.state.categoryName }
                                                onChange={ this.onChangeInput("categoryName") }
                                            />
                                        </InputGroup>
                                    ) :
                                    (
                                        <p>{ this.props.category.name }</p>
                                    )
                                }     
                                
                            </Card.Title>
                            <Card.Text as="div">
                                <strong>Usluge:</strong>
                                <ul>
                                {
                                    this.props.category.services.length === 0 ? <li>Nema usluga za ovu kategoriju</li> :
                                    this.props.category.services.map(service => (
                                        <li>{ service.name }</li>
                                    ))
                                }
                                </ul>
                            </Card.Text>
                            <Card.Text as="div" className="mt-1">
                                {
                                    this.state.isFieldEditable ? 
                                    ( 
                                        <>
                                            <Button onClick= { () => this.handleConfirmEditButtonClick() } size="sm" block variant="success">Potrvdi izmenu</Button>
                                            <Button className="mx-1" onClick={ () => this.exitEditMode() } size="sm" block variant="secondary">Odustani</Button>
                                        </>
                                    ) : 
                                    (
                                        <>
                                            <Button onClick={ () => this.switchToEditMode() } size="sm" block variant="secondary">Izmeni</Button>
                                            <Button onClick={ this.getDeleteHandler(this.props.category.categoryId) } size="sm" className="mx-1" block variant="danger">Obriši</Button>
                                        </>
                                    )
                                }
                                
                            </Card.Text>
                            <Card.Text>
                                { this.state.message }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </>
        )
    }
}
