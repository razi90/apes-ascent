import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserInfo } from '../libs/data_services/UserDataService';
import { Center, Spinner, Text } from '@chakra-ui/react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user_info'],
        queryFn: fetchUserInfo,
    });

    if (isLoading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" />
                <Text ml={4}>Loading...</Text>
            </Center>
        );
    }

    if (isError || !user) {
        // Redirect to home page if not authenticated
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;