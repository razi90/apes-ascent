import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { address, array, ManifestBuilder, NetworkId, nonFungibleLocalId, proof, RadixEngineToolkit, ValueKind } from '@radixdlt/radix-engine-toolkit';
import { COMPETITION_ADDRESS, USER_NFT_RESOURCE_ADDRESS } from '../../../Config';
import { User } from '../../../libs/entities/User';
import { fetchUserInfo } from '../../../libs/data_services/UserDataService';
import { rdt } from '../../../libs/radix-dapp-toolkit/rdt';
import { enqueueSnackbar } from 'notistack';
import { OutlineButton } from '../OutlineButton/OutlineButton';

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
        <OutlineButton
            onClick={handleClick}
            tooltipLabel={isConnected ? 'Join the competition' : 'Connect your wallet to join'}
        >
            Join Now
        </OutlineButton>
    );
};
