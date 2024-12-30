import React from 'react';
import { Button, Flex, Text, Textarea } from '@chakra-ui/react';

const ShortAnswerComponent = ({ question, answer, onChange, onSubmit }) => {
    return (
        <Flex direction="column" p={4} borderWidth={1} borderRadius="md">
            <Text mb={2}>{question}</Text>
            <Textarea
                value={answer} 
                onChange={onChange}
            />
            <Button onClick={onSubmit} colorScheme='#c0eaff'>Submit</Button>
        </Flex>
    );
};

export default ShortAnswerComponent;