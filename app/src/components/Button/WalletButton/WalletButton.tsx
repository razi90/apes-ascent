import React from 'react';
import { walletButtonStyle, walletButtonBoxStyle } from './Styled';
import { Box, Tooltip } from '@chakra-ui/react';

export const WalletButton: React.FC = () => {

    return (
        <>
            <Tooltip label='Connect to your Wallet'>
                <Box className="wallet-first-step" sx={walletButtonBoxStyle}>
                    <style>{walletButtonStyle}</style>
                    <div className="connect-button-wrapper">
                        <radix-connect-button
                            personalabel=""
                            dappname=""
                            mode="light"
                            status=""
                            avatarurl=""
                            activetab=""
                            loggedintimestamp=""
                        ></radix-connect-button>
                    </div>
                </Box>
            </Tooltip>
        </>

    );
};
