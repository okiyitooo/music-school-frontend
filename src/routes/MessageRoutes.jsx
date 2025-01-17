import React from "react";
import { Route, Routes } from "react-router-dom";
import MessageList from "../components/message/MessageList";
import MessageForm from "../components/message/MessageForm";
import MessageDetails from "../components/message/MessageDetails";

const MessageRoutes = () => {
    return (
        <Routes>
            <Route path="/messages" element={<MessageList />}/>
            <Route path="/messages/new" element={ <MessageForm />}/>
            <Route path="/messages/:recipientId" element={ <MessageDetails />}/>
        </Routes>
    );
}

export default MessageRoutes;