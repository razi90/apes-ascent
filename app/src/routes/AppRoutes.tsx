import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Center, Spinner, Text } from '@chakra-ui/react';
import { routes } from './routes.config';
import ProtectedRoute from './ProtectedRoute';

const LoadingFallback = () => (
    <Center h="100vh">
        <Spinner size="xl" />
        <Text ml={4}>Loading page...</Text>
    </Center>
);

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {routes.map((route) => {
                    const element = route.isProtected ? (
                        <ProtectedRoute>
                            {route.element}
                        </ProtectedRoute>
                    ) : (
                        route.element
                    );

                    return (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={element}
                        />
                    );
                })}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;