import React from 'react';
import { Button, Icon, Text, Image } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import { leftNavigationButtonStyle } from './Styled';

interface FeatureProps {
    link: string;
    title: string;
    icon: IconType | string;
    isExternal?: boolean;
    navIsMinimized: boolean;
}

export const LeftNavigationButton: React.FC<FeatureProps> = ({ link, title, icon, isExternal = false, navIsMinimized }) => {
    return (
        <Link to={link} target={isExternal ? "_blank" : undefined}>
            <Button
                sx={leftNavigationButtonStyle}
                width="100%"
                justifyContent="flex-start"
                pl={4}
            >
                {typeof icon === 'string' ? (
                    <Image src={icon} boxSize={5} mr={3} borderRadius="full" />
                ) : (
                    <Icon as={icon} boxSize={5} mr={3} />
                )}
                <Text>{navIsMinimized ? "" : title}</Text>
            </Button>
        </Link>
    );
};

export default LeftNavigationButton;
