import { SystemStyleObject } from '@chakra-ui/react';

export const outlineButtonStyle = {
    bg: "transparent",
    color: "white",
    border: "1px solid",
    borderColor: "green.400",
    borderRadius: "full",
    px: 6,
    py: 2,
    fontSize: "md",
    fontWeight: "medium",
    transition: "all 0.2s ease-in-out",
    _hover: {
        bg: "transparent",
        color: "green.400",
        transform: "translateY(-2px)",
        boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
    },
} as const;

export const iconButtonStyle = {
    bg: "transparent",
    color: "gray.400",
    border: "1px solid",
    borderColor: "gray.700",
    borderRadius: "xl",
    _hover: {
        bg: "transparent",
        color: "green.400",
        borderColor: "green.400",
        transform: "translateY(-2px)",
        boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
    },
} as const;