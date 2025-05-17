import {
    Box,
    Flex,
    Spinner,
    Image,
    Text,
    VStack,
    Badge,
    Tooltip,
} from "@chakra-ui/react";
import { fetchUserInfoById } from "../../libs/data_services/UserDataService";
import { User } from "../../libs/entities/User";
import { UserAssetVault } from "../../libs/entities/UserAssetVault";
import { useQuery } from "@tanstack/react-query";
import TradeButton from "../Button/TradeButton/TradeButton";
import { FaMedal, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { WalletDataState } from '@radixdlt/radix-dapp-toolkit';
import { fetchConnectedWallet } from '../../libs/data_services/WalletDataService';

interface VaultWithUserInfoProps {
    vault: UserAssetVault;
    priceList: Record<string, number>;
    rank?: number;
}

const VaultWithUserInfo: React.FC<VaultWithUserInfoProps> = ({ vault, priceList, rank }) => {
    // Fetch user info for the given userId
    const { data: user, isLoading, isError } = useQuery<User>({
        queryKey: ['user_info', vault.userId],
        queryFn: () => fetchUserInfoById(vault.userId),
        staleTime: 30000,
        gcTime: 300000,
        retry: 2,
    });

    // Fetch wallet connection state
    const { data: wallet } = useQuery<WalletDataState>({
        queryKey: ['wallet_data'],
        queryFn: fetchConnectedWallet,
    });

    // Calculate the total asset value
    const totalAssetValue = Array.from(vault.assets.entries()).reduce((sum, [assetAddress, amount]) => {
        const price = priceList[assetAddress] || 0;
        return sum + amount * price;
    }, 0);

    // Calculate PNL
    const pnl = totalAssetValue - 10000;
    const pnlPercentage = (Math.abs(pnl) / 10000) * 100;
    const isPositive = pnl >= 0;

    const neonGlow = "0 0 10px rgba(72, 187, 120, 0.3)";

    return (
        <Flex direction="row" alignItems="center" justifyContent="space-between" gap={4} p={4}>
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
                            <Box position="relative">
                                <Image
                                    boxSize="40px"
                                    borderRadius="full"
                                    border="2px solid"
                                    borderColor="green.400"
                                    src={user.avatar || "/images/ape-logo.webp"}
                                    alt={`${user.name}'s Avatar`}
                                    fallbackSrc="/images/ape-logo.webp"
                                    transition="all 0.2s ease-in-out"
                                    _hover={{
                                        transform: "scale(1.1)",
                                        boxShadow: "0 0 15px rgba(72, 187, 120, 0.4)",
                                    }}
                                />
                            </Box>
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
                <Tooltip label="Total Value Locked">
                    <Flex align="center" justify="center" mb={1}>
                        <Icon as={FaChartLine} mr={2} color="green.400" />
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={totalAssetValue > 10000 ? 'green.400' : 'red.400'}
                            textShadow={totalAssetValue > 10000 ? "0 0 10px rgba(72, 187, 120, 0.3)" : "none"}
                        >
                            ${totalAssetValue.toFixed(2)}
                        </Text>
                    </Flex>
                </Tooltip>
                <Tooltip label="Profit and Loss">
                    <Flex align="center" justify="center">
                        <Icon
                            as={isPositive ? FaArrowUp : FaArrowDown}
                            mr={2}
                            color={isPositive ? "green.400" : "red.400"}
                        />
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={isPositive ? 'green.400' : 'red.400'}
                            textShadow={isPositive ? "0 0 10px rgba(72, 187, 120, 0.3)" : "none"}
                        >
                            {isPositive ? '+' : '-'}${Math.abs(pnl).toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                        </Text>
                    </Flex>
                </Tooltip>
            </Box>

            {/* Trade Button */}
            <Box w="80px" flexShrink={0}>
                <TradeButton vault={vault} isConnected={!!wallet?.persona} />
            </Box>
        </Flex>
    );
};

export default VaultWithUserInfo;
