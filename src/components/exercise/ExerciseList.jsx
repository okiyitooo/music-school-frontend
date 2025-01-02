import { Heading, Flex, Text, Stack, useToast, HStack, } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { exerciseService } from '../../services/exerciseService';
import Card from '../reusable/Card';
import Button from '../reusable/Button';
import Loading from "../reusable/Loading";

const ExerciseList = () => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { courseId, topicId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await exerciseService.getAllExercisesByTopicId(topicId);
                console.log(response.data)
                setExercises(response.data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch exercises",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                navigate(`/courses/${courseId}/topics/${topicId}`);
            }
            setLoading(false);
        };
        fetchExercises();
    }, [toast, navigate, courseId, topicId]);

    if (loading) return (<Loading message='Loading exercises...' />);

    return (
        <Flex direction="column" p="4">
            <Heading as={"h2"} size="xl" mb="6">Exercises</Heading>
            <HStack display={"flex"} justifyContent={"space-between"} mb={4}>
                <Link to={`/courses/${courseId}/topics/${topicId}`}>
                    <Button > Back</Button>
                </Link>
                <Link to={`/courses/${courseId}/topics/${topicId}/exercises/create`}>
                    <Button> Create Exercise</Button>
                </Link>
            </HStack>
            {exercises.length === 0 ? (
                <Text>There are no exercises at the moment</Text>
            ) : (
                <Stack spacing={4}>
                    {exercises.map((exercise) => (
                        <Card key={exercise.exerciseId} title={exercise.name}>
                            <Text mb={2}>
                                {exercise.description || "No Description"}
                            </Text>
                            <Link to={`/courses/${courseId}/topics/${topicId}/exercises/${exercise.exerciseId}`}>
                                <Button>View Exercise</Button>
                            </Link>
                        </Card>
                    ))}
                </Stack>
            )}
        </Flex>
    );
};

export default ExerciseList;