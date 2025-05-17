import {
    Button,
    ButtonProps,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { outlineButtonStyle } from '../styles';

interface CustomButtonProps extends Omit<ButtonProps, 'sx'> {
    tooltipLabel?: string;
}

export const OutlineButton: React.FC<CustomButtonProps> = ({
    children,
    tooltipLabel,
    ...props
}) => {
    const button = (
        <Button
            sx={outlineButtonStyle}
            {...props}
        >
            {children}
        </Button>
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