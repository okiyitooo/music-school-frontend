import React, { useState } from 'react';
import { Box, Button, Input, Select, Stack, Text } from '@chakra-ui/react';
import MultipleChoiceComponentForm from './questionform/MultipleChoiceComponentForm';
import FillInTheBlankComponentForm from './questionform/FillInTheBlankComponentForm';
import ShortAnswerComponentForm from './questionform/ShortAnswerComponentForm';
import MatchingComponentForm from './questionform/MatchingComponentForm';
import TrueFalseComponentForm from './questionform/TrueFalseComponentForm';
import { exerciseService } from '../../services/exerciseService';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from '../boundary/ErrorBoundary';

const ExerciseForm = () => {
    const [exercise, setExercise] = useState({
        name: '',
        description: '',
        instructions: '',
        exerciseType: '',
        answers: {}
    });
    const { courseId } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise({ ...exercise, [name]: value });
    };

    const handleAnswerChange = (answers) => {
        setExercise({ ...exercise, answers });
    };

    const handleSubmit = async () => {
        try {
            await exerciseService.createExercise({ ...exercise, courseId });
            navigate(`/courses/${courseId}/exercises`);
        } catch (err) {
            console.error('Failed to create exercise', err);
        }
    };

    return (
        <ErrorBoundary>
            <Box p={4} borderWidth={1} borderRadius="md">
                <Stack spacing={4}>
                    <Text fontSize="xl">Create New Exercise</Text>
                    <Input
                        placeholder="Name"
                        name="name"
                        value={exercise.name}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Description"
                        name="description"
                        value={exercise.description}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Instructions"
                        name="instructions"
                        value={exercise.instructions}
                        onChange={handleChange}
                    />
                    <Select
                        placeholder="Select exercise type"
                        name="exerciseType"
                        value={exercise.exerciseType}
                        onChange={handleChange}
                    >
                        <option value="multipleChoice">Multiple Choice</option>
                        <option value="fillInTheBlank">Fill in the Blank</option>
                        <option value="shortAnswer">Short Answer</option>
                        <option value="matching">Matching</option>
                        <option value="trueFalse">True/False</option>
                    </Select>
                    {exercise.exerciseType === 'multipleChoice' && (
                        <MultipleChoiceComponentForm
                            answers={exercise.answers}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}
                    {exercise.exerciseType === 'fillInTheBlank' && (
                        <FillInTheBlankComponentForm
                            answers={exercise.answers}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}
                    {exercise.exerciseType === 'shortAnswer' && (
                        <ShortAnswerComponentForm
                            answers={exercise.answers}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}
                    {exercise.exerciseType === 'matching' && (
                        <MatchingComponentForm
                            answers={exercise.answers}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}
                    {exercise.exerciseType === 'trueFalse' && (
                        <TrueFalseComponentForm
                            answers={exercise.answers}
                            onAnswerChange={handleAnswerChange}
                        />
                    )}
                    <Button onClick={handleSubmit} colorScheme="blue">
                        Create Exercise
                    </Button>
                </Stack>
            </Box>
        </ErrorBoundary>
    );
};

export default ExerciseForm;