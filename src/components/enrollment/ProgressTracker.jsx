import React, {useState, useEffect, useContext} from 'react';
import { Flex, Stack, Text, Box, useToast, Progress} from '@chakra-ui/react';
import { enrollmentService } from '../../services/enrollmentService';
import Loading from '../reusable/Loading';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { topicService } from '../../services/topicService';

const ProgressTracker = ({courseId: initialCourseId, topicId}) => {
    const [enrollment, setEnrollment] = useState(null)
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);
    const toast = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchEnrollment = async() => {
            if (auth.isAuthenticated) {
                try {
                    const response = await enrollmentService.getEnrollmentsByStudentId(auth.user.userId);
                    if (response.status===200) {
                        let courseId = initialCourseId;
                        if (!courseId) {
                            const topic = await topicService.getTopicById(topicId);
                            courseId = topic.data.courseId;
                        }
                        const filteredEnrollment = response.data.filter(enrollment=>enrollment.courseId===courseId)[0];
                        setEnrollment(filteredEnrollment)
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
        fetchEnrollment();
    }
    ,[auth, initialCourseId, toast, navigate, topicId]);

    if (loading) return (<Loading message='Loading enrollment...' />);
    if (!enrollment) return <Text>Not enrolled in the course</Text>

    const totalTopics = Object.keys(enrollment?.progress || {}).length;
    const completedTopics = Object.values(enrollment?.progress || {}).filter(topic => topic.completed).length;
    const progressPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

    return (
        <Flex direction="column" p="4">
                {
                Object.keys(enrollment?.progress || {}).length===0
                    ?
                (<Text>No Topics</Text>)
                    :
                (topicId 
                    ?
                <Box key={topicId} p={2} bg={enrollment.progress[topicId]?.completed? 'green.100' : 'red.50'}>
                    <Text>{enrollment?.progress[topicId]?.completed ? "✔" : "❌"}
                    </Text>
                    <Text><strong>Score:</strong> {(enrollment.progress[topicId]?.score || 0)*100+'%'}
                    </Text>
                </Box>
                    :
                <Stack> 
                    <Progress
                        value={progressPercentage}
                        size="sm"
                        colorScheme={progressPercentage === 100 ? 'green' : 'blue'}
                        width={"300px"}
                    />
                    <Text colorScheme='green'>{progressPercentage===100 && 'Completed'}</Text>
                </Stack>
                )}
        </Flex>
    );
}

export default ProgressTracker;