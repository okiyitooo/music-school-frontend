import React, { useState, useContext, useEffect } from 'react'
import { Flex, Heading, FormControl, FormLabel, Input, Button, Textarea, useToast, List, ListItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { messageService } from '../../services/messageService';
import { AuthContext } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../reusable/Loading';
import { debounce } from 'lodash';

const MessageForm = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [reciever, setReciever] = useState("");
    const [message, setMessage] = useState("");
    const toast = useToast();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const { clearAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [displayUserName, setDisplayUserName] = useState("");

    const fetchUsers = async (term) => {
        try {
            if (term.length > 0) {
                const usersResponse = await messageService.searchUsersByUserName(term);
                if (usersResponse.status === 200) {
                    setUsers(usersResponse.data);
                }
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                toast({
                    title: "Unauthorized",
                    description: "Your session has expired. Please login again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                clearAuth();
                navigate("/login");
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch users.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    const debouncedFetchUsers = debounce(fetchUsers, 300);

    useEffect(() => {
        debouncedFetchUsers(searchTerm);
    }, [debouncedFetchUsers, searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!message.trim()) return;
            if (!reciever) return;
            const messageData = {
                senderId: auth?.user?.userId,
                receiverId: reciever,
                message: message,
            };
            await messageService.createMessage(messageData);
            navigate("/messages");
            toast({
                title: "Success",
                description: "Message sent.",
                status: "info",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            if (error.response.status === 401) {
                toast({
                    title: "Unauthorized",
                    description: "Your session has expired. Please login again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                clearAuth();
                navigate("/login");
            } else {
                toast({
                    title: "Error",
                    description: "Failed to send message.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        setLoading(false);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <Flex direction="column" p="4" height={"100%"} >
            <Heading as="h2" size="xl" mb="4">Send Message</Heading>
            <form onSubmit={handleSendMessage}>
                <FormControl mb="4" id="search">
                    <FormLabel htmlFor='searchTerm'>To{displayUserName?' '+displayUserName:''}</FormLabel>
                    <Input type="text" id="searchTerm" value={searchTerm} placeholder='Enter username here...' onChange={handleSearch} />
                </FormControl>
                <List spacing={3} mt="4" maxH="200px" overflowY="auto" display={users?.length > 0 ? "flex" : "none"} flexDir="column">``
                    {users?.length > 0 ? users.map((user, index) => (
                        <ListItem value={user.username}as={Button} key={user.userId} 
                            onClick={() => {
                                setReciever(user.userId);
                                setSearchTerm('');
                                setUsers([]);
                                setDisplayUserName(user.username);
                            }}
                            
                        >{user.username}
                        </ListItem>
                    )) : null}
                </List>
                <FormControl mt="4">
                    <FormLabel htmlFor='message'>Message</FormLabel>
                    <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
                </FormControl>
                <Button type="submit" colorScheme="green" mt="4">Send</Button>
            </form>
        </Flex>
    );
};

export default MessageForm;