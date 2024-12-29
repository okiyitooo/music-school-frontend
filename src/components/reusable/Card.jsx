import React from 'react';
import { Box, Heading, Text, useColorModeValue } from '@chakra-ui/react';

const Card = ({ title, content, children,  ...props }) => {
    const bg = useColorModeValue("white", "gray.700")
    const textColor = useColorModeValue("gray.700", "gray.300")
    return (
        <Box borderWidth="1px" borderRadius="md" p="4" bg={bg} boxShadow="md" {...props}>
            { title &&
            <Heading as="h3" size="md" mb="2" color={textColor}>
                {title}
            </Heading>
            }
            {content && <Text fontSize="md" mb="4" color={textColor}>{content}</Text>}
            {children}
        </Box>
    );
};

export default Card;