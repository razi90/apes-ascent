import {
    Button,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';

import { commonButtonStyle } from '../Styled';
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
                        sx={commonButtonStyle}
                        title="Trade on this Vault"
                        size={{ base: 'sm', sm: 'sm', lsm: 'md', md: 'md' }}
                    >
                        Trade
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip label='Trade on this Vault'>
                    <Button
                        onClick={() => setIsOpen(true)}
                        sx={commonButtonStyle}
                        size={{ base: 'sm', sm: 'sm', lsm: 'md', md: 'md' }}
                        title="Trade on this Vault"
                    // isDisabled={true}
                    >
                        Trade
                    </Button>
                </Tooltip>
            )}
            <TradeDialog isOpen={isOpen} setIsOpen={setIsOpen} vault={vault} onComplete={handleComplete} />
        </>
    );
};

