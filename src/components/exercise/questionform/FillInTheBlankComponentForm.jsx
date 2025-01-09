import React from 'react';
import { Box, Input, Text } from '@chakra-ui/react';

/**
 * FillInTheBlankComponentForm component renders a form for creating and managing fill-in-the-blank questions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.answers - The current state of the answers.
 * @param {string} props.answers.question - The question text.
 * @param {string} props.answers.answer - The correct answer for the fill-in-the-blank question.
 * @param {Function} props.onAnswerChange - Callback function to handle changes to the answers.
 *
 * @example
 * const answers = {
 *   question: "The capital of France is ____.",
 *   answer: "Paris"
 * };
 * const handleAnswerChange = (updatedAnswers) => {
 *   console.log(updatedAnswers);
 * };
 * <FillInTheBlankComponentForm answers={answers} onAnswerChange={handleAnswerChange} />
 */
const FillInTheBlankComponentForm = ({ answers, onAnswerChange }) => {
    return (
        <Box p={4} borderWidth={1} borderRadius="md">
            <Text mb={4}>Question:</Text>
            <Input 
                placeholder="Question..." 
                value={answers?.question || ''} 
                onChange={(e) => onAnswerChange({ ...answers, question: e.target.value })} 
                mb={4}
            />
            <Text mb={4}>Correct Answer:</Text>
            <Input 
                placeholder="Answer..." 
                value={answers?.answer || ''} 
                onChange={(e) => onAnswerChange({ ...answers, answer: e.target.value })} 
            />
        </Box>
    );
};

export default FillInTheBlankComponentForm;