import { useState } from 'react';
import { Button, Icon, Text, VStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaUserPlus } from 'react-icons/fa';
import { leftNavigationButtonStyle } from '../../LeftNavigationBar/Styled';
import CreateUserDialog from '../../Dialog/CreateUserDialog/CreateUserDialog';

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const CreateUserButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <VStack spacing={1}>
                <Button
                    className='create-profile-button-first-step'
                    onClick={() => setIsOpen(true)}
                    sx={{
                        ...leftNavigationButtonStyle,
                        position: 'relative',
                        width: '50px',
                        height: '50px',
                        minWidth: '50px',
                        padding: 0,
                        _before: {
                            content: '""',
                            position: 'absolute',
                            top: '-2px',
                            left: '-2px',
                            right: '-2px',
                            bottom: '-2px',
                            borderRadius: 'full',
                            border: '2px solid transparent',
                            borderTopColor: 'red.400',
                            borderLeftColor: 'red.400',
                            borderRightColor: 'red.400',
                            animation: `${rotateAnimation} 2s linear infinite`,
                        }
                    }}
                    justifyContent="center"
                >
                    <Icon as={FaUserPlus} boxSize={7} />
                </Button>
                <Text fontSize="md" color="gray.500">
                    Create Profile
                </Text>
            </VStack>
            <CreateUserDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default CreateUserButton;
