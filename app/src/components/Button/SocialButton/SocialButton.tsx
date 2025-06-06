import {
    chakra,
    VisuallyHidden,
    SystemStyleObject,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { styleSocialButton } from './Styled';

export const SocialButton = ({
    children,
    label,
    href,
    target,
    rel,
    _hover,
}: {
    children: ReactNode;
    label: string;
    href: string;
    target?: string;
    rel?: string;
    _hover?: SystemStyleObject;
}) => {
    return (
        <chakra.button
            as={'a'}
            href={href}
            target={target}
            rel={rel}
            sx={{
                ...styleSocialButton,
                _hover: {
                    ...styleSocialButton._hover,
                    ..._hover,
                },
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};