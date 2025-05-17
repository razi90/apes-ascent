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
} from "@chakra-ui/react";
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
    const { data: priceList } = useQuery<Record<string, number>>({
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
            return {
                ...asset,
                amount,
                value,
                address
            };
        });

    // Calculate total value for percentages
    const totalValue = availableAssets.reduce((sum, asset) => sum + asset.value, 0);

    // Get color for asset
    const getAssetColor = (ticker: string) => {
        switch (ticker) {
            case 'BTC': return 'orange.400';
            case 'ETH': return 'blue.400';
            case 'XRD': return 'green.400';
            case 'USD': return 'green.500';
            default: return 'red.400';
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
                                            <Progress
                                                value={parseFloat(percentage)}
                                                colorScheme={getAssetColor(asset.ticker).split('.')[0]}
                                                bg="gray.600"
                                                borderRadius="full"
                                                size="sm"
                                            />
                                        </VStack>
                                    </Box>
                                );
                            })}
                        </VStack>

                        {/* Allocation Summary */}
                        <Box
                            p={4}
                            bg="gray.700"
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <Heading size="sm" mb={4} color={textColor}>Portfolio Allocation</Heading>
                            <VStack spacing={4} align="stretch">
                                {availableAssets.map(asset => {
                                    const percentage = ((asset.value / totalValue) * 100).toFixed(2);
                                    return (
                                        <Box key={asset.address}>
                                            <Flex justify="space-between" mb={1}>
                                                <HStack spacing={2}>
                                                    <Box w={3} h={3} borderRadius="full" bg={getAssetColor(asset.ticker)} />
                                                    <Text color={textColor}>{asset.ticker}</Text>
                                                </HStack>
                                                <Text color={secondaryTextColor}>{percentage}%</Text>
                                            </Flex>
                                            <Progress
                                                value={parseFloat(percentage)}
                                                colorScheme={getAssetColor(asset.ticker).split('.')[0]}
                                                bg="gray.600"
                                                borderRadius="full"
                                                size="sm"
                                            />
                                        </Box>
                                    );
                                })}
                            </VStack>
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