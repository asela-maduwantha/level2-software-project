import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, Typography, Badge } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import HTTPService from '../../../Service/HTTPService';
import './Chat.css';
import { Element, animateScroll as scroll } from 'react-scroll';

const { Text } = Typography;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [ws, setWs] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const messagesEndRef = useRef(null);

    const adminId = localStorage.getItem('admin_id');

    useEffect(() => {
        fetchUsers();
        return () => { if (ws) ws.close(); };
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const newWs = new WebSocket(`ws://localhost:8000/ws/chat/admin/${adminId}/${selectedUser.type}/${selectedUser.id}/`);
            setWs(newWs);
            newWs.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages(prevMessages => [...prevMessages, data]);
                scrollToBottom();
            };
            fetchChatHistory(selectedUser.id, selectedUser.type);
        }
    }, [selectedUser]);

    const fetchUsers = async () => {
        try {
            const response = await HTTPService.get(`chat/users/${adminId}/`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchChatHistory = async (otherUserId, userType) => {
        try {
            const response = await HTTPService.get(`chat/history/${adminId}/${otherUserId}/${userType}/`);
            setMessages(response.data);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const sendMessage = () => {
        if (ws && messageInput.trim() !== '' && selectedUser) {
            const messageObject = {
                content: messageInput,
                sender_id: adminId
            };
            ws.send(JSON.stringify(messageObject));
            setMessageInput('');
            scrollToBottom();
        }
    };

    const scrollToBottom = () => {
        scroll.scrollToBottom({
            containerId: 'messages-container',
            duration: 250,
            delay: 100,
            smooth: 'easeInOutQuint'
        });
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-layout">
                <div className="chat-sider">
                    <div className="chat-requests-header">
                        <Text strong>Chat Requests</Text>
                    </div>
                    <div className="user-list">
                        {users.map(user => (
                            <div 
                                key={user.id} 
                                onClick={() => setSelectedUser(user)}
                                className={`user-item ${selectedUser && selectedUser.id === user.id ? 'selected' : ''}`}
                            >
                                <Avatar icon={<UserOutlined />} />
                                <div className="user-info">
                                    <Text>{user.username}</Text><br></br>
                                    <Text type="secondary">{user.type}</Text>
                                </div>
                                {user.unreadCount > 0 && (
                                    <Badge count={user.unreadCount} className="unread-badge" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chat-content">
                    <div className="chat-header">
                        {selectedUser && (
                            <>
                                <Avatar icon={<UserOutlined />} />
                                <Text strong>{selectedUser.username}</Text>
                            </>
                        )}
                    </div>
                    <Element id="messages-container" className="messages-container">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.user_role === 'admin' ? 'sent' : 'received'}`}>
                                <div className="message-content">
                                    {msg.content}
                                    <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </Element>
                    <div className="input-area">
                        <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onPressEnter={sendMessage}
                            placeholder="Type a message"
                            className="chat-input"
                            disabled={!selectedUser}
                        />
                        <Button 
                            type="primary" 
                            icon={<SendOutlined />} 
                            onClick={sendMessage}
                            className="send-button"
                            disabled={!selectedUser}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
