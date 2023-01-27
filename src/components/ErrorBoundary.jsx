import React from "react";
import { showNotification } from "@mantine/notifications";

const ErrorContent = () => {
    return (
        <div>
            <h1>Something went wrong.</h1>
            <p>
                Please refresh the page and try again. If the problem persists,
                please contact me!
            </p>
        </div>
    );
};

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        console.log(error, info);
    }

    render() {
        if (this.state.hasError) {
            showNotification({
                title: "An error has occured somewhere on the website!",
                message: "Please refresh the site.",
            });

            return <ErrorContent />;
        }

        return this.props.children;
    }
}
