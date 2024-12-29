import React from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

const Button = ({ children, onClick, colorScheme = 'blue', ...props }) => {
    return (
        <ChakraButton colorScheme={colorScheme} onClick={onClick} {...props}>
            {children}
        </ChakraButton>
    );
};

export default Button;