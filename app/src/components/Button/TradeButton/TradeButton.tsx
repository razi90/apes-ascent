import {
    Button,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';

import TradeDialog from '../Dialog/TradeDialog/TradeDialog';
import { UserAssetVault } from '../../../libs/entities/UserAssetVault';

interface TradeButtonProps {
    vault: UserAssetVault | undefined;
    isConnected: boolean;
    onComplete?: () => void;
}

export const TradeButton: React.FC<TradeButtonProps> = ({ vault, isConnected, onComplete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleComplete = () => {
        setIsOpen(false);
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <>
            {isConnected ? (
                <Tooltip label='Trade on this Vault'>
                    <Button
                        onClick={() => setIsOpen(true)}
                        bg="transparent"
                        color="white"
                        border="1px solid"
                        borderColor="green.400"
                        borderRadius="full"
                        px={4}
                        py={1}
                        fontSize="sm"
                        fontWeight="medium"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            bg: "transparent",
                            color: "green.400",
                            transform: "translateY(-2px)",
                            boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
                        }}
                    >
                        Trade
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip label='Trade on this Vault'>
                    <Button
                        onClick={() => setIsOpen(true)}
                        bg="transparent"
                        color="white"
                        border="1px solid"
                        borderColor="green.400"
                        borderRadius="full"
                        px={4}
                        py={1}
                        fontSize="sm"
                        fontWeight="medium"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            bg: "transparent",
                            color: "green.400",
                            transform: "translateY(-2px)",
                            boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
                        }}
                    >
                        Trade
                    </Button>
                </Tooltip>
            )}
            <TradeDialog isOpen={isOpen} setIsOpen={setIsOpen} vault={vault} onComplete={handleComplete} />
        </>
    );
};

