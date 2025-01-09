import React, { useState, useContext } from 'react'
import { Flex, Heading, FormControl, FormLabel, 
         Input, Button, Alert, AlertIcon, Box, Text, 
         useToast} from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { setAuth, } = useContext(AuthContext)
    const { setStoredAuth, clearAuth } = useAuth()
    const toast = useToast();
    const handleSubmit = async (e) => {
        clearAuth();
        e.preventDefault()
        try {
            const response = await authService.login({username, password})
            if (response.status===200) {
                const { token } = response.data;
                const userResponse = await authService.verifyToken(token)
                if(userResponse.status === 200){
                    setAuth({isAuthenticated: true, user:userResponse.data, token});
                    setStoredAuth({isAuthenticated: true, user:userResponse.data, token});
                    navigate('/');
                    toast({
                        title: "Success",
                        description: "Login Successful",
                        status: "success",
                        duration: 5000,
                        isClosable: true
                    });
               } else {
                  setError('Login failed. Please try again.');
               }
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Login failed. Please try again.');
        }
    }
    return (
        <Flex
            direction="column" align="center" justify="center" minH="80vh" p="4">
                <Heading as="h2" size="xl" mb="6">Login</Heading>
                {error && (
                    <Alert status="error" mb="4">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
                <Box width={['90%', '80%', '60%']}>
                    <form onSubmit={handleSubmit}>
                        <FormControl mb="4">
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input 
                                type="text" id="username" value={username} 
                                onChange={(e) => setUsername(e.target.value)} required
                            />
                        </FormControl>
                        <FormControl mb="4">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                type="password" id="password" value={password}
                                onChange={(e) => setPassword(e.target.value)} required
                            />
                        </FormControl>
                        <Button type="submit" colorScheme='blue' width="100%">Login</Button>
                    </form>
                    <Text textAlign="center" mt="4">
                        Don't have an account?
                        <Link  to="/register"  style={{marginLeft: '5px', color: 'blue'}}>
                            Register
                        </Link>
                    </Text>
                </Box>
        </Flex>
    );
}
export default Login;