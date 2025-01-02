import React, { useEffect, useState } from 'react';
import { useToast, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import Loading from '../reusable/Loading';
import Card from '../reusable/Card';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userService.getAllUsers();
                setUsers(response.data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch users",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
            setLoading(false);
        };
        fetchUsers();
    }, [toast]);

    if (loading) return (<Loading message='Loading users...' />);

    return (
        <Flex direction="column" p="4">
            <Heading as={"h2"} size="xl" mb="6">Users</Heading>
            <Flex justify={"flex-end"} mb={4}>
                <Link to="/users/create">
                    <Button> Create User</Button>
                </Link>
            </Flex>
            <Stack spacing={4}>
                {users.map((user) => (
                    <Card key={user.userId} title={user.username}>
                        <Text mb={2}>
                            {user.email || "No Email"}
                        </Text>
                        <Link to={`/users/${user.userId}`}>
                            <Button>View User</Button>
                        </Link>
                    </Card>
                ))}
            </Stack>
        </Flex>
    );
};

export default UserList;