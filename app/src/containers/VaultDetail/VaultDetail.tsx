import React, { useState } from 'react';
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    VStack,
    HStack,
    useColorModeValue,
    Heading,
    Divider,
    Badge,
    Tooltip,
    Icon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Progress,
    Center,
    Spinner,
} from "@chakra-ui/react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { UserAssetVault } from '../../libs/entities/UserAssetVault';
import { LayoutMode } from '../../types/layout';
import PageContainer from '../../components/Container/PageContainer/PageContainer';
import { FaChartLine, FaHistory, FaExchangeAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Trading from '../Trading/Trading';
import { addressToAsset } from '../../libs/entities/Asset';
import { useQuery } from '@tanstack/react-query';
import { fetchPriceListMap } from '../../libs/data_services/PriceDataService';

// Dummy trade history data
const dummyTradeHistory = [
    {
        id: 1,
        timestamp: '2024-03-20 14:30:00',
        type: 'BUY',
        fromToken: 'USD',
        toToken: 'BTC',
        amount: '0.5',
        price: '45000',
        total: '22500',
        status: 'COMPLETED'
    },
    {
        id: 2,
        timestamp: '2024-03-19 16:45:00',
        type: 'SELL',
        fromToken: 'ETH',
        toToken: 'USD',
        amount: '2.5',
        price: '3200',
        total: '8000',
        status: 'COMPLETED'
    },
    {
        id: 3,
        timestamp: '2024-03-18 09:15:00',
        type: 'BUY',
        fromToken: 'USD',
        toToken: 'ETH',
        amount: '3.0',
        price: '3100',
        total: '9300',
        status: 'COMPLETED'
    },
];

interface VaultDetailProps {
    layoutMode: LayoutMode;
    vault: UserAssetVault;
}

const VaultDetail: React.FC<VaultDetailProps> = ({ layoutMode, vault }) => {
    const bgColor = useColorModeValue("gray.900", "gray.900");
    const cardBgColor = useColorModeValue("gray.800", "gray.800");
    const borderColor = useColorModeValue("gray.700", "gray.700");
    const textColor = useColorModeValue("white", "white");
    const secondaryTextColor = useColorModeValue("gray.400", "gray.400");
    const accentColor = "green.400";

    // Get price list
    const { data: priceList, isLoading: priceLoading, isError: priceError } = useQuery<Record<string, number>>({
        queryKey: ['priceList'],
        queryFn: fetchPriceListMap
    });

    // Get available assets with their tickers and calculate values
    const availableAssets = Array.from(vault.assets.entries())
        .filter(([_, amount]) => amount > 0)
        .map(([address]) => {
            const asset = addressToAsset(address);
            const amount = vault.assets.get(address) || 0;
            const price = priceList?.[address] || 0;
            const value = amount * price;
            console.log(`Asset ${asset.ticker}: amount=${amount}, price=${price}, value=${value}`);
            return {
                ...asset,
                amount,
                value,
                address
            };
        });

    // Calculate total value for percentages
    const totalValue = availableAssets.reduce((sum, asset) => sum + asset.value, 0);
    console.log('Total value:', totalValue);

    // Show loading state if prices are being fetched
    if (priceLoading) {
        return (
            <PageContainer layoutMode={layoutMode} maxW="container.xl">
                <Center h="100vh">
                    <Spinner size="xl" color={accentColor} />
                    <Text ml={4} fontSize="xl" color={textColor}>Loading price data...</Text>
                </Center>
            </PageContainer>
        );
    }

    // Show error state if price fetch failed
    if (priceError || !priceList) {
        return (
            <PageContainer layoutMode={layoutMode} maxW="container.xl">
                <Center h="100vh">
                    <Text fontSize="2xl" color="red.500">
                        Failed to load price data. Please try again later.
                    </Text>
                </Center>
            </PageContainer>
        );
    }

    // Get color for asset
    const getAssetColor = (ticker: string) => {
        switch (ticker) {
            case 'BTC': return '#F7931A'; // Bitcoin orange
            case 'ETH': return '#627EEA'; // Ethereum blue
            case 'XRD': return '#00D1FF'; // Radix blue
            case 'USD': return '#4CAF50'; // Green for USD
            default: return '#FF6B6B'; // Coral red for others
        }
    };

    return (
        <PageContainer layoutMode={layoutMode} maxW="container.xl">
            <VStack spacing={6} align="stretch" p={6}>
                {/* Vault Overview */}
                <Box
                    bg={cardBgColor}
                    borderRadius="xl"
                    p={6}
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                        <GridItem>
                            <VStack align="start" spacing={2}>
                                <Text color={secondaryTextColor}>Total Value</Text>
                                <Heading size="lg" color={textColor}>${totalValue.toFixed(2)}</Heading>
                                <HStack>
                                    <Icon as={FaArrowUp} color="green.400" />
                                    <Text color="green.400">+12.5%</Text>
                                </HStack>
                            </VStack>
                        </GridItem>
                        <GridItem>
                            <VStack align="start" spacing={2}>
                                <Text color={secondaryTextColor}>24h Change</Text>
                                <Heading size="lg" color={textColor}>+$5,123.45</Heading>
                                <HStack>
                                    <Icon as={FaArrowUp} color="green.400" />
                                    <Text color="green.400">+8.3%</Text>
                                </HStack>
                            </VStack>
                        </GridItem>
                        <GridItem>
                            <VStack align="start" spacing={2}>
                                <Text color={secondaryTextColor}>Total Trades</Text>
                                <Heading size="lg" color={textColor}>24</Heading>
                                <Text color={secondaryTextColor}>Last 30 days</Text>
                            </VStack>
                        </GridItem>
                        <GridItem>
                            <VStack align="start" spacing={2}>
                                <Text color={secondaryTextColor}>Success Rate</Text>
                                <Heading size="lg" color={textColor}>92%</Heading>
                                <Text color={secondaryTextColor}>Profitable trades</Text>
                            </VStack>
                        </GridItem>
                    </Grid>
                </Box>

                {/* Current Assets */}
                <Box
                    bg={cardBgColor}
                    borderRadius="xl"
                    p={6}
                    border="1px solid"
                    borderColor={borderColor}
                >
                    <Heading size="md" mb={4} color={textColor}>Current Assets</Heading>
                    <Grid templateColumns="2fr 1fr" gap={6}>
                        {/* Asset List */}
                        <VStack spacing={3} align="stretch">
                            {availableAssets.map(asset => {
                                const percentage = ((asset.value / totalValue) * 100).toFixed(2);
                                return (
                                    <Box
                                        key={asset.address}
                                        p={4}
                                        bg="gray.700"
                                        borderRadius="lg"
                                        border="1px solid"
                                        borderColor={borderColor}
                                    >
                                        <VStack align="stretch" spacing={2}>
                                            <Flex justify="space-between" align="center">
                                                <HStack spacing={3}>
                                                    {asset.symbol}
                                                    <VStack align="start" spacing={0}>
                                                        <Text color={textColor} fontWeight="bold">{asset.ticker}</Text>
                                                        <Text color={secondaryTextColor} fontSize="sm">{percentage}%</Text>
                                                    </VStack>
                                                </HStack>
                                                <VStack align="end" spacing={0}>
                                                    <Text color={textColor}>{asset.amount.toFixed(6)}</Text>
                                                    <Text color={secondaryTextColor}>${asset.value.toFixed(2)}</Text>
                                                </VStack>
                                            </Flex>
                                        </VStack>
                                    </Box>
                                );
                            })}
                        </VStack>

                        {/* Pie Chart */}
                        <Box
                            p={4}
                            bg="gray.700"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={borderColor}
                            height="300px"
                        >
                            <Heading size="sm" mb={4} color={textColor}>Portfolio Allocation</Heading>
                            <Box height="250px">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={availableAssets.map(asset => ({
                                                name: asset.ticker,
                                                value: asset.value,
                                                color: getAssetColor(asset.ticker)
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {availableAssets.map((asset, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={getAssetColor(asset.ticker)}
                                                    stroke={cardBgColor}
                                                    strokeWidth={2}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
                                            contentStyle={{
                                                backgroundColor: cardBgColor,
                                                border: `1px solid ${borderColor}`,
                                                borderRadius: '8px',
                                                color: textColor
                                            }}
                                        />
                                        <Legend
                                            formatter={(value: string) => (
                                                <Text color={textColor} fontSize="sm">
                                                    {value}
                                                </Text>
                                            )}
                                            verticalAlign="bottom"
                                            height={36}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Box>
                    </Grid>
                </Box>

                {/* Main Content */}
                <Tabs variant="enclosed" colorScheme="green">
                    <TabList>
                        <Tab color={textColor} _selected={{ color: "green.400", bg: cardBgColor }}>
                            <HStack>
                                <Icon as={FaChartLine} />
                                <Text>Trading</Text>
                            </HStack>
                        </Tab>
                        <Tab color={textColor} _selected={{ color: "green.400", bg: cardBgColor }}>
                            <HStack>
                                <Icon as={FaHistory} />
                                <Text>Trade History</Text>
                            </HStack>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        {/* Trading Panel */}
                        <TabPanel p={0} pt={6}>
                            <Trading layoutMode={layoutMode} vault={vault} />
                        </TabPanel>

                        {/* Trade History Panel */}
                        <TabPanel p={0} pt={6}>
                            <Box
                                bg={cardBgColor}
                                borderRadius="xl"
                                p={4}
                                border="1px solid"
                                borderColor={borderColor}
                            >
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th color={secondaryTextColor}>Time</Th>
                                            <Th color={secondaryTextColor}>Type</Th>
                                            <Th color={secondaryTextColor}>From</Th>
                                            <Th color={secondaryTextColor}>To</Th>
                                            <Th color={secondaryTextColor}>Amount</Th>
                                            <Th color={secondaryTextColor}>Price</Th>
                                            <Th color={secondaryTextColor}>Total</Th>
                                            <Th color={secondaryTextColor}>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {dummyTradeHistory.map((trade) => (
                                            <Tr key={trade.id}>
                                                <Td color={textColor}>{trade.timestamp}</Td>
                                                <Td>
                                                    <Badge
                                                        colorScheme={trade.type === 'BUY' ? 'green' : 'red'}
                                                    >
                                                        {trade.type}
                                                    </Badge>
                                                </Td>
                                                <Td color={textColor}>{trade.fromToken}</Td>
                                                <Td color={textColor}>{trade.toToken}</Td>
                                                <Td color={textColor}>{trade.amount}</Td>
                                                <Td color={textColor}>${trade.price}</Td>
                                                <Td color={textColor}>${trade.total}</Td>
                                                <Td>
                                                    <Badge colorScheme="green">
                                                        {trade.status}
                                                    </Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </VStack>
        </PageContainer>
    );
};

export default VaultDetail;