import React from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
} from "@chakra-ui/react";
import { LayoutMode } from '../../types/layout';
import PageContainer from '../../components/Container/PageContainer/PageContainer';

interface UnknownPageProps {
    layoutMode: LayoutMode;
}

const UnknownPage: React.FC<UnknownPageProps> = ({ layoutMode }) => {
    return (
        <PageContainer layoutMode={layoutMode}>
            <Flex
                w="100%"
                h="80vh"
                alignItems="center"
                justifyContent="center"
            >
                <Center>
                    <Text fontSize={"40px"}>
                        Oops, I can't find the current path. <br />
                        Please check the path.
                    </Text>
                </Center>
            </Flex>
        </PageContainer>
    );
};

export default UnknownPage;
