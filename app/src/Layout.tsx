import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import TopNavigationBar from './components/TopNavigationBar/TopNavigationBar';
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { initRadixDappToolkit } from './libs/radix-dapp-toolkit/rdt';
import { useQueryClient } from '@tanstack/react-query';
import AppRoutes from './routes/AppRoutes';
import { LayoutMode } from './types/layout';

// Custom hook to determine layout mode based on screen size
const useLayoutMode = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const isMinimized = useBreakpointValue({ base: false, lg: false, xl: false });

    if (isMobile) {
        return LayoutMode.Mobile;
    }

    return isMinimized ? LayoutMode.DesktopMinimized : LayoutMode.DesktopExpanded;
};

const Layout: React.FC = () => {
    const queryClient = useQueryClient();
    const layoutMode = useLayoutMode();

    useEffect(() => {
        initRadixDappToolkit(queryClient);
    }, [queryClient]);

    return (
        <BrowserRouter>
            <Box minH="100vh" display="flex" flexDirection="column">
                <TopNavigationBar />
                <Box
                    flex="1"
                    overflow="auto"
                    position="relative"
                    transition="all 0.3s ease"
                    ml={layoutMode === LayoutMode.DesktopMinimized ? "60px" : "0"}
                >
                    <AppRoutes />
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default Layout;
