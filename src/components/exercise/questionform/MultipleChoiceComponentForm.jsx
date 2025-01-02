/**
 * MultipleChoiceComponentForm component renders a form for creating and managing multiple choice questions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.answers - The current state of the answers.
 * @param {Array} props.answers.options - The list of options for the multiple choice question.
 * @param {string} props.answers.answer - The correct answer for the multiple choice question.
 * @param {string} props.answers.question - The question text.
 * @param {Function} props.onAnswerChange - Callback function to handle changes to the answers.
 *
 * @example
 * const answers = {
 *   question: "What is the capital of France?",
 *   options: ["Paris", "London", "Berlin"],
 *   answer: "Paris"
 * };
 * const handleAnswerChange = (updatedAnswers) => {
 *   console.log(updatedAnswers);
 * };
 * <MultipleChoiceComponentForm answers={answers} onAnswerChange={handleAnswerChange} />
 */
import React, { useState } from 'react';
import { Box, Button, Input, Select, Stack, Text } from '@chakra-ui/react';

const MultipleChoiceComponentForm = ({ answers, onAnswerChange }) => {
    const [options, setOptions] = useState(answers?.options || []);
    const [newOption, setNewOption] = useState('');
    const [answer, setAnswer] = useState(answers?.answer || '');

    const handleCorrectAnswerChange = async (e) => {
        if (e.target.value.trim() === '') return;
        setAnswer(e.target.value)
        await onAnswerChange({...answers, answer:e.target.value})
    }

    const handleAddOption = () => {
        if (newOption.trim() !== '') {
            setOptions([...options, newOption])
            onAnswerChange({...answers, options});
            setNewOption('');
        }
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        onAnswerChange({...answers, options:updatedOptions});
    };

    return (
        <Box p={4} borderWidth={1} borderRadius="md">
            <Text mb={4}>Question:</Text>
            <Input 
                placeholder="Question..." 
                value={answers.question} 
                onChange={(e) => onAnswerChange({...answers, question:e.target.value})} 
                mb={4}
            />
            <Text mb={4}>Options:</Text>
            <Stack spacing={4}>
                {options.map((option, index) => (
                    <Box key={index} display="flex" alignItems="center">
                        <Input value={option} isReadOnly mr={2} />
                        <Button colorScheme="red" onClick={() => handleRemoveOption(index)}>-</Button>
                    </Box>
                ))}
                <Box display="flex" alignItems="center">
                    <Input 
                        placeholder="new option" 
                        value={newOption} 
                        onChange={(e) => setNewOption(e.target.value)} 
                        mr={2}
                    />
                    <Button colorScheme="green" onClick={handleAddOption}>+</Button>
                </Box>
                <Box display={'flex'} >
                    <Text>Correct answer: </Text>
                    <Select value={answer} onChange={handleCorrectAnswerChange}>
                        <option value="">Select correct answer</option>
                        {options.map(option=>
                            <option key={option} value={option}>{option}</option>
                            )
                        }
                    </Select>
                </Box>
            </Stack>
        </Box>
    );
};

export default MultipleChoiceComponentForm;