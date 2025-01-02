import React from 'react'
import { Box, Text} from '@chakra-ui/react'

const Footer = () => {
    return (
        <Box as="footer" textAlign="center" py={{ base: '10', md: '12' }} bg="gray.100" mt={'auto'}>
            <Text fontSize={'sm'}>
                © {new Date().getFullYear()} Music Theory Platform. All rights reserved.
            </Text>
        </Box>
    )
}
export default Footer;