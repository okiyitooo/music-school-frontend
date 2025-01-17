import React, {useEffect, useState, useContext} from "react";
import { Flex, Heading, Text, Stack, useToast, Box, } from "@chakra-ui/react";
import { messageService } from "../../services/messageService";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../reusable/Loading";
import Button from "../reusable/Button";

const MessageList = () => {

    const [otherUsers, setOtherUsers] = useState([]);
    const {auth} = useContext(AuthContext);
    const toast = useToast();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messageResponse = await messageService.getAllMessages();
                const messageData = messageResponse.data;
                const recievers = messageData.map(({recieverId, recieverName}) => {return {userId:recieverId, userName: recieverName};});
                const senders = messageData.map(({senderId, senderName}) => {return {userId:senderId, userName: senderName};});
                const allUsers = [...recievers, ...senders];
                const uniqueUsersIds = [...new Set(allUsers.map(user => user.userId))];
                const otherUserIds = uniqueUsersIds.filter(id => id !== auth?.user?.userId && id);
                const otherUsers = otherUserIds.map(id => allUsers.find(user => user.userId === id))
                setOtherUsers(otherUsers);
            } catch (err) {
                toast({
                    title: "Error",
                    description: err.response?.data?.message || err.response?.data || "Failed to fetch messages",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
            setLoading(false);
        };
        fetchMessages();
    }, [auth?.user?.userId, toast]);
    if (loading) {
        return <Loading message="Loading messages..." />;
    }
    return (
        <Flex direction="column" p="4">
            <Heading as="h2" size="xl" mb="6">Messages</Heading>
            <Flex justify={'flex-end'} mb="4">
                <Button as={Link} to="/messages/new" colorScheme='green'>
                    New Message
                </Button>
            </Flex>
            <Stack spacing={4}>
                {otherUsers?.length > 0 ? otherUsers.map((user, index) => (
                    <Box key={index} p={4} shadow="md" borderWidth="1px">
                        <Text>{user.userName}</Text>
                        <Button as={Link} to={`/messages/${user.userId}`} colorScheme='green'>
                            View Messages
                        </Button>
                    </Box>
                )) : <Text>No messages</Text>} 
            </Stack>
        </Flex>
    );
}

export default MessageList;