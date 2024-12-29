import React, {useState, useEffect, useContext} from 'react';
import { Flex, Heading, FormControl, FormLabel, Input, Button, Textarea, 
            useToast, Select, CheckboxGroup, Checkbox, Popover, PopoverTrigger, PopoverContent, 
            PopoverBody, PopoverCloseButton, useDisclosure, Box, 
            Divider} from '@chakra-ui/react';
import {Form, useNavigate, useParams} from 'react-router-dom';
import {courseService} from '../../services/courseService';
import {useAuth} from "../../hooks/useAuth";
import Loading from "../reusable/Loading";
import {AuthContext} from "../../context/AuthContext";
import { userService } from '../../services/userService';
const CourseForm = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');
    const [prerequisites, setPrerequisites] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('');
    const [instructorIds, setInstructorIds] = useState('');
    const [availableInstructors, setAvailableInstructors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [instructorDropdownOpen, setInstructorDropdownOpen] = useState(false);
    const toast = useToast();
    const { auth } = useContext(AuthContext);
    const { clearAuth } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const difficultyOptions = ["veryEasy", "easy", "medium", "hard", "ultraHard"];

    useEffect(() => {
        const fetchCourse = async() => {
            if (courseId) {
                try {
                    setLoading(true);
                    const response = await courseService.getCourseById(courseId)
                    if (response.status===200){
                        const course = response.data;
                        setName(course.name|| "")
                        setDescription(course.description || '')
                        setCategories(course.categories?.join(',') || '')
                        setPrerequisites(course.prerequisites?.join('') || '')
                        setDifficultyLevel(course.difficultyLevel || '')
                        setInstructorIds(course.instructorIds?.join(',') || '')
                    }
                } catch (err) {
                    toast({
                        title: "Error",
                        description: err.response?.data?.message || "Failed to fetch course.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true
                    })
                    navigate('/courses');
                }
                setLoading(false);
            }
        }
        const fetchInstructors = async () => {
            try {
                const response = await userService.getAllInstructors();
                const instructors = response.data
                console.log(instructors);
                setAvailableInstructors(instructors);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || "Failed to fetch instructors.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                })
            }
            setLoading(false);
        }
        fetchCourse();
        fetchInstructors();
    }, [courseId, toast, navigate]);
    const handleInstructorChange = async() => {
        if (instructorIds?.includes(auth.user.userId)){
            setInstructorIds(instructorIds.split(',')
                .filter(id => id !== auth.user.userId).join(','))
        } else {
            setInstructorIds([...instructorIds.split(',')
                .filter(id=> id.trim()!==""), auth.user.userId].join(','))
        }
    }
    const handleAdminInstructorChange = (ids) => {
        setInstructorIds(ids.join(','));
    }
    const handlePopoverOpen = () => {
        onOpen();
        setInstructorDropdownOpen(true);
    }
    const handlePopoverClose = () => {
        onClose();
        setInstructorDropdownOpen(false);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const courseData = {
            name,
            description,
            categories: categories.split(',').map(cat=>cat.trim()),
            prerequisites: prerequisites.split(',').map(prereq=>prereq.trim()),
            difficultyLevel,
            instructorIds: instructorIds.split(',').map(id=>id.trim())
        };
        try {
            if (courseId){
                const response = await courseService.updateCourse(courseId, courseData)
                if (response.status===200) {
                    toast({
                        title: "Success",
                        description: "Course updated successfully",
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                   })
                  navigate(`/courses/${courseId}`)
                }
            } else {
                const response = await courseService.createCourse(courseData);
                if (response.status===201){
                    toast({
                        title: "Success",
                        description: "Course created successfully",
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                   })
                  navigate(`/courses`);
                }
            }
        } catch (error) {
            toast ({
                title: "Error",
                description: error.response?.data?.message || "Failed to save course.",
                status: 'error',
                duration: 5000,
                isClosable: true
            })
            if (error.response?.status===401) {
                clearAuth();
                navigate("/login")
            }
        } setLoading(false);
    }
    if (loading)return<Loading/>;
    return (
        <Flex direction="column" align="center" justify="center" minH="80vh" p="4" >
            <Heading as="h2" size="xl" mb="6">{courseId ? 'Edit Course' : 'Create Course'}
            </Heading>
            <form onSubmit={handleSubmit}>
                <Flex direction="column" flexWrap="wrap" >
                    <div style={{ flex: 1 }}>
                        <FormControl mb="4">
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input type="text" id="name" value={name} 
                                onChange={(e) => setName(e.target.value)} required
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <Textarea id="description" value={description} 
                                    onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel htmlFor="categories">Categories (comma separated)</FormLabel>
                            <Input type="text" id="categories" value={categories}
                                onChange={(e) => setCategories(e.target.value)}
                            />
                        </FormControl>
                    </div>
                    <div style={{ flex: 1 }}>
                        <FormControl mb="4">
                            <FormLabel htmlFor="prerequisites">Prerequisites (comma separated)</FormLabel>
                            <Input type="text" id="prerequisites" value={prerequisites}
                                onChange={(e) => setPrerequisites(e.target.value)}
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel htmlFor="difficultyLevel">Difficulty Level</FormLabel>
                            <Select id="difficultyLevel" value={difficultyLevel} 
                                    onChange={(e) => setDifficultyLevel(e.target.value)}
                                    placeholder="Select difficulty">
                                    {difficultyOptions.map(option =>
                                        <option value={option} key={option}>{option}</option>
                                    )}
                                </Select>
                        </FormControl>
                        {
                            auth?.user?.roles?.includes("ADMIN") 
                                ?
                            (<FormControl>
                                <FormLabel htmlFor="instructorIds">Instructors</FormLabel>
                                <Popover isOpen={isOpen} onOpen={handlePopoverOpen} onClose={handlePopoverOpen}
                                        placement='bottom-start'>
                                    <PopoverTrigger>
                                        <Input id="instructorIds" placeholder="Edit Instructors" isReadOnly={true}/>
                                    </PopoverTrigger>
                                    <PopoverContent width="fit-content">
                                        <PopoverCloseButton/>
                                        <PopoverBody>
                                            <CheckboxGroup id="instructorIds" 
                                            value={instructorIds.split(",").filter(id => id.trim() != "")}
                                            onChange={handleAdminInstructorChange}>
                                                <Flex direction={'column'}>
                                                    {
                                                        availableInstructors?.map(instructor=>
                                                            (<Checkbox key={instructor.userId} value={instructor.userId}>
                                                                {instructor.firstName} {instructor.lastName}
                                                            </Checkbox>
                                                    ))}
                                                </Flex>
                                            </CheckboxGroup>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>)
                                :
                            (<FormControl>
                                <FormLabel htmlFor="instructorIds">{instructorIds?.includes(auth?.user?.userId)?"Drop":"Add"} course?</FormLabel>
                                <Button onClick={handleInstructorChange} colorScheme={instructorIds?.includes(auth?.user?.userId) ? "maroon" : "lime"}>
                                    {instructorIds?.includes(auth?.user?.userId) ? "Drop course" : "Add course"}
                                </Button>
                            </FormControl>)
                        }
                    </div>
                </Flex>
                
                <Button type="submit" colorScheme="blue" width="100%">
                    {courseId ? 'Update Course' : 'Create Course'}
                </Button>
            </form>
        </Flex>
    );

};

export default CourseForm;
