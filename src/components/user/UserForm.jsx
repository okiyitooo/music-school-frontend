import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast, Button, Flex, FormControl, FormLabel, Input, Select, Stack } from '@chakra-ui/react';
import { userService } from '../../services/userService';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../reusable/Loading';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const UserForm = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { auth, setAuth, logout } = useContext(AuthContext);
    const { setStoredAuth, clearAuth} = useAuth();

    const [user, setUser] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        roles: [],
        learningPreferences: '',
        skillLevel: ''
    });
    const [loading, setLoading] = useState(true);
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userId){
                    setUser(auth.user);
                } else {
                    const response = await userService.getUserById(userId);
                    setUser(response.data);
                }
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch user",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
            setLoading(false);
        };

        const fetchRoles = async () => {
            setAvailableRoles(['STUDENT', 'INSTRUCTOR', 'ADMIN']);
        };

        fetchUser();
        fetchRoles();
    }, [userId, toast, auth]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleRoleChange = (e) => {
        const { options } = e.target;
        const selectedRoles = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedRoles.push(options[i].value);
            }
        }
        setUser((prevUser) => ({
            ...prevUser,
            roles: selectedRoles
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (userId)
                await userService.updateUser(userId, user);
            else {
                const userResponse = await authService.updateAccount(user);
                setAuth({...auth, user: userResponse.data})
                setStoredAuth({...auth, user: userResponse.data})
            }
            toast({
                title: "Success",
                description: "User updated successfully",
                status: "success",
                duration: 5000,
                isClosable: true
            });
            navigate(userId?'/users':'/profile');
        } catch (err) {
            toast({
                title: "Error",
                description: err.response?.data?.message || err.response?.data || "Failed to save user",
                status: "error",
                duration: 5000,
                isClosable: true
            });
            if (err.response?.status===401){
                logout();
                clearAuth();
                navigate('/login')
            }
        }
        setLoading(false);
    };

    if (loading) return <Loading message="Loading user form..." />;

    return (
        <Flex direction="column" p="4">
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl id="username">
                        <FormLabel>Username</FormLabel>
                        <Input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="firstName">
                        <FormLabel>First Name</FormLabel>
                        <Input
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="lastName">
                        <FormLabel>Last Name</FormLabel>
                        <Input
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="email" >
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                        />
                    </FormControl>
                    {
                    auth?.user?.roles?.includes('ADMIN') &&
                    <FormControl id="roles">
                        <FormLabel>Roles</FormLabel>
                        <Select
                            name="roles"
                            value={user.roles}
                            placeholder='Select roles'
                            onChange={handleRoleChange}
                        >
                            {availableRoles.map((role) => (
                                <option 
                                    key={role} value={role}
                                    style={{ backgroundColor: user.roles?.includes(role) ? '#4FFFB0' : 'white', borderRadius: '5px' }}
                                    >
                                    {role}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                    }
                    <FormControl id="learningPreferences">
                        <FormLabel>Learning Preferences</FormLabel>
                        <Input
                            type="text"
                            name="learningPreferences"
                            value={user.learningPreferences}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl id="skillLevel">
                        <FormLabel>Skill Level</FormLabel>
                        <Select 
                            name="skillLevel"
                            value={user.skillLevel}
                            onChange={handleChange}
                        >
                            <option value="complete beginner">Complete Beginner</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </Select>
                    </FormControl>
                    <Button type="submit" colorScheme="blue">
                        {'Update'}
                    </Button>
                </Stack>
            </form>
        </Flex>
    );
};

export default UserForm;