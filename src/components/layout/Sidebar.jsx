import React from 'react'
import {Box, List, Heading, Link, ListItem} from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
const Sidebar = ({auth}) => {
    const location=useLocation();
    const isCoursePage=location.pathname.startsWith("/courses")
    return (
        <Box as="aside" width="250px" bg="gray.50" p="4" height="100vh"
        >
            <Heading as="h2" size="md" mb="4">Navigation</Heading>
            <List spacing={3}>
            <ListItem>
                   <Link
                        display="block"
                        padding="2"
                        borderRadius="md"
                        bg={location.pathname === "/" ? "gray.200" : "transparent"}
                        _hover={{ bg: "gray.200" }}
                        to="/"
                        as={Link}
                    >
                        Home
                    </Link>
                </ListItem>
                <ListItem>
                  <Link
                       display="block"
                        padding="2"
                        borderRadius="md"
                        bg={location.pathname.startsWith("/courses") ? "gray.200" : "transparent"}
                        _hover={{ bg: "gray.200" }}
                        to="/courses"
                        as={Link}
                    >
                        Courses
                    </Link>
                </ListItem>
                {isCoursePage && (
                  <>
                      <ListItem>
                          <Link
                              display="block"
                              padding="2"
                              borderRadius="md"
                              bg={location.pathname.startsWith("/courses/") && location.pathname.includes("/topics") ? "gray.200" : "transparent"}
                              _hover={{ bg: "gray.200" }}
                              to={`${location.pathname}/topics`}
                              as={Link}
                          >
                              Topics
                          </Link>
                      </ListItem>
                      <ListItem>
                          <Link
                              display="block"
                              padding="2"
                              borderRadius="md"
                              bg={location.pathname.startsWith("/courses/") && location.pathname.includes("/exercises")  ? "gray.200" : "transparent"}
                              _hover={{ bg: "gray.200" }}
                              to={`${location.pathname}/exercises`}
                              as={Link}
                          >
                              Exercises
                          </Link>
                      </ListItem>
                  </>
              )}
                 {auth?.user?.roles?.includes("ADMIN") && (
                    <ListItem>
                        <Link
                           display="block"
                            padding="2"
                            borderRadius="md"
                            bg={location.pathname === "/users" ? "gray.200" : "transparent"}
                            _hover={{ bg: "gray.200" }}
                            to="/users"
                            as={Link}
                        >
                           Users
                        </Link>
                    </ListItem>
                )}
            </List>
        </Box>
    )
}
export default Sidebar