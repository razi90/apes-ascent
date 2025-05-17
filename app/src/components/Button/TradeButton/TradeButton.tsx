import {
    Button,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAssetVault } from '../../../libs/entities/UserAssetVault';

interface TradeButtonProps {
    vault: UserAssetVault | undefined;
    isConnected: boolean;
    onComplete?: () => void;
}

const TradeButton: React.FC<TradeButtonProps> = ({ vault, isConnected, onComplete }) => {
    const navigate = useNavigate();

    const handleTrade = () => {
        navigate('/trading');
    };

    return (
        <Tooltip label="Trade" placement="top">
            <Button
                colorScheme="green"
                size="sm"
                onClick={handleTrade}
                isDisabled={!isConnected}
            >
                Trade
            </Button>
        </Tooltip>
    );
};

export default TradeButton;

