import React, { useState } from 'react';
import { Box, Heading, Text, Flex, Button, useToast } from '@chakra-ui/react';
import MultipleChoiceComponent from './question/MultipleChoiceComponent';
import FillInTheBlankComponent from './question/FillInTheBlankComponent';
import ShortAnswerComponent from './question/ShortAnswerComponent';
import MatchingComponent from './question/MatchingComponent';
import TrueFalseComponent from './question/TrueFalseComponent';

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
const ExerciseView = ({exercise, onSubmit}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectedPairs, setSelectedPairs] = useState({});
    const [completed, setCompleted] = useState(false);
    const toast = useToast();


    const handleOptionChange = (value) => setSelectedOption(value);
    const handleAnswerChange = (e) => setAnswer(e.target.value);
    const handlePairChange = (key, value) => {
        const newPairs = {...selectedPairs};
        newPairs[key] = value;
        setSelectedPairs(newPairs);
    };
    const complete = async (answerIsCorrect, badDescription, multipleAnswers) => {
        if (answerIsCorrect){
            setCompleted(true);
            toast({
                title: "Good Job!",
                description: "Correct Answer"+(multipleAnswers?"s":"")+"!",
                status: 'success',
                 duration: 5000,
                   isClosable: true
             })
        } else {
            setCompleted(false);
            toast({ title: "Wrong!", description: badDescription || "Incorrect answer, try again!", status: 'warning',
                 duration: 5000, isClosable: true
            })
        }
    }
    const handleSubmit = async () => {
        if (exercise.exerciseType === 'multipleChoice') { 
            await complete(selectedOption===exercise.answers?.answer);
        } 
        if (exercise.exerciseType === 'fillInTheBlank' ) {
            complete(answer===exercise.answers?.answer)
        }
        if (exercise.exerciseType === 'shortAnswer' ) {
            toast({
                title: "Well done",
                description: "Answer subitted!",
                status: 'info', isClosable: true
            })
            setCompleted(true);
        }
        if (exercise.exerciseType === 'trueFalse') {
            complete(selectedOption === exercise.answer?.answer);
        }
        if (exercise.exerciseType === 'matching') {
            let failingPair;
            const isCorrect = Object.keys(selectedPairs).every(
                (key) => {
                    const isPairCorrect = selectedPairs[key] === exercise?.answers?.pairs[key];
                    if (!isPairCorrect)
                        failingPair = key + ' doesn\'t match ' + key
                    return isPairCorrect;
            });
            complete(isCorrect, failingPair, true)
        }
        console.log('Submitted');
    };

    if (completed) return (
        <Flex direction="column" align="center" justify="center" p="4">
            <Text fontSize="xl" mb="4">Exercise Completed!!!</Text>
            <Button onClick={onSubmit} colorScheme="blue">Back to course</Button>
        </Flex>
    );

    if (!exercise) return <Text>Exercise not found</Text>;

    return (
        <Flex direction="column" p="4">
            <Heading as="h2" size="xl" mb="6">{exercise.name}</Heading>
            <Box>
                <Text mb="4">{exercise.description || ""}</Text>
                {exercise.exerciseType === 'multipleChoice' && exercise.answers (
                    <MultipleChoiceComponent
                        question={exercise.instructions}
                        options={exercise.answers.options}
                        selectedOption={selectedOption}
                        onChange={handleOptionChange}
                        onsubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'fillInTheBlank' && (
                    <FillInTheBlankComponent
                        question={exercise.instructions}
                        answer={answer}
                        onChange={handleAnswerChange}
                        onSubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'shortAnswer' && (
                    <ShortAnswerComponent
                        question={exercise.instructions}
                        answer={answer}
                        onChange={handleAnswerChange}
                        onSubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'matching' && exercise.answers && (
                    <MatchingComponent
                        question={exercise.instructions || null}
                        pairs={exercise.answers.pairs}
                        selectedPairs={selectedPairs}
                        onChange={handlePairChange}
                        onSubmit={handleSubmit}
                    />
                )}
                {exercise.exerciseType === 'trueFalse' && (
                    <TrueFalseComponent
                        question={exercise.instructions}
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