import React from "react";
import ReactConfirmAlert from 'react-confirm-alert';
import "./ConfirmAction.sass";

interface ConfirmActionProperties {
    title: string;
    message: string;
    yesHandler: () => void;
    noHandler: () => void;
}

export default class ConfirmAction extends React.Component<ConfirmActionProperties> {
    render() {
        return (
            <ReactConfirmAlert
                title={ this.props.title }
                message={ this.props.message }
                buttons={[
                    {
                        label: "Da",
                        className: "btn btn-danger btn-lg",
                        onClick: this.props.yesHandler
                    },
                    {
                        label: "Ne",
                        className: "btn btn-secondary btn-lg",
                        onClick: this.props.noHandler
                    }
                ]}
                closeOnClickOutside={ true }
                closeOnEscape={ true }
                overlayClassName="react-confirm-alert-body-element"
            />
        );
    }
}