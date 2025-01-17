import React, { useContext, useEffect, useState, useRef } from "react";
import { Flex, Heading, Text, Stack, useToast, Box,Input, IconButton, Spacer, HStack, VStack } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { messageService } from "../../services/messageService";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../reusable/Loading";
import { useAuth } from "../../hooks/useAuth";
import { BiSend } from "react-icons/bi";

const MessageDetails = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { logout } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);
  const [ otherUserName, setOtherUserName ] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
        try {
            const senderMessages = await messageService.getMessagesBySenderId(auth?.user?.userId);
            const recipientMessages = await messageService.getMessagesByReceiverId(auth?.user?.userId);
            const allMessages = [...senderMessages.data, ...recipientMessages.data].filter(message => message.senderId===recipientId || message.receiverId===recipientId);
            const sortedMessages = allMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
            setMessages(sortedMessages);
            const otherUser = allMessages.find(message => message.senderId ===  recipientId || message.receiverId === recipientId);
            setOtherUserName(otherUser.senderId===recipientId?otherUser.senderName : otherUser.receiverName);
        } catch (error) {
            if (error.response.status === 401) {
            toast({
                title: "Unauthorized",
                description: "Your session has expired. Please login again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            logout();
            navigate("/login");
            } else {
            toast({
                title: "Error",
                description: "Failed to fetch message details.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            }
        } finally {
            setLoading(false);
        }
        };
        fetchMessage();
    }, [recipientId, toast, logout, navigate, auth?.user?.userId]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    })
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);
        try {
            const messageData = {
                senderId: auth?.user?.userId,
                receiverId: recipientId,
                message: newMessage,
            }
            setNewMessage("");
            await messageService.createMessage(messageData);
            const senderMessages = await messageService.getMessagesBySenderId(auth?.user?.userId);
            const recipientMessages = await messageService.getMessagesByReceiverId(auth?.user?.userId);
            const allMessages = [...senderMessages.data, ...recipientMessages.data].filter(message => message.senderId===recipientId || message.receiverId===recipientId);
            const sortedMessages = allMessages.sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
            setMessages(sortedMessages);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };
    if (loading) {
        return <Loading />;
    }
    if (!otherUserName) {
        return <Text>No messages</Text>;
    }
    return (
        <Flex direction="column" p="4" height={"100%"} >
             <Heading as="h2" size="xl" mb="4">{otherUserName}</Heading>
           <Flex direction="column" flexGrow={1} overflowY="auto"  >
                <VStack align="start" spacing="4" width={'100%'}  >
                    {messages.map((message) => (
                         <Flex key={message.messageId}
                             justifyContent={message.senderId === auth.user.userId ? "flex-end" : "flex-start"} width={'100%'} >
                             <Box
                                 p="2"
                                 bg={message.senderId === auth.user.userId ? "blue.100" : "gray.200"}
                                 borderRadius="md"
                                 maxWidth="70%"
                             >
                                 <Text >{message.message}</Text>
                                  <Text fontSize="sm" color="gray.500">
                                     {message.senderName} - {new Date(message.timeStamp).toLocaleString()}
                                  </Text>
                             </Box>
                          </Flex>
                    ))}
                     <div ref={messageEndRef} />
                </VStack>
            </Flex>
            <HStack spacing="2" mt="4">
              <Input
                   placeholder="Type your message here..."
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                         handleSendMessage()
                      }
                    }}
              />
                 <IconButton
                    aria-label="Send message"
                     icon={<BiSend />}
                     onClick={handleSendMessage}
                 />
           </HStack>
        </Flex>
    );
}

export default MessageDetails;