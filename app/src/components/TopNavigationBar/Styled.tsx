import { SystemStyleObject } from "@chakra-ui/react";

export const topNavigationBoxStyle = (bgColor: string, boxShadow: string): SystemStyleObject => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    bg: bgColor,
    boxShadow: boxShadow,
    width: "100%",
});

export const topNavigationHiddenBoxStyle: SystemStyleObject = {
    height: "80px",
};

export const topNavigationMainFlexStyle: SystemStyleObject = {
    height: "80px",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
};

export const topNavigationLogoStyle: SystemStyleObject = {
    height: "40px",
    width: "auto",
};