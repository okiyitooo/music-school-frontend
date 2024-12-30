import { Heading, Flex, Text, Stack, useToast } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { topicService } from '../../services/topicService';
import Card from '../reusable/Card';
import Button from '../reusable/Button';
import Loading from "../reusable/Loading";

const TopicList = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const { courseId } = useParams();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await topicService.getAllTopics();
                const filteredTopics = response.data.filter(topic=>topic.courseId===courseId)
                setTopics(filteredTopics);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch topics",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                navigate(  `/courses/${courseId}`);
            }
            setLoading(false);
        };
        fetchTopics();
    }, [toast, navigate, courseId]);

    if (loading) return (<Loading message='Loading topics...' />);

    return (
        <Flex direction="column" p="4">
            <Heading as={"h2"} size="xl" mb="6">Topics</Heading>
            <Flex justify={"flex-end"} mb={4}>
                <Link to={`/courses/${courseId}/topics/create`}>
                    <Button> Create Topic</Button>
                </Link>
            </Flex>
            {topics.length === 0 ? (
                <Text>There are no topics at the moment</Text>
            ) : (
                <Stack spacing={4}>
                    {topics.map((topic) => (
                        <Card key={topic.topicId} title={topic.name}>
                            <Text mb={2}>
                                {topic.description || "No Description"}
                            </Text>
                            <Link to={`/courses/${courseId}/topics/${topic.topicId}`}>
                                <Button>View Topic</Button>
                            </Link>
                        </Card>
                    ))}
                </Stack>
            )}
        </Flex>
    );
};

export default TopicList;