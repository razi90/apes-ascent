import {
    Button,
    Tooltip,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { commonButtonStyle } from '../Styled';
import { address, array, ManifestBuilder, NetworkId, nonFungibleLocalId, proof, RadixEngineToolkit, ValueKind } from '@radixdlt/radix-engine-toolkit';
import { COMPETITION_ADDRESS, USER_NFT_RESOURCE_ADDRESS } from '../../../Config';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../../libs/entities/User';
import { fetchUserInfo } from '../../../libs/data_services/UserDataService';
import { rdt } from '../../../libs/radix-dapp-toolkit/rdt';
import { enqueueSnackbar } from 'notistack';

interface JoinButtonProps {
    isConnected: boolean;
}

export const JoinButton: React.FC<JoinButtonProps> = ({ isConnected }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: user, isError: isUserFetchError } = useQuery<User>({ queryKey: ['user_info'], queryFn: fetchUserInfo });

    // Function to handle button clicks
    const handleClick = async () => {
        setIsOpen(true);

        // Build manifest to open a position
        let transactionManifest = new ManifestBuilder()
            .callMethod(
                user?.account!,
                "create_proof_of_non_fungibles",
                [
                    address(
                        USER_NFT_RESOURCE_ADDRESS
                    ),
                    array(ValueKind.NonFungibleLocalId, nonFungibleLocalId(user?.id!)),
                ]
            )
            .createProofFromAuthZoneOfNonFungibles(
                USER_NFT_RESOURCE_ADDRESS,
                [user?.id!],
                (builder, proofId) => builder.callMethod(
                    COMPETITION_ADDRESS,
                    "register",
                    [
                        proof(proofId),
                    ]

                )
            )
            .build();

        let convertedInstructions = await RadixEngineToolkit.Instructions.convert(
            transactionManifest.instructions,
            NetworkId.Stokenet,
            "String"
        );

        console.log('trade manifest: ', convertedInstructions.value)

        // Send manifest to extension for signing
        const result = await rdt.walletApi
            .sendTransaction({
                transactionManifest: convertedInstructions.value.toString(),
                version: 1,
            })

        if (result.isOk()) {
            enqueueSnackbar(`Successfully registered.`, { variant: 'success' });
        }

        if (result.isErr()) {
            enqueueSnackbar(`Failed to register: ${result.error}`, { variant: 'error' });
        }
    };

    return (
        <>
            {isConnected ? (
                <Tooltip label='Join the competition'>
                    <Button
                        onClick={handleClick}
                        bg="transparent"
                        color="white"
                        border="1px solid"
                        borderColor="green.400"
                        borderRadius="full"
                        px={6}
                        py={2}
                        fontSize="md"
                        fontWeight="medium"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            bg: "transparent",
                            color: "green.400",
                            transform: "translateY(-2px)",
                            boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
                        }}
                    >
                        Join Now
                    </Button>
                </Tooltip>
            ) : (
                <Tooltip label='Connect your wallet to join'>
                    <Button
                        onClick={handleClick}
                        bg="transparent"
                        color="white"
                        border="1px solid"
                        borderColor="green.400"
                        borderRadius="full"
                        px={6}
                        py={2}
                        fontSize="md"
                        fontWeight="medium"
                        transition="all 0.2s ease-in-out"
                        _hover={{
                            bg: "transparent",
                            color: "green.400",
                            transform: "translateY(-2px)",
                            boxShadow: "0 0 10px rgba(72, 187, 120, 0.5)",
                        }}
                    >
                        Join Now
                    </Button>
                </Tooltip>
            )}
        </>
    );
};
