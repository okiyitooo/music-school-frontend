import React, { useEffect, useState } from 'react';
import { Box, Button, HStack, Input, Select, Stack, Text, useToast } from '@chakra-ui/react';
import MultipleChoiceComponentForm from './questionform/MultipleChoiceComponentForm';
import FillInTheBlankComponentForm from './questionform/FillInTheBlankComponentForm';
import ShortAnswerComponentForm from './questionform/ShortAnswerComponentForm';
import MatchingComponentForm from './questionform/MatchingComponentForm';
import TrueFalseComponentForm from './questionform/TrueFalseComponentForm';
import { exerciseService } from '../../services/exerciseService';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorBoundary from '../boundary/ErrorBoundary';
import Loading from '../reusable/Loading';

const ExerciseForm = () => {
    const [exercise, setExercise] = useState({
        name: '',
        description: '',
        instructions: '',
        exerciseType: '',
        answers: {
            question: '',
            answer: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const { courseId, exerciseId, topicId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    useEffect(() => {
        const fetchExercise = async () => {
            if (exerciseId) {
                try {
                    const response = await exerciseService.getExerciseById(exerciseId);
                    setExercise(response.data);
                } catch (err) {
                    toast ({
                        title: "Error loading exercise",
                        description: err.response?.data?.message || err.data?.message || "Failed to fetch exercise.",
                        status: "error",
                        isClosable: true,
                    })
                }
            }
            setLoading(false);
        }
        fetchExercise();
    }, [exerciseId, toast])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setExercise({ ...exercise, [name]: value });
    };

    const handleAnswerChange = async (answers) => {
        setExercise({ ...exercise, answers });
    };

    const handleSubmit = async () => {
        try {
            if (exerciseId===undefined) 
                await exerciseService.createExercise({ ...exercise, topicId });
            else 
                await exerciseService.updateExercise(exerciseId, exercise, );
            navigate(`/courses/${courseId}/topics/${topicId}/exercises`);
        } catch (err) {
            toast({
                title: "Error saving exercise",
                description: err.response?.data?.message || err.data?.message || "Failed to save exercise.",
                status: "error",
                isClosable: true,
            })
        }
    };

    if (loading)
        return <Loading message="Loading exercise details.."/>;
    return (
        <ErrorBoundary>
            <Box p={4} borderWidth={1} borderRadius="md">
                <Stack spacing={4} onSubmit={handleSubmit}>
                    <Text fontSize="xl">{exerciseId ? "Update" : "Create New"} Exercise</Text>
                    <Input
                        placeholder="Name"
                        name="name"
                        value={exercise.name}
                        onChange={handleChange}
                        required={true}
                    />
                    <Input
                        placeholder="Description"
                        name="description"
                        value={exercise.description}
                        onChange={handleChange}
                        isRequired={true}
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
                        isRequired={true}
                        aria-required={true}
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
                    <HStack justifyContent="space-evenly">
                        <Button onClick={() => navigate(`/courses/${courseId}/topics/${topicId}/exercises`)} children={"back"} colorScheme='teal'/>
                        <Button onClick={handleSubmit} colorScheme="green" type="submit">
                            {(exerciseId ? "Update": "Create") + " Exercise"}
                        </Button>
                    </HStack>
                </Stack>
            </Box>
        </ErrorBoundary>
    );
};

export default ExerciseForm;