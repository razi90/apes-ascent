import React from 'react';
import { Button, Icon, Text, Image, VStack } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import { leftNavigationButtonStyle } from './Styled';

interface FeatureProps {
    link: string;
    title: string;
    icon: IconType | string;
    isExternal?: boolean;
}

export const LeftNavigationButton: React.FC<FeatureProps> = ({ link, title, icon, isExternal = false }) => {
    return (
        <VStack spacing={1}>
            <Link to={link} target={isExternal ? "_blank" : undefined}>
                <Button
                    sx={leftNavigationButtonStyle}
                    width="100%"
                    justifyContent="center"
                    p={2}
                >
                    {typeof icon === 'string' ? (
                        <Image src={icon} boxSize={5} borderRadius="full" />
                    ) : (
                        <Icon as={icon} boxSize={5} />
                    )}
                </Button>
            </Link>
            <Text fontSize="sm" color="gray.500">
                {title}
            </Text>
        </VStack>
    );
};

export default LeftNavigationButton;
