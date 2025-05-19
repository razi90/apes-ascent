import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,
    Box,
    Stack,
    FormControl,
    FormErrorMessage,
    Button,
    InputGroup,
    InputLeftAddon,
    Text,
    useColorModeValue,
    Textarea,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import CancelButton from "../../Button/Dialog/CancelButton.tsx/CancelButton";
import { defaultHighlightedLinkButtonStyle } from "../../Button/DefaultHighlightedLinkButton/Styled";
import { useQuery } from "@tanstack/react-query";
import { fetchConnectedWallet } from "../../../libs/data_services/WalletDataService";
import { WalletDataState } from "@radixdlt/radix-dapp-toolkit";
import { createDuel as createDuelService } from "../../../libs/data_services/DuelDataService";
import { DUEL_CONFIG } from "../../../libs/entities/Duel";

interface CreateDuelDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onDuelCreated?: () => void;
}

const CreateDuelDialog: React.FC<CreateDuelDialogProps> = ({
    isOpen,
    setIsOpen,
    onDuelCreated,
}) => {
    const onClose = () => setIsOpen(false);
    const [isLoading, setIsLoading] = useState(false);

    // Input States
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [betAmount, setBetAmount] = useState("");
    const [description, setDescription] = useState("");

    // Error States
    const [errors, setErrors] = useState({
        startTime: "",
        duration: "",
        betAmount: "",
        description: "",
    });

    // Fetch connected wallet data
    const {
        data: wallet,
        isLoading: isWalletFetchLoading,
        isError: isWalletFetchError,
    } = useQuery<WalletDataState>({
        queryKey: ["wallet_data"],
        queryFn: fetchConnectedWallet,
    });

    useEffect(() => {
        if (isOpen) {
            // Reset form fields and errors when the modal is opened
            setStartTime("");
            setDuration("");
            setBetAmount("");
            setDescription("");
            setErrors({
                startTime: "",
                duration: "",
                betAmount: "",
                description: "",
            });
        }
    }, [isOpen]);

    // Validation Functions
    const validateStartTime = (time: string): string => {
        if (!time) {
            return "Start time is required";
        }
        const selectedTime = new Date(time);
        const now = new Date();
        if (selectedTime < now) {
            return "Start time must be in the future";
        }
        return "";
    };

    const validateDuration = (duration: string): string => {
        if (!duration) {
            return "Duration is required";
        }
        const hours = parseInt(duration);
        if (isNaN(hours)) {
            return "Duration must be a valid number";
        }
        if (hours < DUEL_CONFIG.MIN_DURATION_HOURS) {
            return `Duration must be at least ${DUEL_CONFIG.MIN_DURATION_HOURS} hour`;
        }
        if (hours > DUEL_CONFIG.MAX_DURATION_HOURS) {
            return `Duration cannot exceed ${DUEL_CONFIG.MAX_DURATION_HOURS} hours`;
        }
        return "";
    };

    const validateBetAmount = (amount: string): string => {
        if (!amount) {
            return "Bet amount is required";
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) {
            return "Bet amount must be a valid number";
        }
        if (numAmount < DUEL_CONFIG.MIN_BET_AMOUNT) {
            return `Minimum bet amount is ${DUEL_CONFIG.MIN_BET_AMOUNT} XRD`;
        }
        if (numAmount > DUEL_CONFIG.MAX_BET_AMOUNT) {
            return `Maximum bet amount is ${DUEL_CONFIG.MAX_BET_AMOUNT} XRD`;
        }
        return "";
    };

    const validateDescription = (desc: string): string => {
        if (desc.length > 500) {
            return "Description cannot exceed 500 characters";
        }
        return "";
    };

    const handleChange = (field: string, value: string) => {
        switch (field) {
            case "startTime":
                setStartTime(value);
                setErrors(prev => ({ ...prev, startTime: validateStartTime(value) }));
                break;
            case "duration":
                setDuration(value);
                setErrors(prev => ({ ...prev, duration: validateDuration(value) }));
                break;
            case "betAmount":
                setBetAmount(value);
                setErrors(prev => ({ ...prev, betAmount: validateBetAmount(value) }));
                break;
            case "description":
                setDescription(value);
                setErrors(prev => ({ ...prev, description: validateDescription(value) }));
                break;
        }
    };

    const isFormValid = () => {
        return Object.values(errors).every(error => error === "") &&
            startTime !== "" &&
            duration !== "" &&
            betAmount !== "";
    };

    const createDuel = async () => {
        if (!isFormValid()) {
            return;
        }

        setIsLoading(true);

        try {
            const newDuel = await createDuelService({
                startDate: startTime,
                duration: parseInt(duration),
                betAmount: parseFloat(betAmount),
                player1Id: wallet?.persona?.identityAddress || '',
            });

            enqueueSnackbar("Duel created successfully!", { variant: "success" });
            onDuelCreated?.();
            onClose();
        } catch (error) {
            enqueueSnackbar("Failed to create duel.", { variant: "error" });
            console.error("Failed to create duel: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    // If wallet is not connected, display an error modal
    if ((wallet?.persona) == undefined) {
        return (
            <Box>
                <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Wallet not connected!</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>
                                Please connect your Radix DLT Wallet in order to create a duel.
                            </Text>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        );
    }

    return (
        <Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create New Duel</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            {/* Start Time Field */}
                            <FormControl isInvalid={errors.startTime !== ""} isRequired>
                                <InputGroup>
                                    <InputLeftAddon children="Start Time" opacity={0.7} />
                                    <Input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => handleChange("startTime", e.target.value)}
                                    />
                                </InputGroup>
                                {errors.startTime && (
                                    <FormErrorMessage>{errors.startTime}</FormErrorMessage>
                                )}
                            </FormControl>

                            {/* Duration Field */}
                            <FormControl isInvalid={errors.duration !== ""} isRequired>
                                <InputGroup>
                                    <InputLeftAddon children="Duration (hours)" opacity={0.7} />
                                    <Input
                                        type="number"
                                        min={DUEL_CONFIG.MIN_DURATION_HOURS}
                                        max={DUEL_CONFIG.MAX_DURATION_HOURS}
                                        value={duration}
                                        onChange={(e) => handleChange("duration", e.target.value)}
                                        placeholder={`Enter duration (${DUEL_CONFIG.MIN_DURATION_HOURS}-${DUEL_CONFIG.MAX_DURATION_HOURS} hours)`}
                                    />
                                </InputGroup>
                                {errors.duration && (
                                    <FormErrorMessage>{errors.duration}</FormErrorMessage>
                                )}
                            </FormControl>

                            {/* Bet Amount Field */}
                            <FormControl isInvalid={errors.betAmount !== ""} isRequired>
                                <InputGroup>
                                    <InputLeftAddon children="Bet Amount (XRD)" opacity={0.7} />
                                    <Input
                                        type="number"
                                        min={DUEL_CONFIG.MIN_BET_AMOUNT}
                                        max={DUEL_CONFIG.MAX_BET_AMOUNT}
                                        step="0.01"
                                        value={betAmount}
                                        onChange={(e) => handleChange("betAmount", e.target.value)}
                                        placeholder={`Enter bet amount (${DUEL_CONFIG.MIN_BET_AMOUNT}-${DUEL_CONFIG.MAX_BET_AMOUNT} XRD)`}
                                    />
                                </InputGroup>
                                {errors.betAmount && (
                                    <FormErrorMessage>{errors.betAmount}</FormErrorMessage>
                                )}
                            </FormControl>

                            {/* Description Field */}
                            <FormControl isInvalid={errors.description !== ""}>
                                <InputGroup>
                                    <InputLeftAddon children="Description" opacity={0.7} />
                                    <Textarea
                                        value={description}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Enter duel rules or conditions (optional)"
                                        maxLength={500}
                                    />
                                </InputGroup>
                                {errors.description && (
                                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                                )}
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    {description.length}/500 characters
                                </Text>
                            </FormControl>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            isLoading={isLoading}
                            loadingText="Creating..."
                            onClick={createDuel}
                            isDisabled={!isFormValid() || isLoading}
                            sx={defaultHighlightedLinkButtonStyle}
                        >
                            Create Duel
                        </Button>
                        <Box mx={2} />
                        <CancelButton onClick={onClose} />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default CreateDuelDialog;