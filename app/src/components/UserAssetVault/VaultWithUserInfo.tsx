import { Box, Flex, Spinner, Divider, HStack, Image, Text } from "@chakra-ui/react";
import { fetchUserInfoById } from "../../libs/data_services/UserDataService";
import { assetMap } from "../../libs/entities/Asset";
import { User } from "../../libs/entities/User";
import { UserAssetVault } from "../../libs/entities/UserAssetVault";
import { useQuery } from "@tanstack/react-query";
import { TradeButton } from "../Button/TradeButton/TradeButton";

interface VaultWithUserInfoProps {
    vault: UserAssetVault;
    priceList: Record<string, number>;
}

const VaultWithUserInfo: React.FC<VaultWithUserInfoProps> = ({ vault, priceList }) => {
    // Fetch user info for the given userId
    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: ['user_info', vault.userId],
        queryFn: () => fetchUserInfoById(vault.userId),
    });

    // Calculate the total asset value
    const totalAssetValue = Array.from(vault.assets.entries()).reduce((sum, [assetAddress, amount]) => {
        const price = priceList[assetAddress] || 0;
        return sum + amount * price;
    }, 0);

    return (
        <Box
            p={6}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="md"
            _hover={{ boxShadow: "lg", bg: "gray.50" }}
        >
            <Flex direction="row" alignItems="center" justifyContent="space-between" gap={4}>
                {/* User Data Section */}
                <Flex direction="column" alignItems="center" justifyContent="center" flex="1">
                    {isLoading ? (
                        <Spinner size="lg" />
                    ) : isError ? (
                        <Text fontSize="sm" color="red.500">
                            Failed to load user info
                        </Text>
                    ) : (
                        <>
                            <Image
                                boxSize="80px"
                                borderRadius="full"
                                src={user?.avatar || "/images/ape-logo.webp"}
                                alt={`${user?.name}'s Avatar`}
                                mb={2}
                            />
                            <Text fontWeight="bold" fontSize="lg">
                                {user?.name || 'Unknown User'}
                            </Text>
                        </>
                    )}
                </Flex>

                {/* TVL and PnL Section */}
                <Box
                    flex="1"
                    p={4}
                    borderRadius="md"
                    bg="gray.100"
                    textAlign="center"
                    boxShadow="sm"
                >
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={totalAssetValue > 10000 ? 'green.500' : 'red.500'}
                    >
                        TvL: ${totalAssetValue.toFixed(2)}
                    </Text>
                    <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color={totalAssetValue > 10000 ? 'green.500' : 'red.500'}
                    >
                        PnL: ${Math.abs(totalAssetValue - 10000).toFixed(2)} (
                        {((Math.abs(totalAssetValue - 10000) / 10000) * 100).toFixed(2)}%)
                    </Text>
                </Box>
                <TradeButton vault={vault} isConnected={false}></TradeButton>
            </Flex>
        </Box>
    );
};

export default VaultWithUserInfo;