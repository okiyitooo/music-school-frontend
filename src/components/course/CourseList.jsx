import { Heading, Flex, Text, Stack, useToast } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService';
import Card from '../reusable/Card';
import Button from '../reusable/Button';
import Loading from "../reusable/Loading";

const CourseList = () => {

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const toast = useToast()
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseService.getAllCourses();
                setCourses(response.data)
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch courses",
                    status: "error"
                    ,duration: 5000,
                    isClosable: true
                })
            }
            setLoading(false);
        }
        fetchCourses();
    }, [toast])
    if (loading)
        return (<Loading message='Loading courses...'/>);
    return (
        <Flex direction="column" p="4">
            <Heading as={"h2"} size="xl" mb="6">Courses</Heading>
            <Flex justify={"flex-end"} mb={4}>
                <Link to="/courses/create">
                    <Button> Create Course</Button>
                </Link>
            </Flex>
            {courses.length===0 ? (<Text>There are no courses at the moment</Text>)
                :
            (<Stack spacing={4}>
                {courses.map((course)=>
                        (<Card key={course.courseId} title={course.name}>
                            <Text mb={2}>
                                {course.description || "No Description"}
                            </Text>
                            <Link to={`/courses/${course.courseId}`}>
                                <Button>View Course</Button>
                            </Link>
                        </Card>)
                )}
            </Stack>)
            }
            
        </Flex>);
}

export default CourseList;