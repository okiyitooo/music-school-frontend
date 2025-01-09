import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heading, Text, Flex, Box, Button, useToast } from '@chakra-ui/react';
import { courseService } from '../../services/courseService';
import Loading from '../reusable/Loading';
import Card from '../reusable/Card';
import { AuthContext } from '../../context/AuthContext';
import EnrollButton from '../enrollment/EnrollButton';
import ProgressTracker from '../enrollment/ProgressTracker';
import { enrollmentService } from '../../services/enrollmentService';
import UnenrollButton from '../enrollment/UnenrollButton';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const [enrolled, setEnrolled] = useState(false);
    // const [enrollment, setEnrollment] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            setLoading(true);
            try {
                const response = await courseService.getCourseById(courseId);
                setCourse(response.data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch course details",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                navigate("/courses");
            }
            setLoading(false);
        };
        const checkEnrollment = async () => {
            setLoading(true);
            if (auth.isAuthenticated) {
                try {
                    const response = await enrollmentService.getEnrollmentsByStudentId(auth.user.userId);
                    const filteredEnrollments = response?.data?.filter(enrollment => enrollment.courseId === courseId);
                    setEnrolled(filteredEnrollments.length > 0);
                    // setEnrollment(filteredEnrollments[0]);
                } catch (err) {
                    toast({
                        title: "Error",
                        description: err.response?.data?.message || "Failed to check enrollment status",
                        status: "error",
                        duration: 5000,
                        isClosable: true
                    });
                }
            }
            setLoading(false);
        };
        fetchCourse();
        checkEnrollment();
    }, [courseId, toast, navigate, auth.isAuthenticated, auth.user?.userId]);

    const handleEnroll = () => {
        setEnrolled(true);
    };

    const handleUnenroll = () => {
        setEnrolled(false);
    };

    if (loading) {
        return <Loading message="Loading course details..." />;
    }

    if (!course) {
        return <Text>No course found</Text>;
    }

    return (
        <Flex direction="column" p="4">
            <Heading as="h2" size="xl" mb="6">{course.name}</Heading>
            <Card title={"Course Details"} >
                <Box>
                    <Text mb="4">{course.description || "No Description"}</Text>
                    <Text>{course.categories?.join(", ") || "No Categories"}</Text>
                    <Text><strong>Prerequisites:</strong> {course.prerequisites?.join(", ") || "None"}</Text>
                    <Text><strong>Difficulty:</strong> {course.difficultyLevel || "Unknown difficulty"}</Text>
                    <Text>{course.instructorNames?.join(", ") || "No Instructors"}</Text>
                </Box>
                <Flex justify="space-between" mt={4}>
                    <Button as={Link} colorScheme='green' to={`/courses/${courseId}/topics`}>
                        View Topics
                    </Button>
                    {
                    (auth?.user?.roles?.includes("ADMIN") || auth?.user?.roles?.includes("INSTRUCTOR")) 
                        &&
                    <Link to={`/courses/${courseId}/edit`}>
                        <Button>Edit Course</Button>
                    </Link>
                    }
                    {
                    (auth?.isAuthenticated) 
                        &&
                    (
                        !enrolled 
                            ?
                        <EnrollButton courseId={courseId} onEnroll={handleEnroll}/>
                            :
                        <UnenrollButton courseId={courseId} onUnenroll={handleUnenroll} />
                    )
                    }
                </Flex>
                {
                (auth?.isAuthenticated && enrolled)
                    &&
                <ProgressTracker courseId={courseId}/>
                }
            </Card>
        </Flex>
    );
};

export default CourseDetail;