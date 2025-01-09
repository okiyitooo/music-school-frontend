import React, { useContext, useEffect, useState } from 'react';
import { Box, Text, Flex, Button, useToast } from '@chakra-ui/react';
import MultipleChoiceComponent from './question/MultipleChoiceComponent';
import FillInTheBlankComponent from './question/FillInTheBlankComponent';
import ShortAnswerComponent from './question/ShortAnswerComponent';
import MatchingComponent from './question/MatchingComponent';
import TrueFalseComponent from './question/TrueFalseComponent';
import { enrollmentService } from '../../services/enrollmentService';
import { AuthContext } from '../../context/AuthContext';
import { exerciseService } from '../../services/exerciseService';

/**
 * ExerciseView component renders different types of exercises and handles their submission.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.exercise - The exercise data.
 * @param {Function} props.onSubmit - Callback function to be called when the exercise is completed.
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @component
 * @example
 * const exercise = {
 *   name: 'Sample Exercise',
 *   description: 'This is a sample exercise.',
 *   exerciseType: 'multipleChoice',
 *   instructions: 'Choose the correct option.',
 *   answers: {
 *     options: ['Option 1', 'Option 2', 'Option 3'],
 *     answer: 'Option 1'
 *   }
 * };
 * const handleSubmit = () => console.log('Exercise submitted');
 * return <ExerciseView exercise={exercise} onSubmit={handleSubmit} />;
 */
const ExerciseView = ({exercise, onSubmit, courseId, topicId}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectedPairs, setSelectedPairs] = useState({});
    const [completed, setCompleted] = useState(false);
    const toast = useToast();
    const {auth} = useContext(AuthContext);


    const handleOptionChange = (value) => setSelectedOption(value);
    const handleAnswerChange = (e) => setAnswer(e.target.value);
    const handlePairChange = (key, value) => {
        const newPairs = {...selectedPairs};
        newPairs[key] = value;
        setSelectedPairs(newPairs);
    };

    useEffect(()=>{
        //set complete to true if exercise has been completed
        //if enrollment.progress.topicId.exerciseId === true
        // set completed = true
        const updateCompleted = async () => {
            const enrollmentResponse = await enrollmentService.getEnrollmentsByStudentId(auth.user.userId);
            if (enrollmentResponse.status===200) {
                const enrollment = enrollmentResponse.data[0];
                if (enrollment?.progress[topicId][exercise.exerciseId])
                    setCompleted(true);
            }
        }
        updateCompleted();
    }, [auth, topicId, exercise])
    const complete = (answerIsCorrect, badDescription, multipleAnswers) => {
        if (answerIsCorrect){
            toast({
                title: "Good Job!",
                description: "Correct Answer"+(multipleAnswers?"s":"")+"!",
                status: 'success',
                duration: 5000,
                isClosable: true
            })
            return true;
        } else {
            toast({ title: "Wrong!", description: badDescription || "Incorrect answer, try again!", status: 'warning',
                duration: 5000, isClosable: true
            })
            return false;
        }
    }
    const handleSubmit = async () => {
        let isCorrect = false;
        if (exercise.exerciseType === 'multipleChoice') { 
            isCorrect = await complete(selectedOption===exercise.answers?.answer);
        } 
        if (exercise.exerciseType === 'fillInTheBlank' ) {
            isCorrect = complete(answer.toLowerCase()===exercise.answers?.answer.toLowerCase())
        }
        if (exercise.exerciseType === 'shortAnswer' ) {
            toast({
                title: "Well done",
                description: "Answer subitted!",
                status: 'info', isClosable: true
            })
            isCorrect=true;
        }
        if (exercise.exerciseType === 'trueFalse') {
            isCorrect = complete(selectedOption === exercise.answers?.answer);
        }
        if (exercise.exerciseType === 'matching') {
            let failingPair;
            const pairIsCorrect = Object.keys(selectedPairs).every(
                (key) => {
                    const isPairCorrect = selectedPairs[key] === exercise?.answers?.pairs[key];
                    if (!isPairCorrect)
                        failingPair = key + ' doesn\'t match ' + key
                    return isPairCorrect;
            });
            isCorrect = complete(pairIsCorrect, failingPair, true)
        }
        if (isCorrect) {
            try {
                //update progress plan(if completed):
                //1. get all exercises for the topic
                //2. get the enrollment for the topic and student
                //3. add/update an object in the form of {exerciseId: true} to the progress object
                const studentResponse = await enrollmentService.getEnrollmentsByStudentId(auth.user.userId);
                if (studentResponse.status===200) {
                    const filteredEnrollment = studentResponse.data?.filter(enrollment=>enrollment.courseId===courseId)[0];
                    if (filteredEnrollment) {
                        
                        //mark exercise as complete
                        filteredEnrollment.progress[topicId][exercise.exerciseId] = true; 
                        
                        //update enrollment
                        await enrollmentService.updateEnrollment(filteredEnrollment.enrollmentId, filteredEnrollment); 
                        
                        const exerciseResponse = await exerciseService.getAllExercisesByTopicId(topicId);
                        const exercisesInTopic = exerciseResponse.data
                        const hasIncompleteExercises = Object.values(exercisesInTopic).some(exercise => !filteredEnrollment.progress[topicId][exercise.exerciseId]);
                        const incompleteExercises = exercisesInTopic.filter(exerciseInTopic=>!filteredEnrollment.progress[topicId][exerciseInTopic.exerciseId]);
                        
                        // update topic progress
                        const response = await enrollmentService.updateProgress(filteredEnrollment.enrollmentId, topicId, 
                            !hasIncompleteExercises
                            , (exercisesInTopic.length-incompleteExercises.length)/exercisesInTopic.length) 
                        if (response.status===200) {
                            setCompleted(true);
                        }
                    }
                }
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response || err.response?.message  || "Error updating progress",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                 })
              }
        }
    };

    if (completed) return (
        <Flex direction="column" align="center" justify="center" p="4">
            <Text fontSize="xl" mb="4">Exercise Completed!!!</Text>
            <Button onClick={onSubmit} colorScheme="blue">Back to exercises</Button>
        </Flex>
    );

    if (!exercise) return <Text>Exercise not found</Text>;

    return (
        <Flex direction="column" p="4">
            <Box>
                <Text mb="4">{exercise.description || ""}</Text>
                {(exercise.exerciseType === 'multipleChoice' && exercise.answers) && (
                    <MultipleChoiceComponent
                        question={exercise.answers?.question || "Choose correctly"}
                        options={exercise.answers?.options}
                        selectedOption={selectedOption}
                        onChange={handleOptionChange}
                        onsubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'fillInTheBlank' && (
                    <FillInTheBlankComponent
                        question={exercise.answers?.question || "Fill in the blank"}
                        answer={answer}
                        onChange={handleAnswerChange}
                        onSubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'shortAnswer' && (
                    <ShortAnswerComponent
                        question={exercise.answers?.question}
                        answer={answer}
                        onChange={handleAnswerChange}
                        onSubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'matching' && exercise.answers && (
                    <MatchingComponent
                        question={exercise.answers?.question || "Match the following"}
                        pairs={exercise.answers.pairs}
                        selectedPairs={selectedPairs}
                        onChange={handlePairChange}
                        onSubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'trueFalse' && (
                    <TrueFalseComponent
                        question={exercise.answers?.question || "True or False"}
                        selectedOption={selectedOption}
                        onChange={handleOptionChange}
                        onSubmit={handleSubmit}
                    />
                )}
            </Box>
        </Flex>
    );
};

export default ExerciseView;