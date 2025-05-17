import { LayoutMode } from "../../Layout";
import { SystemStyleObject } from "@chakra-ui/react";

export const routePageBoxStyle = (layoutMode: LayoutMode): SystemStyleObject => {
    const baseStyles = {
        color: "#000",
        width: "100%",
        margin: "0 auto",
        padding: "20px",
        transition: "all 0.3s ease",
    };

    switch (layoutMode) {
        case LayoutMode.Mobile:
            return {
                ...baseStyles,
                maxWidth: "100%",
                padding: "12px",
            };
        case LayoutMode.DesktopMinimized:
            return {
                ...baseStyles,
                maxWidth: "calc(100% - 60px)",
                marginLeft: "60px",
            };
        case LayoutMode.DesktopExpanded:
            return {
                ...baseStyles,
                maxWidth: "container.xl",
            };
        default:
            return baseStyles;
    }
};