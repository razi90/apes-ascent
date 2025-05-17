import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Here you could also log the error to an error reporting service
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <Container maxW="container.md" py={10}>
                    <VStack spacing={6} align="stretch">
                        <Box
                            p={8}
                            borderRadius="lg"
                            bg="back.800"
                            boxShadow="xl"
                            textAlign="center"
                        >
                            <Heading as="h1" size="xl" color="red.400" mb={4}>
                                Oops! Something went wrong
                            </Heading>
                            <Text color="font.600" mb={6}>
                                We apologize for the inconvenience. An error has occurred in the application.
                            </Text>
                            {process.env.NODE_ENV === 'development' && (
                                <Box
                                    p={4}
                                    bg="back.700"
                                    borderRadius="md"
                                    textAlign="left"
                                    mb={6}
                                >
                                    <Text color="red.300" fontWeight="bold" mb={2}>
                                        Error Details:
                                    </Text>
                                    <Text color="font.500" fontSize="sm" whiteSpace="pre-wrap">
                                        {this.state.error?.toString()}
                                    </Text>
                                    {this.state.errorInfo && (
                                        <Text color="font.500" fontSize="sm" mt={2} whiteSpace="pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </Text>
                                    )}
                                </Box>
                            )}
                            <Button
                                colorScheme="red"
                                onClick={this.handleReload}
                                size="lg"
                            >
                                Reload Application
                            </Button>
                        </Box>
                    </VStack>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;