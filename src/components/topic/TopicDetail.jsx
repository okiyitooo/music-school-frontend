import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heading, Text, Flex, Box, Button, useToast, HStack } from '@chakra-ui/react';
import { topicService } from '../../services/topicService';

import Loading from '../reusable/Loading';
import Card from '../reusable/Card';
import { AuthContext } from '../../context/AuthContext';
const TopicDetail = () => {
    const { topicId, courseId } = useParams();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);
    const roles = auth?.user?.roles;

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const response = await topicService.getTopicById(topicId);
                setTopic(response.data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch topic details",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                navigate(`/courses/${courseId}/topics`);
            }
            setLoading(false);
        };
        fetchTopic();
    }, [topicId, toast, navigate, courseId]);

    if (loading) {
        return <Loading message="Loading topic details..." />;
    }

    if (!topic) {
        return <Text>Topic not found</Text>;
    }

    return (
        <Flex direction="column" p="4">
            <Heading as="h2" size="xl" mb="6">{topic.name}</Heading>
            <Card title={"Topic Details"} >
                <Box>
                    <Text mb="4">{topic.description || "No Description"}</Text>
                    <Text>{topic.contents || ""}</Text>
                </Box>
                <Flex justify="space-between" mt={4}>
                    <HStack>
                        <Button as={Link} colorScheme='green' to={`/courses/${courseId}/topics/${topicId}/exercises`}>
                            View Exercises
                        </Button>
                        {
                            (roles?.includes("ADMIN") || roles?.includes("INSTRUCTOR"))
                                &&
                            <Link to={`/courses/${courseId}/topics/${topicId}/edit`}>
                                <Button>Edit Topic</Button>
                            </Link>
                        }
                    </HStack>
                </Flex>
            </Card>
        </Flex>
    );
};

export default TopicDetail;