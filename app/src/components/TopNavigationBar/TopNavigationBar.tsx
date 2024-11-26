import {
    Box,
    Flex,
    Link,
    Image,
    Text,
    Center,
    Spacer,
    useBreakpointValue,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import { WalletButton } from '../Button/WalletButton/WalletButton';
import { useColorModeValue } from "@chakra-ui/react";


import {
    topNavigationBoxStyle,
    topNavigationHiddenBoxStyle,
    topNavigationMainFlexStyle,
    topNavigationLogoStyle,
} from "./Styled";

import { useState, useEffect } from 'react';
import Joyride, { Step } from 'react-joyride';

import { NavigationItems } from "../LeftNavigationBar/NavigationItems";
import { ColorModeToggle } from "../Button/ColorModeButton/ColorModeButton";

export default function TopNavigationBar() {
    const bgColor = useColorModeValue("white", "#161616");
    const boxShadow = useColorModeValue("0 0 10px 0px #ccc", "0 0 10px 0px #211F34");
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { isOpen, onOpen, onClose } = useDisclosure();

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
                <Center>
                    <Flex sx={topNavigationMainFlexStyle} alignItems="center">
                        {isMobile && (
                            <IconButton
                                aria-label="Toggle Menu"
                                icon={<HamburgerIcon />}
                                onClick={onOpen}
                                variant="outline"
                                mr={2}
                            />
                        )}
                        <Flex alignItems="center" gap={6}>
                            <Link href={"/"}>
                                <Image
                                    align={"center"}
                                    sx={topNavigationLogoStyle}
                                    src="/images/logo3.webp"
                                    alt="Colosseum Logo"
                                />
                            </Link>
                            {!isMobile && (
                                <Text fontSize="2xl" fontWeight="bold" color={"primary.300"}>
                                    Ape's Ascent
                                </Text>
                            )}
                        </Flex>

                        <Spacer />

                        <WalletButton />
                    </Flex>
                </Center>
            </Box>

            <Box sx={topNavigationHiddenBoxStyle} />

            <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody bg={bgColor}>
                        <NavigationItems />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

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
