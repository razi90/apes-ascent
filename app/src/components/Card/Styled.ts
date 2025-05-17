import { SystemStyleObject } from '@chakra-ui/react';

const baseCardStyle: SystemStyleObject = {
    borderRadius: "xl",
    bg: "pElementTransparent.890",
    p: "6",
    m: "2",
    transition: "all 0.2s ease-in-out",
    border: "1px solid",
    borderColor: "transparent",
    _hover: {
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "primary.200",
        bg: "pElementTransparent.880",
    },
    _active: {
        transform: "translateY(0)",
    },
};

export const valueCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    alignItems: 'center',
    size: "lg",
    position: "relative",
    overflow: "hidden",
    _before: {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        bg: "primary.500",
        opacity: 0,
        transition: "opacity 0.2s ease-in-out",
    },
    _hover: {
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "primary.200",
        bg: "pElementTransparent.880",
        _before: {
            opacity: 1,
        },
    },
};

export const statCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    size: "lg",
    minW: "130px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2",
};

export const descriptionCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    size: "lg",
    display: "flex",
    flexDirection: "column",
    gap: "3",
};

export const carouselCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    _hover: {
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "primary.200",
        bg: "pElementTransparent.880",
        "& .card-overlay": {
            opacity: 1,
        },
    },
};

export const linkCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    cursor: "pointer",
    textDecoration: "none",
    _hover: {
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "primary.200",
        bg: "pElementTransparent.880",
        textDecoration: "none",
    },
};

export const managerCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    display: "flex",
    alignItems: "center",
    gap: "4",
};

export const primerCardStyle: SystemStyleObject = {
    ...baseCardStyle,
    bg: "primary.50",
    _hover: {
        transform: "translateY(-2px)",
        boxShadow: "lg",
        borderColor: "primary.200",
        bg: "primary.100",
    },
};