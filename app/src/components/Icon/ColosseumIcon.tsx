import {
    Flex,
    Stack,
    Icon,
    Image
} from "@chakra-ui/react";

interface ColosseumIconProps {
    icon: any;
    color: string;
}

interface ColosseumImageIconProps {
    imageSrc: any;
    altText: string;
}

export const ColosseumIcon = ({ icon, color }: ColosseumIconProps) => {
    return (
        <Stack align={"left"}>
            <Flex
                w={{ base: 10, sm: 10 }}
                h={{ base: 10, sm: 10 }}
                align={"center"}
                justify={"center"}
                rounded={"full"}
                bg={"pElementTransparent.890"}
            >
                <Icon as={icon} color={color} w={{ base: 6, sm: 6 }} h={{ base: 6, sm: 6 }} />

            </Flex>
        </Stack>
    );
};

export const ColosseumImageIcon = ({ imageSrc, altText }: ColosseumImageIconProps) => {
    return (
        <Stack align={"left"}>
            <Flex
                w={{ base: 10, sm: 10 }}
                h={{ base: 10, sm: 10 }}
                align={"center"}
                justify={"center"}
                rounded={"full"}
                bg={"pElementTransparent.890"}
            >
                <Image
                    src={imageSrc}
                    alt={altText}
                    w={{ base: 6, sm: 6 }}
                    h={{ base: 6, sm: 6 }}
                    borderRadius={"full"}
                />

            </Flex>
        </Stack>
    );
};
