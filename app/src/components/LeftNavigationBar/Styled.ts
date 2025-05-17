export const leftNavigationToggleButtonStyle = (isMinimized: any) => ({
    title: "Toogle",
    w: isMinimized ? "60px" : "200px",
    transition: "width 0.3s",
    position: "absolute",
    bottom: "20",

    color: "primary.300",
    size: "md",
    borderRadius: "sm",
    bg: "pElementTransparent.895",
    mr: "0",
    _hover: {
        textDecoration: "none",
        bg: "pElementTransparent.870",
    },
});

export const leftNavigationToggleIconStyle = {

    alignSelf: "center",
    color: "pElement.200",
    w: { base: 6, sm: 6 },
    h: { base: 6, sm: 6 },
};


export const leftNavigationButtonStyle = {
    size: "md",
    borderRadius: "full",
    bg: "transparent",
    py: "6",
    color: "white",
    transition: "all 0.2s ease-in-out",
    _hover: {
        textDecoration: "none",
        bg: "transparent",
        color: "green.400",
        transform: "translateY(-2px)",
        filter: "drop-shadow(0 0 8px rgba(72, 187, 120, 0.5))",
    },
};

export const leftNavigationMainBoxStyle = (bgColor: string, boxShadow: string) => ({
    boxShadow: boxShadow,
    bg: bgColor,
    transition: "width 0.3s",
    height: '100%',
    position: "fixed"
});

export const leftNavigationMainVStackStyle = {
    spacing: "4",
    pt: "4",
};

export const leftNavigationDividerBoxStyle = (isMinimized: any) => ({
    px: "4",
    align: "center",
    w: "100%",
    borderColor: 'gray.700',
    borderBottom: "1px solid",
});
