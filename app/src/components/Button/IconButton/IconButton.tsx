import {
    IconButton as ChakraIconButton,
    IconButtonProps,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { iconButtonStyle } from '../styles';

interface CustomIconButtonProps extends Omit<IconButtonProps, 'sx'> {
    tooltipLabel?: string;
}

export const IconButton: React.FC<CustomIconButtonProps> = ({
    tooltipLabel,
    ...props
}) => {
    const button = (
        <ChakraIconButton
            sx={iconButtonStyle}
            {...props}
        />
    );

    if (tooltipLabel) {
        return (
            <Tooltip label={tooltipLabel}>
                {button}
            </Tooltip>
        );
    }

    return button;
};