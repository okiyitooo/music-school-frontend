import React, {useState, useEffect, useContext} from 'react';
import { Flex, Heading, Stack, Text, Box, useToast,} from '@chakra-ui/react';
import { enrollmentService } from '../../services/enrollmentService';
import { Loading} from '../reusable/Loading';
import { AuthContext } from '../../context/AuthContext';
import Card from '../reusable/Card';
import { topicService } from '../../services/topicService';
import { useNavigate } from 'react-router-dom';

const ProgressTracker = ({courseId}) => {
    const [enrollment, setEnrollment] = useState(null)
    const [loading, setLoading] = useState(true);
    const [topicNameIdPair, setTopicNameIdPair] = useState({})
    const { auth } = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchEnrollment = async() => {
            if (auth.isAuthenticated) {
                try {
                    const response = await enrollmentService.getEnrollmentsByStudentId(auth.user.userId);
                    if (response.status===200) {
                        const filteredEnrollments = response.data.filter(enrollment=>enrollment.courseId===courseId);
                        setEnrollment(filteredEnrollments[0])
                    }
                } catch (err) {
                    toast({
                        title: "Error",
                          description: err.response?.data?.message || 'Failed to fetch enrollment progress.',
                          status: 'error',
                         duration: 5000,
                          isClosable: true
                      })
                }
            }
            setLoading(false);
        }
        const fetchTopics= async() => {
            setLoading(true);
            try {
                const response = await topicService.getAllTopics();
                const filteredTopics = response.data.filter(topic=>topic.courseId===courseId)
                setTopicNameIdPair(filteredTopics.reduce((acc, topic) => ({...acc, [topic.topicId]:topic.name},{})))
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || 'Failed to fetch topics.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                })
                navigate(  `/courses/${courseId}`);
            }
            setLoading(false);
        }
        fetchEnrollment();
        fetchTopics();
    }
    ,[auth, courseId, toast]);
    if (loading) return (<Loading message='Loading enrollment...' />);
    if (!enrollment) return <Text>Not enrolled in the course</Text>
    return (
        <Flex direction="column" p="4">
            <Heading as={"h2"} size="xl" mb="6">Course Progress</Heading>
            <Card title={"Course Progress"} >
                {
                Object.keys(enrollment?.progress || {}).length===0
                    ?
                (<Text>No progress in the course</Text>)
                    :
                (
                <Stack> 
                    {Object.keys(enrollment.progress).map((topicId)=>{
                        <Box key={topicId} p={2} bg={enrollment.progress[topicId].completed? 'green.100' : 'red.50'}>
                            <Text><strong>Topic: </strong>{topicNameIdPair[topicId]}</Text>
                            <Text><strong>Completed:</strong> {enrollment.progress[topicId].completed ? "Completed" : "Not completed"}
                            </Text>
                            <Text><strong>Score:</strong> {enrollment.progress[topicId].score}
                            </Text>
                        </Box>
                    })}
                </Stack>
                )
                }
            </Card>
        </Flex>
    );
}

export default ProgressTracker;