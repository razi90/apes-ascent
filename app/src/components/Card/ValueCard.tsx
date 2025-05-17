import {
    Box,
    Flex,
    Heading,
    Text,
    SkeletonText,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { valueCardStyle } from './Styled';

interface ValueCardProps {
    value: string | number;
    description: string;
    isLoading: boolean;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const ValueCard: React.FC<ValueCardProps> = ({
    value,
    description,
    isLoading,
    icon,
    trend,
}) => {
    const valueColor = useColorModeValue("gray.800", "white");
    const descriptionColor = useColorModeValue("gray.600", "gray.400");
    const trendColor = useColorModeValue(
        trend?.isPositive ? "green.500" : "red.500",
        trend?.isPositive ? "green.300" : "red.300"
    );

    return (
        <>
            {isLoading ? (
                <Box flex='1' flexWrap='wrap' sx={valueCardStyle}>
                    <SkeletonText mt='2' noOfLines={2} spacing='4' skeletonHeight='2' />
                </Box>
            ) : (
                <Flex flex='1' flexWrap='wrap' sx={valueCardStyle}>
                    <Box w="100%">
                        <Flex align="center" justify="center" gap={2} mb={2}>
                            {icon && (
                                <Box color="primary.500">
                                    {icon}
                                </Box>
                            )}
                            <Heading
                                size='md'
                                textAlign="center"
                                color={valueColor}
                                fontWeight="bold"
                            >
                                {value}
                            </Heading>
                        </Flex>
                        <Text
                            textAlign="center"
                            color={descriptionColor}
                            fontSize="sm"
                        >
                            {description}
                        </Text>
                        {trend && (
                            <Flex
                                align="center"
                                justify="center"
                                mt={2}
                                color={trendColor}
                                fontSize="sm"
                                fontWeight="medium"
                            >
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </Flex>
                        )}
                    </Box>
                </Flex>
            )}
        </>
    );
};
