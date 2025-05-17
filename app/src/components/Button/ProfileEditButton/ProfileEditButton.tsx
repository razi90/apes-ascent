import { useState } from 'react';
import ProfileEditDialog from '../../Dialog/ProfileEditDialog/ProfileEditDialog';
import { User } from '../../../libs/entities/User';
import { OutlineButton } from '../OutlineButton/OutlineButton';

interface ProfileEditButtonProps {
    user: User | undefined;
    isLoading: boolean;
}

const ProfileEditButton: React.FC<ProfileEditButtonProps> = ({ user, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (isLoading) return null;

    return (
        <>
            <OutlineButton
                onClick={() => setIsOpen(true)}
                tooltipLabel="Edit your Profile"
            >
                Edit
            </OutlineButton>

            <ProfileEditDialog isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
        </>
    );
};

export default ProfileEditButton;
