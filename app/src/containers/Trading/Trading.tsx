import React, { useState, lazy, Suspense } from 'react';
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    VStack,
    HStack,
    Select,
    Input,
    Button,
    useColorModeValue,
    Heading,
    Divider,
    Badge,
    Tooltip,
    Icon,
    Spinner,
    Center,
} from "@chakra-ui/react";
import { useQuery } from '@tanstack/react-query';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import { LayoutMode } from '../../types/layout';
import PageContainer from '../../components/Container/PageContainer/PageContainer';
import { FaExchangeAlt, FaChartLine, FaInfoCircle } from 'react-icons/fa';
import { addressToAsset, Asset } from '../../libs/entities/Asset';

// Lazy load TradingView widget
const TradingViewWidget = lazy(() => import('../../components/TradingView/TradingViewWidget'));

interface TradingProps {
    layoutMode: LayoutMode;
    vault: UserAssetVault;
}

const Trading: React.FC<TradingProps> = ({ layoutMode, vault }) => {
    const bgColor = useColorModeValue("gray.900", "gray.900");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    // Fetch price list
    const { data: priceList, isLoading: priceLoading } = useQuery<Record<string, number>>({
        queryKey: ['price_list'],
        queryFn: fetchPriceListMap,
    });

    // Get available assets with their tickers
    const availableAssets = Array.from(vault.assets.entries())
        .filter(([_, amount]) => amount > 0)
        .map(([address]) => addressToAsset(address));

    // State for trading
    const [fromAsset, setFromAsset] = useState<Asset>(availableAssets[0]);
    const [toAsset, setToAsset] = useState<Asset>(availableAssets[1]);
    const [amount, setAmount] = useState<string>('');
    const [estimatedAmount, setEstimatedAmount] = useState<string>('');

    // Calculate estimated amount when amount or tokens change
    React.useEffect(() => {
        if (amount && priceList && fromAsset && toAsset) {
            const fromPrice = priceList[fromAsset.address] || 0;
            const toPrice = priceList[toAsset.address] || 0;
            const estimated = (parseFloat(amount) * fromPrice) / toPrice;
            setEstimatedAmount(estimated.toFixed(6));
        } else {
            setEstimatedAmount('');
        }
    }, [amount, fromAsset, toAsset, priceList]);

    // Handle swap
    const handleSwap = () => {
        // TODO: Implement actual swap logic
        console.log('Swapping', amount, fromAsset.ticker, 'to', estimatedAmount, toAsset.ticker);
    };

    return (
        <PageContainer layoutMode={layoutMode} maxW="container.xl">
            <Grid
                templateColumns="repeat(12, 1fr)"
                gap={6}
                p={6}
            >
                {/* Chart Section */}
                <GridItem colSpan={8}>
                    <Box
                        bg={cardBgColor}
                        borderRadius="xl"
                        p={4}
                        border="1px solid"
                        borderColor={borderColor}
                        height="600px"
                    >
                        <Suspense fallback={
                            <Center h="100%">
                                <Spinner size="xl" color={accentColor} />
                            </Center>
                        }>
                            <TradingViewWidget symbol={`${fromAsset.ticker}USD`} />
                        </Suspense>
                    </Box>
                </GridItem>

                {/* Trading Interface */}
                <GridItem colSpan={4}>
                    <VStack spacing={6} align="stretch">
                        {/* Current Positions */}
                        <Box
                            bg={cardBgColor}
                            borderRadius="xl"
                            p={4}
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <Heading size="md" mb={4} color={textColor}>Current Positions</Heading>
                            <VStack spacing={3} align="stretch">
                                {availableAssets.map(asset => (
                                    <Flex
                                        key={asset.address}
                                        justify="space-between"
                                        align="center"
                                        p={2}
                                        bg="gray.700"
                                        borderRadius="md"
                                    >
                                        <HStack>
                                            {asset.symbol}
                                            <Text color={textColor}>{asset.ticker}</Text>
                                        </HStack>
                                        <HStack>
                                            <Text color={textColor}>
                                                {vault.assets.get(asset.address)?.toFixed(6)}
                                            </Text>
                                            <Text color={secondaryTextColor}>
                                                (${((vault.assets.get(asset.address) || 0) * (priceList?.[asset.address] || 0)).toFixed(2)})
                                            </Text>
                                        </HStack>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>

                        {/* Market Swap */}
                        <Box
                            bg={cardBgColor}
                            borderRadius="xl"
                            p={4}
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <Heading size="md" mb={4} color={textColor}>Market Swap</Heading>
                            <VStack spacing={4} align="stretch">
                                {/* From Token */}
                                <Box>
                                    <Text color={secondaryTextColor} mb={2}>From</Text>
                                    <HStack>
                                        <Select
                                            value={fromAsset.address}
                                            onChange={(e) => setFromAsset(addressToAsset(e.target.value))}
                                            bg="gray.700"
                                            color={textColor}
                                            borderColor={borderColor}
                                        >
                                            {availableAssets.map(asset => (
                                                <option key={asset.address} value={asset.address}>
                                                    {asset.ticker}
                                                </option>
                                            ))}
                                        </Select>
                                        <Input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.0"
                                            bg="gray.700"
                                            color={textColor}
                                            borderColor={borderColor}
                                        />
                                    </HStack>
                                </Box>

                                {/* Swap Icon */}
                                <Flex justify="center">
                                    <Icon as={FaExchangeAlt} color={accentColor} boxSize={6} />
                                </Flex>

                                {/* To Token */}
                                <Box>
                                    <Text color={secondaryTextColor} mb={2}>To</Text>
                                    <HStack>
                                        <Select
                                            value={toAsset.address}
                                            onChange={(e) => setToAsset(addressToAsset(e.target.value))}
                                            bg="gray.700"
                                            color={textColor}
                                            borderColor={borderColor}
                                        >
                                            {availableAssets.map(asset => (
                                                <option key={asset.address} value={asset.address}>
                                                    {asset.ticker}
                                                </option>
                                            ))}
                                        </Select>
                                        <Input
                                            value={estimatedAmount}
                                            isReadOnly
                                            placeholder="0.0"
                                            bg="gray.700"
                                            color={textColor}
                                            borderColor={borderColor}
                                        />
                                    </HStack>
                                </Box>

                                {/* Swap Button */}
                                <Button
                                    colorScheme="green"
                                    size="lg"
                                    onClick={handleSwap}
                                    isDisabled={!amount || !estimatedAmount}
                                >
                                    Swap
                                </Button>

                                {/* Price Info */}
                                {amount && estimatedAmount && (
                                    <Box
                                        p={3}
                                        bg="gray.700"
                                        borderRadius="md"
                                        fontSize="sm"
                                    >
                                        <HStack justify="space-between">
                                            <Text color={secondaryTextColor}>Price</Text>
                                            <Text color={textColor}>
                                                1 {fromAsset.ticker} = {(parseFloat(estimatedAmount) / parseFloat(amount)).toFixed(6)} {toAsset.ticker}
                                            </Text>
                                        </HStack>
                                    </Box>
                                )}
                            </VStack>
                        </Box>
                    </VStack>
                </GridItem>
            </Grid>
        </PageContainer>
    );
};

export default Trading;