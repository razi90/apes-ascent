import {
    Button,
    ButtonProps,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';

interface OutlineButtonProps extends ButtonProps {
    tooltipLabel?: string;
}

export const OutlineButton: React.FC<OutlineButtonProps> = ({
    children,
    tooltipLabel,
    ...props
}) => {
    const button = (
        <Button
            bg="transparent"
            color="white"
            border="1px solid"
            borderColor="green.400"
            borderRadius="full"
            px={6}
            py={2}
            fontSize="md"
            fontWeight="medium"
            transition="all 0.2s ease-in-out"
            _hover={{
                bg: "transparent",
                color: "green.400",
                transform: "translateY(-2px)",
                boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
            }}
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