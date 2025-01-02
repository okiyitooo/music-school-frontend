import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, HStack, Input, Stack, Text, useToast, VStack } from '@chakra-ui/react';
import { userService } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../reusable/Loading';

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                let response;
                if (!userId)
                    response=await userService.getUserById(auth?.user?.userId);
                else 
                    response = await userService.getUserById(userId);
                console.log(response.data)
                setUser(response.data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch user details",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
                navigate('/users');
            }
            setLoading(false);
        };
        fetchUser();
    }, [userId, toast, navigate, auth]);

    if (loading) {
        return <Loading message="Loading user profile..." />;
    }

    if (!user) {
        return <Text>No user found</Text>;
    }

    return (
        <>
        {
        (auth?.user?.roles?.includes('ADMIN') || auth?.user?.id === user.id) 
            ?
        <Flex direction="column" p="4" >
            <Heading as="h2" size="xl" mb="6">{user.username}'s Profile</Heading>
            <Box>
                <HStack justify={'space-evenly'}>
                    <Text mb="4"><strong>Email:</strong></Text>
                    <Input type="email" value={user.email} readOnly />
                </HStack>
                <HStack justify={'space-evenly'}>
                    <Text mb="4"><strong>Username:</strong></Text>
                    <Input type="text" value={user.username} readOnly />
                </HStack>
                <HStack justify={'space-evenly'}>
                    <Text mb="4"><strong>FirstName:</strong></Text>
                    <Input type="text" value={user.firstName} readOnly />
                </HStack>
                <HStack justify={'space-evenly'}>
                    <Text mb="4"><strong>LastName:</strong></Text>
                    <Input type="text" value={user.lastName} readOnly />
                </HStack>
                <Stack justify={'space-evenly'}>
                    <Text mb="4"><strong>Learning Preferences:</strong></Text>
                    <Input type="text" value={user.learningPreferences || ''} readOnly />
                </Stack>
                <Stack justify={'space-evenly'}>
                    <Text mb="4"><strong>Skill Level:</strong></Text>
                    <Input type="text" value={user.skillLevel || ''} readOnly />
                </Stack>
                {
                    (auth?.user?.roles?.includes('ADMIN')) 
                        &&
                    <>
                        <Text ><strong>Roles:</strong></Text>
                        <VStack>
                            {user.roles.map((role, index) => {
                                return <Text key={index}>{role}</Text>
                            })}
                        </VStack>
                    </>
                }
            </Box>
            <Flex justify="space-between" mt={4}>
                <Button as={Link} colorScheme='skyblue' to={userId ? '/users/' : "/home"}>
                    Back
                </Button>
                <Button as={Link} bg='skyblue.200' to={`/users/${userId || auth?.user?.userId}/edit`}>
                    Edit Profile
                </Button>
            </Flex>
        </Flex>
            :
        <Text> Unauthorized</Text>
        }
        </>
    );
};

export default UserProfile;