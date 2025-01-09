import React from 'react';
import { Box, Radio, RadioGroup, Stack, Text, Input } from '@chakra-ui/react';

/**
 * TrueFalseComponentForm component renders a form for creating and managing true/false questions.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.answers - The current state of the answers.
 * @param {string} props.answers.question - The question text.
 * @param {string} props.answers.answer - The correct answer for the true/false question.
 * @param {Function} props.onAnswerChange - Callback function to handle changes to the answers.
 *
 * @example
 * const answers = {
 *   question: "The sky is blue.",
 *   answer: "true"
 * };
 * const handleAnswerChange = (updatedAnswers) => {
 *   console.log(updatedAnswers);
 * };
 * <TrueFalseComponentForm answers={answers} onAnswerChange={handleAnswerChange} />
 */
const TrueFalseComponentForm = ({ answers, onAnswerChange }) => {
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
            <RadioGroup 
                onChange={(value) => onAnswerChange({ ...answers, answer: value })} 
                value={answers?.answer}
            >
                <Stack spacing={4}>
                    <Radio value="true">True</Radio>
                    <Radio value="false">False</Radio>
                </Stack>
            </RadioGroup>
        </Box>
    );
};

export default TrueFalseComponentForm;