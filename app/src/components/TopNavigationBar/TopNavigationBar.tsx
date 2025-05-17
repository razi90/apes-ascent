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
} from "@chakra-ui/react";
import { WalletButton } from '../Button/WalletButton/WalletButton';
import { useColorModeValue } from "@chakra-ui/react";
import { BsTwitterX } from "react-icons/bs"
import { FaTelegramPlane } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { User } from '../../libs/entities/User';
import { fetchUserInfo } from '../../libs/data_services/UserDataService';
import { WalletDataState } from '@radixdlt/radix-dapp-toolkit';
import { fetchConnectedWallet } from '../../libs/data_services/WalletDataService';
import { LeftNavigationButton } from '../LeftNavigationBar/LeftNavigationButton';
import { GiMonkey, GiBorderedShield } from "react-icons/gi";
import { FaFistRaised, FaUserCircle } from "react-icons/fa";
import CreateUserButton from '../Button/CreateUser/CreateUserButton';

import {
    topNavigationBoxStyle,
    topNavigationHiddenBoxStyle,
    topNavigationMainFlexStyle,
    topNavigationLogoStyle,
} from "./Styled";

import { useState, useEffect } from 'react';
import Joyride, { Step } from 'react-joyride';
import { ColorModeToggle } from "../Button/ColorModeButton/ColorModeButton";
import { SocialButton } from "../Button/SocialButton/SocialButton";

export default function TopNavigationBar() {
    const bgColor = useColorModeValue("white", "#161616");
    const boxShadow = useColorModeValue("0 0 10px 0px #ccc", "0 0 10px 0px #211F34");
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
            <Box sx={topNavigationBoxStyle(bgColor, boxShadow)}>
                <Container maxW="container.xl" px={4}>
                    <Flex height="80px" align="center" justify="space-between">
                        <Flex align="center" gap={6}>
                            <Link href={"/"}>
                                <Image
                                    height="50px"
                                    width="auto"
                                    src="/images/Logo.webp"
                                    alt="Logo"
                                />
                            </Link>
                            {!isMobile && (
                                <Text fontSize="2xl" fontWeight="bold" color={"primary.300"}>
                                    Ape's Ascent
                                </Text>
                            )}
                        </Flex>

                        {!isMobile && (
                            <VStack spacing={2} flex="1" align="center">
                                <HStack spacing={6} justify="center">
                                    {wallet?.persona === undefined ? (
                                        <CreateUserButton />
                                    ) : (
                                        <>
                                            {user?.id === '' ? (
                                                <CreateUserButton />
                                            ) : (
                                                <LeftNavigationButton
                                                    link={`/profile/${filteredUserId}`}
                                                    title={user ? user.name : 'Profile'}
                                                    icon={user && user.avatar ? user.avatar : FaUserCircle}
                                                />
                                            )}
                                        </>
                                    )}
                                    <LeftNavigationButton link="/free_for_all" title="Free For All" icon={GiMonkey} />
                                    <LeftNavigationButton link="/duels" title="Duels" icon={FaFistRaised} />
                                    <LeftNavigationButton link="/clan_wars" title="Clan Wars" icon={GiBorderedShield} />
                                </HStack>
                            </VStack>
                        )}

                        <HStack spacing={4}>
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
                        arrowColor: "#6B5EFF",
                        backgroundColor: "white",
                        primaryColor: "#6B5EFF",
                        textColor: '#000',
                    },
                }}
            />
        </>
    );
}
