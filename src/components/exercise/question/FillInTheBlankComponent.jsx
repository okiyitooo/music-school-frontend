import React from 'react';
import { Button, Flex, Input, Text, VStack } from '@chakra-ui/react';

const FillInTheBlankComponent = ({ question, answer, onChange, onSubmit }) => {
    return (
        <Flex p={5} borderWidth={1} borderRadius="md">
            <VStack spacing={4}>
                <Text mb={2}>{question}</Text>
                <Input 
                    placeholder="Type your answer here" 
                    value={answer} 
                    onChange={onChange} 
                    type='text'
                    />
                <Button onClick={onSubmit} colorScheme='cyan'>Submit</Button>
            </VStack>
        </Flex>
    );
};

export default FillInTheBlankComponent;