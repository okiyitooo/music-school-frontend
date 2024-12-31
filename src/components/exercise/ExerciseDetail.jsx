import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Text, useToast } from '@chakra-ui/react';
import { exerciseService } from '../../services/exerciseService';
import Loading from '../common/Loading';
import ExerciseView from './ExerciseView';
import Card from '../reusable/Card';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

const ExerciseDetail = () => {
    
    const {auth, logout} = useContext(AuthContext);
    const { clearAuth } = useAuth()
    const { exerciseId, courseId } = useParams();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const response = await exerciseService.getExerciseById(exerciseId);
                setExercise(response.data);
            } catch (err) {
                toast({
                    title: "Error loading exercise",
                    description: err.response?.data?.message || err.data?.message || "Failed to fetch exercise.", 
                    status: "error",
                    isClosable: true,
                });
                navigate(`/courses/${courseId}/exercises`)
            }
            setLoading(false);
        };
        fetchExercise();
    }, [exerciseId, toast, navigate, courseId]);
    const handleSubmit = () => {
        navigate(`/couses/${courseId}/topics/${exercise?.topicId}`)
    }
    const handleDelete = async () => {
        try {
            const response = await exerciseService.deleteExercise(exerciseId)
            if (response.data.status===200)
                navigate(`/courses/${courseId}`)
        } catch (err) {
            toast({
                title: "Error deleting exercise",
                description: err.response?.data?.message || err.data?.message || "Failed to fetch exercise.", 
                status: "error",
                isClosable: true,
            })
            clearAuth();
            logout();
            navigate('/login')
        }
    }

    if (loading) {
        return <Loading message="Loading exercise details..." />;
    }

    if (!exercise) {
        return <Flex/>;
    }

    return (
        <Flex direction="column" p="4">
            <Heading as="h2" size="xl" mb="6">{exercise.name} {exercise.exerciseType}</Heading>
            <Card title={"Exercise Details"} >
                <Box>
                    <Text mb="4">{exercise.description || ""}</Text>
                    <Text>{exercise.instructions || "Solve:"}</Text>
                </Box>
                {
                    (auth?.user?.roles?.includes('ADMIN') || auth?.user?.roles?.includes('INSTRUCTOR'))
                        &&
                    <Flex justify={'space-between'} mt={4}>
                        <Link to={`/courses/${courseId}/exercises/${exerciseId}/edit`}>
                            <Button>Edit</Button>
                        </Link>
                        {
                            auth?.user?.roles?.includes('ADMIN') &&
                            <Button onClick={handleDelete} bg={'red.600'}>delete</Button>
                        }
                    </Flex>
                }
                <ExerciseView exercise={exercise} onSubmit={handleSubmit} />
                <Flex justify="space-between" mt={4}>
                    <Button as={Link} colorScheme='sepia' to={`/courses/${courseId}/exercises`}>
                        Back
                    </Button>
                </Flex>
            </Card>
        </Flex>
    );
};

export default ExerciseDetail;