import {
    Box,
    Flex,
    Link,
    Image,
    Text,
    Center,
    Spacer,
    useBreakpointValue,
    HStack,
    Container,
    VStack,
    useColorModeValue,
    Icon,
} from "@chakra-ui/react";
import { WalletButton } from '../Button/WalletButton/WalletButton';
import { BsTwitterX } from "react-icons/bs"
import { FaTelegramPlane } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { User } from '../../libs/entities/User';
import { fetchUserInfo } from '../../libs/data_services/UserDataService';
import { WalletDataState } from '@radixdlt/radix-dapp-toolkit';
import { fetchConnectedWallet } from '../../libs/data_services/WalletDataService';
import { LeftNavigationButton } from '../LeftNavigationBar/LeftNavigationButton';
import { GiMonkey, GiBorderedShield, GiSwordman } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import CreateUserButton from '../Button/CreateUser/CreateUserButton';
import { SocialButton } from "../Button/SocialButton/SocialButton";

import {
    topNavigationBoxStyle,
    topNavigationHiddenBoxStyle,
    topNavigationMainFlexStyle,
    topNavigationLogoStyle,
} from "./Styled";

import { useState, useEffect } from 'react';
import Joyride, { Step } from 'react-joyride';

export default function TopNavigationBar() {
    const bgColor = "rgba(22, 22, 22, 0.95)";
    const boxShadow = "0 0 20px rgba(0, 0, 0, 0.2)";
    const borderColor = "gray.700";
    const textColor = "white";
    const accentColor = "green.400";
    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.5)";
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { data: user, isLoading: isUserFetchLoading } = useQuery<User>({ queryKey: ['user_info'], queryFn: fetchUserInfo });
    const { data: wallet } = useQuery<WalletDataState>({ queryKey: ['wallet_data'], queryFn: fetchConnectedWallet });

    const filteredUserId = user?.id.replace(/#/g, "");

    const [steps, setSteps] = useState<Step[]>([
        {
            target: '.wallet-first-step',
            content: 'First of all connect the wallet on the testnet. [Settings -> App Settings -> Gateways]. Afterwards get virtual XRD to pay the test fees via [Wallet Account -> Account Settings -> Dev Preferences -> Get XRD Test Tokens].',
        },
        {
            target: '.create-profile-button-first-step',
            content: 'Create your Coloseum User Profile in order to use the Colosseum platform.',
        },
        {
            target: '.create-vault-button-first-step',
            content: 'Create your vaults via the plus! Have fun :)',
        },
    ]);

    useEffect(() => {
        const localStorageItem = localStorage.getItem('joyrideCompleted');
        if (!localStorageItem) {
            localStorage.setItem('joyrideCompleted', JSON.stringify(false));
        }
    }, []);

    const handleJoyrideCallback = (data: any) => {
        if (data.status === 'finished') {
            localStorage.setItem('joyrideCompleted', JSON.stringify(true));
        }
    };

    return (
        <>
            <Box
                sx={topNavigationBoxStyle(bgColor, boxShadow)}
                borderBottom="1px solid"
                borderColor={borderColor}
                position="fixed"
                width="100%"
                zIndex="1000"
                backdropFilter="blur(10px)"
            >
                <Container maxW="container.xl" px={4}>
                    <Flex height="80px" align="center" justify="space-between">
                        <Flex align="center" gap={6}>
                            <Link
                                href={"/"}
                                _hover={{
                                    transform: "scale(1.05)",
                                    transition: "all 0.2s ease-in-out",
                                    filter: "drop-shadow(0 0 8px rgba(72, 187, 120, 0.5))"
                                }}
                            >
                                <Image
                                    height="50px"
                                    width="50px"
                                    src="/images/Logo.webp"
                                    alt="Logo"
                                    borderRadius="full"
                                    objectFit="cover"
                                    transition="all 0.2s ease-in-out"
                                    border="2px solid"
                                    borderColor="gray.700"
                                    _hover={{
                                        borderColor: "green.400",
                                    }}
                                />
                            </Link>
                            {!isMobile && (
                                <Link
                                    href="/"
                                    _hover={{
                                        textDecoration: "none",
                                        transform: "scale(1.05)",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    <Text
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        color={textColor}
                                        letterSpacing="tight"
                                        textShadow={neonGlow}
                                    >
                                        Ape's Ascent
                                    </Text>
                                </Link>
                            )}
                        </Flex>

                        {!isMobile && (
                            <VStack spacing={2} flex="1" align="center">
                                <HStack spacing={8} justify="center" minW="400px">
                                    {wallet?.persona === undefined ? (
                                        <Box minW="120px">
                                            <CreateUserButton />
                                        </Box>
                                    ) : (
                                        <>
                                            {user?.id === '' ? (
                                                <Box minW="120px">
                                                    <CreateUserButton />
                                                </Box>
                                            ) : (
                                                <LeftNavigationButton
                                                    link={`/profile/${filteredUserId}`}
                                                    title={user ? user.name : 'Profile'}
                                                    icon={user && user.avatar ? user.avatar : FaUserCircle}
                                                />
                                            )}
                                        </>
                                    )}
                                    <LeftNavigationButton
                                        link="/free_for_all"
                                        title="Free For All"
                                        icon={GiMonkey}
                                    />
                                    <LeftNavigationButton
                                        link="/duels"
                                        title="Duels"
                                        icon={GiSwordman}
                                    />
                                    {/* <LeftNavigationButton
                                        link="/clan_wars"
                                        title="Clan Wars"
                                        icon={GiBorderedShield}
                                    /> */}
                                </HStack>
                            </VStack>
                        )}

                        <HStack spacing={6}>
                            <SocialButton
                                label={'Twitter'}
                                href={`https://www.twitter.com/apes_ascent`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <BsTwitterX size={20} />
                            </SocialButton>
                            <SocialButton
                                label={'Telegram'}
                                href={`https://t.me/apes_ascent`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaTelegramPlane size={20} />
                            </SocialButton>
                            <WalletButton />
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            <Box height="80px" />

            <Joyride
                steps={steps}
                continuous
                run={!JSON.parse(localStorage.getItem('joyrideCompleted') || 'false')}
                callback={handleJoyrideCallback}
                styles={{
                    options: {
                        arrowColor: accentColor,
                        backgroundColor: bgColor,
                        primaryColor: accentColor,
                        textColor: textColor,
                        overlayColor: "rgba(0, 0, 0, 0.7)",
                    },
                }}
            />
        </>
    );
}
