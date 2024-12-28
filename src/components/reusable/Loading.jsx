import React from 'react'
import { Flex, Spinner, Text} from "@chakra-ui/react"

const Loading = ({ message="Loading..."}) => {
    return (
        <Flex direction="column" align="center" justify="center" minH="100vh">
            <Spinner size="xl" color="blue.500" mb="4"/>
            <Text fontSize="lg" color="gray.600">{message}</Text>
        </Flex>
    )
}
export default Loading;