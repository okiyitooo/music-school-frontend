import React, {useState, useContext} from 'react' 
import { Button, useToast} from '@chakra-ui/react'
import { enrollmentService } from '../../services/enrollmentService'
import { AuthContext } from '../../context/AuthContext'

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
        <Button colorScheme={'blackAlpha'} isLoading={loading} onClick={handleEnroll} loadingText={'Enrolling...'}>Enroll</Button>
    )

}
export default EnrollButton;