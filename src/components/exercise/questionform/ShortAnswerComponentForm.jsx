import React from 'react';
import { Box, Input, Text } from '@chakra-ui/react';

/**
 * ShortAnswerComponentForm component renders a form for creating and managing short answer questions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.answers - The current state of the answers.
 * @param {string} props.answers.question - The question text.
 * @param {Function} props.onAnswerChange - Callback function to handle changes to the answers.
 *
 * @example
 * const answers = {
 *   question: "Describe the process of photosynthesis."
 * };
 * const handleAnswerChange = (updatedAnswers) => {
 *   console.log(updatedAnswers);
 * };
 * <ShortAnswerComponentForm answers={answers} onAnswerChange={handleAnswerChange} />
 */
const ShortAnswerComponentForm = ({ answers, onAnswerChange }) => {
    return (
        <Box p={4} borderWidth={1} borderRadius="md">
            <Text mb={4}>Question:</Text>
            <Input 
                placeholder="Question..." 
                value={answers.question} 
                onChange={(e) => onAnswerChange({ ...answers, question: e.target.value })} 
                mb={4}
            />
        </Box>
    );
};

export default ShortAnswerComponentForm;