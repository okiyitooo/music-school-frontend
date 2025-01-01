import React, { useState } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

/**
 * MatchingComponentForm component renders a form for creating and managing matching questions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.answers - The current state of the answers.
 * @param {Object} props.answers.pairs - The pairs of items to be matched.
 * @param {string} props.answers.question - The question text.
 * @param {Function} props.onAnswerChange - Callback function to handle changes to the answers.
 *
 * @example
 * const answers = {
 *   question: "Match the following items:",
 *   pairs: { "Item 1": "Match 1", "Item 2": "Match 2" }
 * };
 * const handleAnswerChange = (updatedAnswers) => {
 *   console.log(updatedAnswers);
 * };
 * <MatchingComponentForm answers={answers} onAnswerChange={handleAnswerChange} />
 */
const MatchingComponentForm = ({ answers, onAnswerChange }) => {
    const [pairs, setPairs] = useState(answers?.pairs || {});
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');

    const handleMatchChange = async (keyOrValue, isKey, key) => {
        const newPairs= {...pairs};
        if (isKey){
            const currentValue = newPairs[key];
            delete newPairs[key]
            newPairs[keyOrValue]=currentValue
            setPairs(newPairs)
        }
        else {
            newPairs[key]=keyOrValue
            setPairs(newPairs)
        }
        onAnswerChange({...answers, pairs:newPairs})
    }

    const handleAddPair = () => {
        if (newKey && newValue) {
            const updatedPairs = { ...pairs, [newKey]: newValue };
            setPairs(updatedPairs);
            onAnswerChange({ ...answers, pairs: updatedPairs });
            setNewKey('');
            setNewValue('');
        }
    };

    const handleRemovePair = (key) => {
        const updatedPairs = { ...pairs };
        delete updatedPairs[key];
        setPairs(updatedPairs);
        onAnswerChange({ ...answers, pairs: updatedPairs });
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="md">
            <Text mb={4}>Question:</Text>
            <Input 
                placeholder="Question..." 
                value={answers.question} 
                onChange={(e) => onAnswerChange({ ...answers, question: e.target.value })} 
                mb={4}
            />
            <Text mb={4}>Pairs:</Text>
            {Object.keys(pairs).map((key) => (
                <Flex key={key} mb={2} align="center">
                    <Input value={key} width={'50%'} onChange={e=>handleMatchChange(e.target.value, true, key)}/>
                    <Input value={pairs[key]} width={'50%'} onChange={e=>handleMatchChange(e.target.vakue, false, key)}/>
                    <Button colorScheme='purple' ml={2} onClick={() => handleRemovePair(key)}>-</Button>
                </Flex>
            ))}
            <Flex mb={4}>
                <Input 
                    placeholder="Item" 
                    value={newKey} 
                    onChange={(e) => setNewKey(e.target.value)} 
                    mr={2}
                />
                <Input 
                    placeholder="Match" 
                    value={newValue} 
                    onChange={(e) => setNewValue(e.target.value)} 
                    mr={2}
                />
                <Button onClick={handleAddPair}>+</Button>
            </Flex>
        </Box>
    );
};

export default MatchingComponentForm;