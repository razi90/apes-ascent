import React from 'react';
import {
    Box,
    Center,
    Flex,
    Text,
} from "@chakra-ui/react";
import { routePageBoxStyle } from '../../libs/styles/RoutePageBox';
import { LayoutMode } from '../../Layout';
import { useQuery } from '@tanstack/react-query';
import { fetchUserAssetVaults } from '../../libs/data_services/VaultDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';

interface UnknownPageProps {
    layoutMode: LayoutMode;
}

const UnknownPage: React.FC<UnknownPageProps> = ({ layoutMode }) => {
    const { data: assetVaults, isLoading: isAssetVaultFetchLoading, isError: isAssetVaultFetchError } = useQuery<UserAssetVault[]>({ queryKey: ['asset_vault_info'], queryFn: fetchUserAssetVaults });

    return (
        <Box sx={routePageBoxStyle(layoutMode)}>
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
        </Box>
    );
}

export default UnknownPage;
