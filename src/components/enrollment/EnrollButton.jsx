import React, {useState, useContext} from 'react' 
import { Button, useToast} from '@chakra-ui/react'
import { enrollmentService } from '../../services/enrollmentService'
import { AuthContext } from '../../context/AuthContext'
import { exerciseService } from '../../services/exerciseService'
import { topicService } from '../../services/topicService'

const EnrollButton = ({courseId, onEnroll}) => {

    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const { auth } = useContext(AuthContext);
    const handleEnroll= async () => {
        setLoading(true);
        try {
            const enrollmentData = {
                studentId: auth?.user?.userId,
                courseId
            }
            const response = await enrollmentService.enrollInCourse(enrollmentData);
            //for every topic in the course, create a new object with the topicId as the key and an object of exerciseIds and completion status(boolean) as the value

            const incompleteExercises = {}
            const topicsResponse =  await topicService.getAllTopics()
            const topicsInCourse = topicsResponse.data.filter(topic=>topic.courseId===courseId);
            for (const topic of topicsInCourse) {
                const exercisesResponse = await exerciseService.getAllExercisesByTopicId(topic.topicId)
                const exercisesInTopic = exercisesResponse.data;
                const exercises = exercisesInTopic.reduce((acc, exercise) => ({...acc, [exercise.exerciseId]: false}), {})
                incompleteExercises[topic.topicId] = exercises
            }
            await enrollmentService.updateEnrollment(response.data.enrollmentId, {...response.data, progress: incompleteExercises})
            
            if (response.status === 201) {
                onEnroll&&onEnroll();
                toast({
                    title: 'Success',
                    description: 'Successfully Enrolled in Course',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                 description: error.response?.data?.message || error?.data?.message || 'Failed to Enroll in Course',
                  status: 'error',
                duration: 5000,
               isClosable: true
           });
        }
        setLoading(false);
    }
    return (
        <Button colorScheme={'teal'} isLoading={loading} onClick={handleEnroll} loadingText={'Enrolling...'}>Enroll</Button>
    )

}
export default EnrollButton;