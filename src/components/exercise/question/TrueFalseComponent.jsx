import React from 'react';
import { Box, Button, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

const TrueFalseComponent = ({ question, selectedOption, onChange, onSubmit }) => {
    return (
        <Box p={4} borderWidth={1} borderRadius="md">
            <Text mb={4}>{question}</Text>
            <RadioGroup onChange={onChange} value={selectedOption}>
                <Stack spacing={4}>
                    <Radio value="true">True</Radio>
                    <Radio value="false">False</Radio>
                </Stack>
                <Button onClick={onSubmit} colorScheme='cyan' mt={4}>Submit</Button>
            </RadioGroup>
        </Box>
    );
};

export default TrueFalseComponent;