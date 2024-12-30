import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Heading, Text, Flex, Button, useToast } from '@chakra-ui/react';
import MultipleChoiceComponent from './question/MultipleChoiceComponent';
import FillInTheBlankComponent from './question/FillInTheBlankComponent';
import ShortAnswerComponent from './question/ShortAnswerComponent';
import MatchingComponent from './question/MatchingComponent';
import TrueFalseComponent from './question/TrueFalseComponent';

const ExerciseView = ({exercise}) => {
    const { courseId } = useParams();
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

    if (completed) return 
        <Flex>
            <Text>Exercise Completed!!!</Text>
            <Link to={`/courses/${courseId}/topics/${exercise.topicId}`}>
                <Button>Back to topic</Button>
            </Link>
        </Flex>;

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