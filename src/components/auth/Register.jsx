import React, { useState, useContext } from 'react';
import { Flex, Heading, FormControl, FormLabel, Input, 
            Button, Alert, AlertIcon, Box, Text, Select, 
            useToast} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [learningPreferences, setLearningPreferences] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {setAuth} = useContext(AuthContext);
    const {setStoredAuth} = useAuth();
    const toast = useToast()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const response = await authService.signup({ username, email, password, firstName, lastName, learningPreferences, skillLevel });
            if (response.status === 201) {
                const { token } = await authService.login({username, password})
                if (token) {
                    const userResponse= await authService.verifyToken(token) 
                    if (userResponse.status===200){
                        setAuth({isAuthenticated: true, user: userResponse.data, token});
                        setStoredAuth({isAuthenticated: true, user: userResponse.data, token});
                        navigate('/login');
                        toast({
                            title: "Success",
                            description: "Signup Successful",
                            status: "success",
                            duration: 5000,
                            isClosable: true
                        });
                    } else {
                        setError('Registration failed. Please try again.')
                    }
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
        }
        setLoading(false);
    };

    return (
        <Flex direction="column" align="center" justify="center" minH="80vh" p="4">
            <Heading as="h2" size="xl" mb="6">Register</Heading>
            {error && (
                <Alert status="error" mb="4">
                    <AlertIcon />
                    {error}
                </Alert>
            )}
            <Box width={['90%', '80%', '100%']} >
                <form onSubmit={handleSubmit}>
                    <Flex direction={'row'} wrap={'wrap'}><Box flex="1" pr={4}>
                    <FormControl mb="2">
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input 
                        type="text" id="username" value={username} 
                        onChange={(e) => setUsername(e.target.value)} required
                    />
                    </FormControl>
                    <FormControl mb="2">
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input 
                            type="email" id="email" value={email} 
                            onChange={(e) => setEmail(e.target.value)} required
                        />
                    </FormControl>
                    <FormControl mb="2">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input 
                            type="password" id="password" value={password} 
                            onChange={(e) => setPassword(e.target.value)} required
                        />
                    </FormControl>
                    <FormControl mb="2">
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <Input 
                            type="password" id="confirmPassword" value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} required
                        />
                    </FormControl>
                    </Box><Box flex={1}>
                    <FormControl mb="2">
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <Input 
                            type="text" id="firstName" value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} required
                        />
                    </FormControl>
                    <FormControl mb="2">
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <Input 
                            type="text" id="lastName" value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} required
                        />
                    </FormControl>
                    <FormControl mb="2">
                        <FormLabel htmlFor="learningPreferences">Learning Preferences</FormLabel>
                        <Input 
                            type="text" id="learningPreferences" value={learningPreferences} 
                            onChange={(e) => setLearningPreferences(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mb="2">
                        <FormLabel htmlFor="skillLevel">Skill Level</FormLabel>
                        <Select 
                            id="skillLevel" value={skillLevel} 
                            onChange={(e) => setSkillLevel(e.target.value)} required>
                            <option value="complete beginner">Complete Beginner</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </Select>
                    </FormControl>
                    </Box></Flex>
                    <Button type="submit" loadingText='Registering...' isLoading={loading} colorScheme='blue' width="100%">Register</Button>
                </form>
                <Text textAlign="center" mt="4">
                    Already have an account?
                    <Link to="/login" style={{ marginLeft: '5px', color: 'blue' }}>
                        Login
                    </Link>
                </Text>
            </Box>
        </Flex>
    );
};

export default Register;