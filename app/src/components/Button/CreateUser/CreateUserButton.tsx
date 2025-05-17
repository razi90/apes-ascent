import { useState } from 'react';
import { Button, Icon, Text } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import { leftNavigationButtonStyle } from '../../LeftNavigationBar/Styled';
import CreateUserDialog from '../../Dialog/CreateUserDialog/CreateUserDialog';

const CreateUserButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                className='create-profile-button-first-step'
                onClick={() => setIsOpen(true)}
                sx={leftNavigationButtonStyle}
                width="100%"
                justifyContent="center"
                p={3}
                height="50px"
            >
                <Icon as={FaUserPlus} boxSize={7} />
            </Button>
            <CreateUserDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </>
    );
};

export default CreateUserButton;
