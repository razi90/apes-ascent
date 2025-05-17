import {
    chakra,
    VisuallyHidden,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { styleSocialButton } from './Styled';

export const SocialButton = ({
    children,
    label,
    href,
    target,
    rel,
}: {
    children: ReactNode;
    label: string;
    href: string;
    target?: string;
    rel?: string;
}) => {
    return (
        <chakra.button
            as={'a'}
            href={href}
            target={target}
            rel={rel}
            sx={styleSocialButton}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button >
    );
};