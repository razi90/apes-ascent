import React from 'react';
import { Button, Icon, Text, Image, VStack, Box } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import { leftNavigationButtonStyle } from './Styled';

interface FeatureProps {
    link: string;
    title: string;
    icon: IconType | string;
    isExternal?: boolean;
    isComingSoon?: boolean;
}

export const LeftNavigationButton: React.FC<FeatureProps> = ({ link, title, icon, isExternal = false, isComingSoon = false }) => {
    return (
        <VStack spacing={1}>
            <Link to={link} target={isExternal ? "_blank" : undefined}>
                <Button
                    sx={leftNavigationButtonStyle}
                    width="100%"
                    justifyContent="center"
                    p={3}
                    height="50px"
                    opacity={isComingSoon ? 0.7 : 1}
                    cursor={isComingSoon ? "not-allowed" : "pointer"}
                >
                    {typeof icon === 'string' ? (
                        <Image src={icon} boxSize={7} borderRadius="full" />
                    ) : (
                        <Icon as={icon} boxSize={7} />
                    )}
                </Button>
            </Link>
            <Box position="relative">
                <Text fontSize="md" color="gray.500">
                    {title}
                </Text>
                {isComingSoon && (
                    <Text
                        fontSize="xs"
                        color="red.400"
                        position="absolute"
                        top="-15px"
                        left="50%"
                        transform="translateX(-50%)"
                        whiteSpace="nowrap"
                    >
                        Coming Soon
                    </Text>
                )}
            </Box>
        </VStack>
    );
};

export default LeftNavigationButton;
