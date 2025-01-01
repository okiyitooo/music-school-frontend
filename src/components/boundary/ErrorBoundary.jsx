import React, { Component } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // You can also log the error to an error reporting service
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box textAlign="center" py={10} px={6}>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Something went wrong.
                    </Text>
                    <Text mb={4}>{this.state.error && this.state.error.toString()}</Text>
                    <Button colorScheme="teal" onClick={this.handleReload}>
                        Reload Page
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;