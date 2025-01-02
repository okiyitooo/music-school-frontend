import React from 'react'
import { Box, Text} from '@chakra-ui/react'

const Footer = () => {
    return (
        <Box as="footer" textAlign="center" p="4" bg="gray.100">
            <Text fontSize={'sm'}>
                © {new Date().getFullYear()} Music Theory Platform. All rights reserved.
            </Text>
        </Box>
    )
}
export default Footer;