import React, { useState, useEffect,  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heading, Flex, Box, Button, Input, Textarea, useToast, Select } from '@chakra-ui/react';
import { topicService } from '../../services/topicService';
import { exerciseService } from '../../services/exerciseService';
import Loading from '../reusable/Loading';
import { useAuth } from '../../hooks/useAuth';
import ErrorBoundary from '../boundary/ErrorBoundary';

const TopicForm = () => {
    const { courseId, topicId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [contents, setContents] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { clearAuth } = useAuth();
    const [exercises, setExercises] = useState([]);
    const [exerciseIds, setExerciseIds] = useState([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await exerciseService.getAllExercises();
                setExercises(response.data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || "Failed to fetch exercises",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        };
        fetchExercises();
        const fetchTopic = async () => {
            if (topicId) {
                setLoading(true);
                try {
                    const response = await topicService.getTopicById(topicId);
                    const topic = response.data;
                    setName(topic.name);
                    setDescription(topic.description);
                    setContents(topic.contents);
                    setExerciseIds(topic.exerciseIds)
                } catch (err) {
                    toast({
                        title: "Error",
                        description: err.response?.data?.message || "Failed to fetch topic details",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                    navigate(`/courses/${courseId}/topics`);
                }
                setLoading(false);
            }
        };
        fetchTopic();
    }, [topicId, courseId, toast, navigate]);

    const handleExerciseChange = async (e) => {
        const selectedExerciseId = e.target.value;
        setExerciseIds((prevExerciseIds) =>{
                try{
                    if (!prevExerciseIds) 
                        return [selectedExerciseId]
                    return prevExerciseIds?.includes(selectedExerciseId)
                        ? prevExerciseIds.filter((id) => id !== selectedExerciseId)
                        : [prevExerciseIds && [...prevExerciseIds], selectedExerciseId]
                } catch(err){
                    toast({
                        title: "Error",
                        description: err.response?.data?.message || "Failed to add exercise",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                }
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const topicData = { name, description, contents, courseId, exerciseIds };
            if (topicId) {
                await topicService.updateTopic(topicId, topicData);
                toast({
                    title: "Success",
                    description: "Topic updated successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            } else {
                await topicService.createTopic(topicData);
                toast({
                    title: "Success",
                    description: "Topic created successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                });
            }
            navigate(`/courses/${courseId}/topics`);
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.message || "Failed to save topic",
                status: "error",
                duration: 5000,
                isClosable: true
            });
            if (err.response?.status===401)
            {
                clearAuth();
                navigate('/login')
            }
        }
        setLoading(false);
    };

    if (loading) {
        return <Loading message="Loading topic form..." />;
    }

    return (
        <ErrorBoundary>
            <Flex direction="column" p="4">
                <Heading as="h2" size="xl" mb="6">{topicId ? "Edit Topic" : "Create Topic"}</Heading>
                <Box as="form" onSubmit={handleSubmit}>
                    <Input
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        mb="4"
                        required
                    />
                    <Textarea
                        placeholder="Description"
                        value={description||""}
                        onChange={(e) => setDescription(e.target.value)}
                        mb="4"
                    />
                    <Textarea
                        placeholder="Contents"
                        value={contents||""}
                        onChange={(e) => setContents(e.target.value)}
                        mb="4"
                    />
                    <Select placeholder="Add exercises?" onChange={handleExerciseChange} mb="4" variant={'flushed'}>
                        {exercises.map((exercise) => (
                            <option key={exercise.id} value={exercise.id}>
                                {exercise.name}
                            </option>
                        ))}
                    </Select>
                    <Button type="submit" colorScheme="blue" isLoading={loading}>
                        {topicId ? "Update Topic" : "Create Topic"}
                    </Button>
                </Box>
            </Flex>
        </ErrorBoundary>
    );
};

export default TopicForm;
