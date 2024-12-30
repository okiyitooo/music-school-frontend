import React from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';

const FillInTheBlankComponent = ({ question, answer, onChange, onSubmit }) => {
    return (
        <Flex p={4} borderWidth={1} borderRadius="md">
            <Text mb={2}>{question}</Text>
            <Input 
                placeholder="Type your answer here" 
                value={answer} 
                onChange={onChange} 
                type='text'
            />
            <Button onClick={onSubmit} colorScheme='cyan'>Submit</Button>
        </Flex>
    );
};

export default FillInTheBlankComponent;