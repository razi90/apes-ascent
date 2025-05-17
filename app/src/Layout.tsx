import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TopNavigationBar from './components/TopNavigationBar/TopNavigationBar';
import { Box } from "@chakra-ui/react";
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

const Layout: React.FC = () => {
    const queryClient = useQueryClient();
    useEffect(() => {
        initRadixDappToolkit(queryClient);
    }, [queryClient]);

    const routes = [
        { path: "/", element: <FrontPage layoutMode={LayoutMode.DesktopExpanded} /> },
        { path: "/free_for_all", element: <Competition layoutMode={LayoutMode.DesktopExpanded} /> },
        { path: "/duels", element: <Duels layoutMode={LayoutMode.DesktopExpanded} /> },
        { path: "/profile/:id", element: <Profile layoutMode={LayoutMode.DesktopExpanded} /> },
        { path: "*", element: <UnknownPage layoutMode={LayoutMode.DesktopExpanded} /> },
    ];

    return (
        <BrowserRouter>
            <Box minH="100vh" display="flex" flexDirection="column">
                <TopNavigationBar />
                <Box flex="1" overflow="auto" position="relative">
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
