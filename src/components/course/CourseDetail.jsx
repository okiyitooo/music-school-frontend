import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heading, Text, Flex, Box, Button, useToast } from '@chakra-ui/react';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService'
import Loading from '../reusable/Loading';
import Card from '../reusable/Card';
import { AuthContext } from '../../context/AuthContext';

const CourseDetail = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate()
    const [instructorNames, setInstructorNames] = useState()

    useEffect(() => {
        const fetchCourse = async () => {
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
                navigate("/courses")
            }
            setLoading(false);
        };
        fetchCourse();
    }, [courseId, toast, navigate]);
    useEffect(()=>{
        const fetchInstructorsNames = async () => {
            if (course?.instructorIds) {
                const names = [];
                for (const instructorId of course.instructorIds) {
                    try {
                        const instructorResponse = await userService.getUserById(instructorId)
                        names.push(instructorResponse.data.firstName +' '+instructorResponse.data.lastName)
                    } catch (err) {
                        toast({
                            title: "Error",
                            description: err.response?.data?.message || "Failed to fetch instructor.",
                           status: 'error',
                            duration: 5000,
                            isClosable: true
                        })
                    }
                }
                setInstructorNames(names);
            }
        }
        fetchInstructorsNames();
    }, [course, toast])
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
                    <Text><strong>Difficulty:</strong> {course.difficultyLevel || "Unknown"}</Text>
                    <Text>{instructorNames?.join(", ") || "No instructors"}</Text>
                </Box>
                <Flex justify="space-between" mt={4}>
                    <Button as={Link} colorScheme='green' to={`/courses/${courseId}/topics`}>
                        View Topics
                    </Button>
                    {auth?.user?.roles?.includes("ADMIN") || auth?.user?.roles?.includes("INSTRUCTOR") 
                        ?
                            <Link to={`/courses/${courseId}/edit`}>
                                <Button>Edit Course</Button>
                            </Link>
                        : 
                            null}
                </Flex>
            </Card>
        </Flex>
    );
};

export default CourseDetail;