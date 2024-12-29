import React, {useContext} from 'react'
import {Box, List, Heading, ListItem, Button} from '@chakra-ui/react'
import { useLocation, Link } from 'react-router-dom'
import {AuthContext} from "../../context/AuthContext";

const Sidebar = () => {
    const location=useLocation();
    const isCoursePage=location.pathname.startsWith("/courses");
    const {auth} = useContext(AuthContext);
    return (
        <Box as="aside" width="250px" bg="gray.50" p="4" height="100vh">
            <Heading as="h2" size="md" mb="4">Navigation</Heading>
            <List spacing={3}>
            <ListItem>
                    <Button
                        as={Link}
                         display="block"
                        padding="2"
                        borderRadius="md"
                        bg={location.pathname === "/" ? "gray.200" : "transparent"}
                         _hover={{ bg: "gray.200" }}
                        to="/"
                        width="100%"
                        textAlign="left"
                    >
                        Home
                    </Button>
                </ListItem>
                <ListItem>
                    <Button
                         as={Link}
                         display="block"
                        padding="2"
                        borderRadius="md"
                        bg={location.pathname.startsWith("/courses") ? "gray.200" : "transparent"}
                        _hover={{ bg: "gray.200" }}
                        to="/courses"
                        width="100%"
                         textAlign="left"
                    >
                        Courses
                    </Button>
                </ListItem>
                {isCoursePage && (
                    <>
                        <ListItem>
                            <Button
                              as={Link}
                              display="block"
                              padding="2"
                              borderRadius="md"
                              bg={location.pathname.startsWith("/courses/") && location.pathname.includes("/topics") ? "gray.200" : "transparent"}
                              _hover={{ bg: "gray.200" }}
                              to={`${location.pathname}/topics`}
                              width="100%"
                              textAlign="left"
                            >
                              Topics
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                             as={Link}
                              display="block"
                              padding="2"
                              borderRadius="md"
                              bg={location.pathname.startsWith("/courses/") && location.pathname.includes("/exercises")  ? "gray.200" : "transparent"}
                              _hover={{ bg: "gray.200" }}
                              to={`${location.pathname}/exercises`}
                              width="100%"
                               textAlign="left"
                            >
                              Exercises
                            </Button>
                        </ListItem>
                    </>
                )}
                {auth?.user?.roles?.includes("ADMIN") && (
                    <ListItem>
                        <Button
                           as={Link}
                            display="block"
                            padding="2"
                            borderRadius="md"
                            bg={location.pathname === "/users" ? "gray.200" : "transparent"}
                             _hover={{ bg: "gray.200" }}
                            to="/users"
                             width="100%"
                              textAlign="left"
                        >
                           Users
                        </Button>
                    </ListItem>
                )}
            </List>
        </Box>
    )
}
export default Sidebar;