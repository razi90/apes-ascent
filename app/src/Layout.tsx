import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import TopNavigationBar from './components/TopNavigationBar/TopNavigationBar';
import { Box, useBreakpointValue, useToast, UseToastOptions, useColorModeValue } from "@chakra-ui/react";
import { initRadixDappToolkit, cleanupRadixDappToolkit } from './libs/radix-dapp-toolkit/rdt';
import { useQueryClient } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import { LayoutMode } from './types/layout';

// Type for the layout mode hook result
type LayoutModeResult = LayoutMode.Mobile | LayoutMode.DesktopMinimized | LayoutMode.DesktopExpanded;

// Custom hook to determine layout mode based on screen size
const useLayoutMode = (): LayoutModeResult => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const isMinimized = useBreakpointValue({ base: false, lg: false, xl: false });

    if (isMobile) {
        return LayoutMode.Mobile;
    }

    return isMinimized ? LayoutMode.DesktopMinimized : LayoutMode.DesktopExpanded;
};

// Type for the error toast options
const getErrorToastOptions = (error?: string): UseToastOptions => ({
    title: "Wallet Connection Error",
    description: error || "Failed to initialize wallet connection. Please refresh the page.",
    status: "error",
    duration: 5000,
    isClosable: true,
});

const Layout: React.FC = () => {
    const queryClient = useQueryClient();
    const layoutMode = useLayoutMode();
    const [isInitializing, setIsInitializing] = useState<boolean>(true);
    const toast = useToast();
    const bgColor = useColorModeValue("gray.50", "gray.900");

    const initializeRadix = useCallback(async (): Promise<void> => {
        setIsInitializing(true);
        try {
            const result = await initRadixDappToolkit(queryClient);

            if (!result.success) {
                toast(getErrorToastOptions(result.error));
            }
        } catch (error) {
            toast(getErrorToastOptions(error instanceof Error ? error.message : undefined));
        } finally {
            setIsInitializing(false);
        }
    }, [queryClient, toast]);

    useEffect(() => {
        initializeRadix();

        // Cleanup function
        return () => {
            cleanupRadixDappToolkit();
        };
    }, [initializeRadix]);

    return (
        <BrowserRouter>
            <Box
                minH="100vh"
                display="flex"
                flexDirection="column"
                bg={bgColor}
                transition="background-color 0.3s ease"
            >
                <TopNavigationBar />
                <Box
                    flex="1"
                    overflow="auto"
                    position="relative"
                    transition="all 0.3s ease"
                    ml={layoutMode === LayoutMode.DesktopMinimized ? "60px" : "0"}
                    pt={4}
                    px={4}
                >
                    {!isInitializing && (
                        <Box
                            maxW="container.xl"
                            mx="auto"
                            transition="all 0.3s ease"
                        >
                            <AppRoutes />
                        </Box>
                    )}
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default Layout;
