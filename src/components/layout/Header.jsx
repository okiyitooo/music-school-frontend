import React, { useContext } from 'react'
import { Flex, Heading, Button, Spacer, HStack } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useAuth } from '../../hooks/useAuth'
const Header = () => {
    const navigate = useNavigate();
    const { auth, logout } = useContext(AuthContext);
    const { clearAuth } = useAuth();

    const handleLogout = () => {
        logout()
        clearAuth();
        navigate('/login');
    };

    return (
        <Flex as="nav" bg="gray.200" p="4" align="center" >
            <Heading as="h1" size="lg">
                <Link to="/">Music Theory Platform</Link>
            </Heading>
            <Spacer />
            <HStack spacing="24px">
                {auth?.isAuthenticated ? (
                    <>
                        <Button onClick={handleLogout}>Logout</Button>
                        <Button as={Link} to="/profile">
                            Profile
                        </Button>
                    </>
                ) : (
                    <>
                        <Button as={Link} to="/login">
                            Login
                        </Button>
                        <Button as={Link} to="/register">
                            Register
                        </Button>
                    </>
                )}
            </HStack>
        </Flex>
    );
};

export default Header;