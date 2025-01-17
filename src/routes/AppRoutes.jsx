import React, { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from '../components/auth/Login.jsx';
import Register from '../components/auth/Register.jsx';
import CourseList from '../components/course/CourseList';
import CourseDetail from '../components/course/CourseDetail';
import TopicList from '../components/topic/TopicList';
import TopicDetail from '../components/topic/TopicDetail';
import ExerciseList from '../components/exercise/ExerciseList';
import ExerciseDetail from '../components/exercise/ExerciseDetail';
import UserProfile from '../components/user/UserProfile';
import UserList from '../components/user/UserList';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Flex } from '@chakra-ui/react';
import Loading from '../components/reusable/Loading'
import { AuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService.js';
import CourseForm from '../components/course/CourseForm';
import TopicForm from '../components/topic/TopicForm';
import ExerciseForm from '../components/exercise/ExerciseForm';
import UserForm from '../components/user/UserForm';
import MessageRoutes from './MessageRoutes';

const AppRoutes = () => {
    const {auth, setAuth} = useContext(AuthContext);
    const {setStoredAuth} = useAuth();
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const checkAuth = async() => {
            const initialCheck = localStorage.getItem("initialCheck");
               if (initialCheck === null) {
                    const storedAuth = localStorage.getItem('auth')
                    if (storedAuth) {
                        try {
                            const authData = JSON.parse(storedAuth)
                            const {token} = authData
                            const response = await authService.verifyToken(token);
                            if (response.status===200){
                                setAuth({isAuthenticated: true, user:response.data, token})
                                setStoredAuth(authData)
                            } else {
                                setAuth({ isAuthenticated: false, user:null, token:null })
                                setStoredAuth(null)
                            }
                        } catch (error) {
                            setAuth({ isAuthenticated: false, user:null, token:null })
                            setStoredAuth(null)
                        }
                        localStorage.setItem("initialCheck", "true")
                    }
            }
            setLoading(false)
        }
        checkAuth();
    }, [setAuth, setStoredAuth])
    if (loading)
        return (<Loading />);
    const PrivateRoute = ({ children }) => {
        return auth?.isAuthenticated ? children : <Navigate to="/login" />;
    }
    const InstructorRoute = ({children}) => {
        return auth?.isAuthenticated && (
                (auth?.user?.roles?.includes("ADMIN")) || 
                (auth?.user?.roles?.includes("INSTRUCTOR"))
                ) 
                    ? children 
                    : <Navigate to="/"/>
    }
    const AdminRoute = ({children}) => {
        return auth?.isAuthenticated && (auth?.user?.roles?.includes("ADMIN")) 
                    ? children 
                    : <Navigate to="/"/>
    }
    return (
        <BrowserRouter>
            <Header />
            <Flex>
                <Sidebar />
                <Flex flex="1" p="4" height="100vh" overflow={'auto'} sx={{scrollbarWidth: 'none', msOverflowStyle: 'none', '&::-webkit-scrollbar': {display: 'none'}}}>
                    <Routes>
                        <Route path="/" element={<Flex flexDirection={['column', 'row']} alignItems={['center', 'flex-start']} justifyContent={['center', 'flex-start']} height="100vh" p="8">Home Page</Flex>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/courses" element={<CourseList />} />
                        <Route path="/courses/:courseId" element={<CourseDetail />} />
                        <Route path="/courses/create" element={<PrivateRoute><InstructorRoute><CourseForm /></InstructorRoute></PrivateRoute>} />
                        <Route path="/courses/:courseId/edit" element={<PrivateRoute><InstructorRoute><CourseForm /></InstructorRoute></PrivateRoute>} />
                        <Route path="/courses/:courseId/topics" element={<TopicList />} />
                        <Route path="/courses/:courseId/topics/:topicId" element={<TopicDetail />} />
                        <Route path="/courses/:courseId/topics/create" element={<PrivateRoute><InstructorRoute><TopicForm /></InstructorRoute></PrivateRoute>} />
                        <Route path="/courses/:courseId/topics/:topicId/edit" element={<PrivateRoute><InstructorRoute><TopicForm /></InstructorRoute></PrivateRoute>} />
                        <Route path="/courses/:courseId/topics/:topicId/exercises" element={<PrivateRoute><ExerciseList /></PrivateRoute>} />
                        <Route path="/courses/:courseId/topics/:topicId/exercises/:exerciseId" element={<PrivateRoute><ExerciseDetail /></PrivateRoute>} />
                        <Route path="/courses/:courseId/topics/:topicId/exercises/create" element={<PrivateRoute><InstructorRoute><ExerciseForm /></InstructorRoute></PrivateRoute>} />
                        <Route path="/courses/:courseId/topics/:topicId/exercises/:exerciseId/edit" element={<PrivateRoute><InstructorRoute><ExerciseForm /></InstructorRoute></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>}/>
                        <Route path="/users/:userId" element={<PrivateRoute><UserProfile /></PrivateRoute>}/>
                        <Route path="/users" element={<PrivateRoute><AdminRoute><UserList /></AdminRoute></PrivateRoute>} />
                        <Route path="/users/:userId/edit" element={<PrivateRoute><UserForm /></PrivateRoute>} />
                        <Route path="/users/me/edit" element={<PrivateRoute><UserForm /></PrivateRoute>} />
                        <Route path="/*" element={<PrivateRoute><MessageRoutes /></PrivateRoute>} />
                    </Routes>
                </Flex>
            </Flex>
        </BrowserRouter>
    )
}
export default AppRoutes;