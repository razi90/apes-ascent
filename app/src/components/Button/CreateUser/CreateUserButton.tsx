import { useState } from 'react';
import { Button, Icon, Text } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import { leftNavigationButtonStyle } from '../../LeftNavigationBar/Styled';
import CreateUserDialog from '../../Dialog/CreateUserDialog/CreateUserDialog';

interface CreateUserButtonProps {
    navIsMinimized: boolean;
}

const CreateUserButton: React.FC<CreateUserButtonProps> = ({ navIsMinimized }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                className='create-profile-button-first-step'
                onClick={() => setIsOpen(true)}
                sx={leftNavigationButtonStyle}
                width="100%"
                justifyContent="flex-start"
                pl={4}
            >
                <Icon as={FaUserPlus} boxSize={5} mr={3} />
                <Text>{navIsMinimized ? "" : "Create Profile"}</Text>
            </Button>
            <CreateUserDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default CreateUserButton;
