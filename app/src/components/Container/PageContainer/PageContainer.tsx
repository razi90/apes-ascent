import React from 'react';
import {
    Box,
    Container,
    useColorModeValue,
} from "@chakra-ui/react";
import { LayoutMode } from '../../../types/layout';
import { routePageBoxStyle } from '../../../libs/styles/RoutePageBox';

interface PageContainerProps {
    layoutMode: LayoutMode;
    children: React.ReactNode;
    maxW?: string;
    py?: number | string;
}

const PageContainer: React.FC<PageContainerProps> = ({
    layoutMode,
    children,
    maxW = "container.lg",
    py = 8,
}) => {
    const bgColor = useColorModeValue("gray.900", "gray.900");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");

    return (
        <Container maxW={maxW} py={py}>
            <Box
                sx={routePageBoxStyle(layoutMode)}
                bg={bgColor}
                borderRadius="2xl"
                boxShadow="lg"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
            >
                <Box bg={cardBgColor}>
                    {children}
                </Box>
            </Box>
        </Container>
    );
};

export default PageContainer;