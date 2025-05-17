import { LayoutMode } from "../../Layout";
import { SystemStyleObject } from "@chakra-ui/react";

export const routePageBoxStyle = (layoutMode: LayoutMode): SystemStyleObject => {
    return {
        color: "#000",
        width: "100%",
        maxWidth: "container.xl",
        margin: "0 auto",
        padding: "20px",
        transition: "all 0.5s",
    };
};