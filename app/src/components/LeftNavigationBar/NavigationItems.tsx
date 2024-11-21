import React from 'react';
import { VStack, Box, Button, Icon } from '@chakra-ui/react';
import { FaMedal, FaUserCircle, FaFistRaised } from "react-icons/fa";
import { GiMonkey, GiBorderedShield } from "react-icons/gi";

import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

import {
    leftNavigationMainVStackStyle,
    leftNavigationDividerBoxStyle,
    leftNavigationToggleButtonStyle,
    leftNavigationToggleIconStyle,
} from "./Styled";
import CreateUserButton from '../Button/CreateUser/CreateUserButton';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../libs/entities/User';
import { fetchUserInfo } from '../../libs/data_services/UserDataService';
import { WalletDataState } from '@radixdlt/radix-dapp-toolkit';
import { fetchConnectedWallet } from '../../libs/data_services/WalletDataService';
import { LeftNavigationButton } from './LeftNavigationButton';

interface NavigationItemsProps {
    isMinimized?: boolean;
    toggleMinimize?: () => void;
}

export const NavigationItems: React.FC<NavigationItemsProps> = ({ isMinimized = false, toggleMinimize }) => {
    const { data: user, isLoading: isUserFetchLoading, isError: isUserFetchError } = useQuery<User>({ queryKey: ['user_info'], queryFn: fetchUserInfo });
    const { data: wallet, isLoading: isWalletFetchLoading, isError: isWalletFetchError } = useQuery<WalletDataState>({ queryKey: ['wallet_data'], queryFn: fetchConnectedWallet });

    const filteredUserId = user?.id.replace(/#/g, "");

    return (
        <VStack
            align="stretch"
            justify="space-between" // Distribute space to push the image to the bottom
            sx={leftNavigationMainVStackStyle}
            height="100vh" // Ensure the VStack takes full viewport height
        >
            {/* Navigation Items */}
            <VStack align="stretch" spacing={4}>
                {wallet?.persona === undefined ? (
                    <CreateUserButton
                        navIsMinimized={isMinimized}
                    />
                ) : (
                    <>
                        {user?.id === '' ? (
                            <CreateUserButton
                                navIsMinimized={isMinimized}
                            />
                        ) : (
                            <LeftNavigationButton
                                link={`/profile/${filteredUserId}`}
                                title={user ? user.name : 'Profile'}
                                icon={user && user.avatar ? user.avatar : FaUserCircle}
                                navIsMinimized={isMinimized}
                            />
                        )}
                    </>
                )}

                <Box sx={leftNavigationDividerBoxStyle(isMinimized)} />

                <LeftNavigationButton link="/free_for_all" title="Free For All" icon={GiMonkey} navIsMinimized={isMinimized} />
                <LeftNavigationButton link="/duels" title="Duels" icon={FaFistRaised} navIsMinimized={isMinimized} />
                <LeftNavigationButton link="/clan_wars" title="Clan Wars" icon={GiBorderedShield} navIsMinimized={isMinimized} />

                {/* <Box sx={leftNavigationDividerBoxStyle(isMinimized)} /> */}
                {/* <LeftNavigationButton link="https://docs.colosseum.com/" title="Documentation" icon={FaBookOpen} navIsMinimized={isMinimized} isExternal={true} /> */}
                {/* <LeftNavigationButton link="https://x.com/colosseum/" title="X / Twitter" icon={FaTwitter} navIsMinimized={isMinimized} isExternal={true} /> */}
                {/* <LeftNavigationButton link="https://t.me/Colosseum" title="Telegram" icon={FaTelegram} navIsMinimized={isMinimized} isExternal={true} /> */}

                {/* {!isMinimized && (
                    <Box>
                        <Box sx={leftNavigationDividerBoxStyle(isMinimized)} />
                        <Box padding="4" textAlign="center" display="flex" justifyContent="center" >
                            <Image
                                src="/images/runs-on-radix-flat.png"
                                alt="Runs On Radix"
                                objectFit="contain"
                            />
                        </Box>
                    </Box>
                )} */}

                {toggleMinimize && (
                    <Box>
                        <Button
                            onClick={toggleMinimize}
                            sx={leftNavigationToggleButtonStyle(isMinimized)}
                        >
                            {isMinimized ?
                                <Icon as={ArrowRightIcon} sx={leftNavigationToggleIconStyle} />
                                :
                                <Icon as={ArrowLeftIcon} sx={leftNavigationToggleIconStyle} />
                            }
                        </Button>
                    </Box>
                )}
            </VStack>
        </VStack>
    );
};
