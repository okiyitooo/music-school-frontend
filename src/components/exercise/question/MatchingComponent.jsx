import React from 'react';
import { Button, Flex, Select, Stack, Text } from '@chakra-ui/react';

const MatchingComponent = ({ question, pairs, selectedPairs, onChange, onSubmit }) => {
    return (
        <Flex direction={'column'}>
            <Text mb={4}>{question || "Match the pairs"}</Text>
            <Stack spacing={4}>
                {pairs.map((pair, index) => (
                    <Flex key={index} align="center">
                        <Text width={"50px"}>{pair.left}</Text>
                        <Select 
                            placeholder="choose match" 
                            value={selectedPairs[index] || ''} 
                            onChange={(e) => onChange(index, e.target.value)}
                        >
                            {pair.right.map((option, idx) => (
                                <option key={idx} value={option}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </Flex>
                ))}
            </Stack>
            <Button onClick={onSubmit} colorScheme='aquamarine' mt={4}>Submit</Button>
        </Flex>
    );
};

export default MatchingComponent;