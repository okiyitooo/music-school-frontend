import React, { useContext, useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollmentService';
import { AuthContext } from '../../context/AuthContext';

const UnenrollButton = ({ courseId, onUnenroll }) => {
    const toast = useToast();
    const navigate = useNavigate();
    const {auth} = useContext(AuthContext);
    const [loading, setLoading] = useState(false)

    const handleUnenroll = async () => {
        setLoading(true)
        try {
            const response = await enrollmentService.getEnrollmentsByStudentId(auth?.user.userId);
            const enrollment = response.data.filter(enrollment=>enrollment.courseId===courseId)[0]
            await enrollmentService.deleteEnrollment(enrollment.enrollmentId);
            onUnenroll && onUnenroll();
            toast({
                title: "Unenrolled",
                description: "Successfull unenrollment.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate(`/courses/${courseId}`);
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.message || "Unenrollment error.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false)
    };

    return (
        <Button colorScheme="red" isLoading={loading} loadingText='Unenrolling...' onClick={handleUnenroll}>
            Unenroll
        </Button>
    );
};

export default UnenrollButton;