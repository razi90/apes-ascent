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
    });

    // Calculate the total asset value
    const totalAssetValue = Array.from(vault.assets.entries()).reduce((sum, [assetAddress, amount]) => {
        const price = priceList[assetAddress] || 0;
        return sum + amount * price;
    }, 0);

    return (
        <Box
            p={6}
            bg="back.600"
            borderRadius="lg"
            border="1px solid" // Ensure a visible border is applied
            borderColor="back.500" // Default border color set to gray
            boxShadow="none" // No shadow by default
            _hover={{
                transform: "scale(1.05)",
                transition: "all 0.3s",
                boxShadow: "shadow.primary.500", // Add shadow on hover
                borderColor: "primary.300", // Change border color to green on hover
            }}
            color="font.300"
        >


            <Flex direction="row" alignItems="center" justifyContent="space-between" gap={6}>
                {/* User Data Section */}
                <VStack align="center" flex="1" spacing={3}>
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
                                border="2px solid"
                                borderColor="primary.300"
                                src={user?.avatar || "/images/ape-logo.webp"}
                                alt={`${user?.name}'s Avatar`}
                            />
                            <Text fontWeight="bold" fontSize="lg" color="font.900">
                                {user?.name || 'Unknown User'}
                            </Text>
                        </>
                    )}
                </VStack>

                {/* TVL and PNL Section */}
                <Box
                    flex="1"
                    p={4}
                    borderRadius="md"
                    textAlign="center"
                    boxShadow="sm"
                    borderColor="back.500"
                    bg="transparent"
                >
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={totalAssetValue > 10000 ? 'primary.300' : 'red.500'}
                    >
                        TVL: ${totalAssetValue.toFixed(2)}
                    </Text>
                    <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={totalAssetValue > 10000 ? 'primary.300' : 'red.500'}
                    >
                        PNL: ${Math.abs(totalAssetValue - 10000).toFixed(2)} (
                        {((Math.abs(totalAssetValue - 10000) / 10000) * 100).toFixed(2)}%)
                    </Text>
                </Box>

                {/* Trade Button */}
                <TradeButton vault={vault} isConnected={false} />
            </Flex>
        </Box>
    );
};

export default VaultWithUserInfo;
