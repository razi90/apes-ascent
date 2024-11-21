import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LeftNavigationBar from './components/LeftNavigationBar/LeftNavigationBar';
import TopNavigationBar from './components/TopNavigationBar/TopNavigationBar';
import { Flex, Box } from "@chakra-ui/react";
import { initRadixDappToolkit } from './libs/radix-dapp-toolkit/rdt';
import { useQueryClient } from '@tanstack/react-query';
import { useBreakpointValue } from '@chakra-ui/react';
import UnknownPage from './containers/UnknownPage/UnknownPage';
import Profile from './containers/Profile/Profile';
import { fetchLeftNavigationStatus } from './libs/navigation/LeftNavigationBarDataService';
import Competition from './containers/Competition/Competition';

export enum LayoutMode {
    Mobile,
    DesktopMinimized,
    DesktopExpanded,
}

const Layout: React.FC = () => {
    const [isMinimized, setIsMinimized] = useState(fetchLeftNavigationStatus());

    const layoutMode = useBreakpointValue({
        base: LayoutMode.Mobile,
        md: isMinimized ? LayoutMode.DesktopMinimized : LayoutMode.DesktopExpanded,
    }) ?? LayoutMode.DesktopExpanded;

    const queryClient = useQueryClient();
    useEffect(() => {
        initRadixDappToolkit(queryClient);
    }, [queryClient]);

    const routes = [
        { path: "/", element: <Competition layoutMode={layoutMode} /> },
        { path: "/profile/:id", element: <Profile layoutMode={layoutMode} /> },
        { path: "*", element: <UnknownPage layoutMode={layoutMode} /> },
    ];

    return (
        <BrowserRouter>
            <Box display="block">
                <TopNavigationBar />
                <Flex>
                    {layoutMode !== LayoutMode.Mobile && (
                        <LeftNavigationBar
                            isMinimized={isMinimized}
                            setIsMinimized={setIsMinimized}
                        />
                    )}

                    {layoutMode !== LayoutMode.Mobile ? ( // Desktop part (issue fixed with scroll effect)
                        <Routes>
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Routes>
                    ) : ( // mobile part
                        <Box flex="1">
                            <Routes>
                                {routes.map((route, index) => (
                                    <Route key={index} path={route.path} element={route.element} />
                                ))}
                            </Routes>
                        </Box>
                    )}
                </Flex>
            </Box>
        </BrowserRouter>
    );
}

export default Layout;
