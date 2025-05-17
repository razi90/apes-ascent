import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TopNavigationBar from './components/TopNavigationBar/TopNavigationBar';
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { initRadixDappToolkit } from './libs/radix-dapp-toolkit/rdt';
import { useQueryClient } from '@tanstack/react-query';
import UnknownPage from './containers/UnknownPage/UnknownPage';
import Profile from './containers/Profile/Profile';
import Competition from './containers/Competition/Competition';
import FrontPage from './containers/FrontPage/FrontPage';
import Duels from './containers/Duels/Duels';

export enum LayoutMode {
    Mobile,
    DesktopMinimized,
    DesktopExpanded,
}

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

    const routes = [
        { path: "/", element: <FrontPage layoutMode={layoutMode} /> },
        { path: "/free_for_all", element: <Competition layoutMode={layoutMode} /> },
        { path: "/duels", element: <Duels layoutMode={layoutMode} /> },
        { path: "/profile/:id", element: <Profile layoutMode={layoutMode} /> },
        { path: "*", element: <UnknownPage layoutMode={layoutMode} /> },
    ];

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
                    <Routes>
                        {routes.map((route, index) => (
                            <Route key={index} path={route.path} element={route.element} />
                        ))}
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default Layout;
