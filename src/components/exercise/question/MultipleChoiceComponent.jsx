import React from 'react';
import { Box, Button, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';

const MultipleChoiceComponent = ({ question, options, selectedOption, onChange, onsubmit }) => {
    // ASCII value for 'A' is 65, used to convert index to corresponding alphabet letter
    const alphabetAdder = 65; 
    return (
        <Box p={4} borderWidth={1} borderRadius="md">
            <Text mb={4}>{question}</Text>
            <RadioGroup onChange={onChange} value={selectedOption}>
                <Stack spacing={4}>
                    {options.map((option, index) => (
                        <Radio key={index} value={option}>
                            {String.fromCharCode(alphabetAdder+index)+")."} {option}
                        </Radio>
                    ))}
                </Stack>
                <Button onClick={onsubmit} colorScheme='cyan' mt={4}>Submit</Button>
            </RadioGroup>
        </Box>
    );
};

export default MultipleChoiceComponent;