import React from 'react';
import { Button, Flex, Select, Stack, Text } from '@chakra-ui/react';

const MatchingComponent = ({ question, pairs, selectedPairs, onChange, onSubmit }) => {
    return (
        <Flex direction={'column'}>
            <Text mb={4}>{question || "Match the pairs"}</Text>
            <Stack spacing={4}>
                {Object.keys(pairs).map((key) => (
                    <Flex key={key} align="center" direction={'row'}>
                        <Text width={"50px"}>{key}</Text>
                        <Select 
                            placeholder="choose match" 
                            value={selectedPairs[key] || ''} 
                            onChange={(e) => onChange(key, e.target.value)}
                        >
                            {Object.values(pairs).map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </Select>
                    </Flex>
                ))}
            </Stack>
            <Button onClick={onSubmit} colorScheme='orange' mt={4}>Submit</Button>
        </Flex>
    );
};

export default MatchingComponent;