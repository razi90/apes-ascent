import {
    Box,
    Flex,
    Spinner,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import { fetchUserInfoById } from "../../libs/data_services/UserDataService";
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
        staleTime: 30000,
        gcTime: 300000,
        retry: 2,
    });

    // Calculate the total asset value
    const totalAssetValue = Array.from(vault.assets.entries()).reduce((sum, [assetAddress, amount]) => {
        const price = priceList[assetAddress] || 0;
        return sum + amount * price;
    }, 0);

    return (
        <Box
            p={4}
            bg="gray.800"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.700"
            transition="all 0.2s ease-in-out"
            _hover={{
                transform: "translateY(-2px)",
                borderColor: "green.400",
                boxShadow: "0 0 10px rgba(72, 187, 120, 0.2)",
            }}
        >
            <Flex direction="row" alignItems="center" justifyContent="space-between" gap={4}>
                {/* User Data Section */}
                <Box w="120px" flexShrink={0}>
                    <VStack align="center" spacing={2}>
                        {isLoading ? (
                            <Spinner size="sm" />
                        ) : isError ? (
                            <Text fontSize="xs" color="red.500">
                                Failed to load user info
                            </Text>
                        ) : user ? (
                            <>
                                <Image
                                    boxSize="40px"
                                    borderRadius="full"
                                    border="2px solid"
                                    borderColor="green.400"
                                    src={user.avatar || "/images/ape-logo.webp"}
                                    alt={`${user.name}'s Avatar`}
                                    fallbackSrc="/images/ape-logo.webp"
                                />
                                <Text
                                    fontWeight="medium"
                                    fontSize="sm"
                                    color="white"
                                    textAlign="center"
                                    noOfLines={1}
                                    w="full"
                                >
                                    {user.name || 'Unknown User'}
                                </Text>
                            </>
                        ) : (
                            <Text fontSize="xs" color="red.500">
                                User not found
                            </Text>
                        )}
                    </VStack>
                </Box>

                {/* TVL and PNL Section */}
                <Box
                    flex="1"
                    p={2}
                    borderRadius="md"
                    textAlign="center"
                    bg="transparent"
                >
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={totalAssetValue > 10000 ? 'green.400' : 'red.400'}
                        textShadow={totalAssetValue > 10000 ? "0 0 10px rgba(72, 187, 120, 0.3)" : "none"}
                    >
                        TVL: ${totalAssetValue.toFixed(2)}
                    </Text>
                    <Text
                        fontSize="sm"
                        fontWeight="medium"
                        color={totalAssetValue > 10000 ? 'green.400' : 'red.400'}
                        textShadow={totalAssetValue > 10000 ? "0 0 10px rgba(72, 187, 120, 0.3)" : "none"}
                    >
                        PNL: ${Math.abs(totalAssetValue - 10000).toFixed(2)} (
                        {((Math.abs(totalAssetValue - 10000) / 10000) * 100).toFixed(2)}%)
                    </Text>
                </Box>

                {/* Trade Button */}
                <Box w="80px" flexShrink={0}>
                    <TradeButton vault={vault} isConnected={false} />
                </Box>
            </Flex>
        </Box>
    );
};

export default VaultWithUserInfo;
