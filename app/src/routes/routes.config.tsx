import { lazy } from 'react';
import { LayoutMode } from '../types/layout';

// Lazy load components for code splitting
const FrontPage = lazy(() => import('../containers/FrontPage/FrontPage'));
const Competition = lazy(() => import('../containers/Competition/Competition'));
const Duels = lazy(() => import('../containers/Duels/Duels'));
const Profile = lazy(() => import('../containers/Profile/Profile'));
const UnknownPage = lazy(() => import('../containers/UnknownPage/UnknownPage'));
const TradingPage = lazy(() => import('../pages/trading'));

export interface RouteConfig {
    path: string;
    element: React.ReactNode;
    isProtected?: boolean;
    layoutMode?: LayoutMode;
}

export const routes: RouteConfig[] = [
    {
        path: '/',
        element: <FrontPage layoutMode={LayoutMode.DesktopExpanded} />,
        isProtected: false,
    },
    {
        path: '/free_for_all',
        element: <Competition layoutMode={LayoutMode.DesktopExpanded} />,
        isProtected: true,
    },
    {
        path: '/duels',
        element: <Duels layoutMode={LayoutMode.DesktopExpanded} />,
        isProtected: true,
    },
    {
        path: '/profile/:id',
        element: <Profile layoutMode={LayoutMode.DesktopExpanded} />,
        isProtected: true,
    },
    {
        path: '/trading',
        element: <TradingPage />,
        isProtected: true,
    },
    {
        path: '*',
        element: <UnknownPage layoutMode={LayoutMode.DesktopExpanded} />,
        isProtected: false,
    },
];