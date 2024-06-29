import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Card, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './Chat.css';

const { Content } = Layout;

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [ws, setWs] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Get username from localStorage or prompt user
        let storedUsername = localStorage.getItem('username');
        if (!storedUsername) {
            storedUsername = prompt('Please enter your username:');
            if (storedUsername) {
                localStorage.setItem('username', storedUsername);
            } else {
                message.error('Username is required to chat.');
                return;
            }
        }
        setUsername(storedUsername);

        // Connect to WebSocket
        const newWs = new WebSocket('ws://localhost:8000/ws/chat/');
        setWs(newWs);

        newWs.onopen = () => {
            console.log('WebSocket Connected');
        };

        newWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, data]);
        };

        newWs.onerror = (error) => {
            console.error('WebSocket error:', error);
            message.error('Failed to connect to chat server.');
        };

        return () => {
            if (newWs) newWs.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws && messageInput.trim() !== '') {
            const messageObject = {
                username: username,
                message: messageInput,
                timestamp: new Date().toISOString()
            };
            ws.send(JSON.stringify(messageObject));
            setMessageInput('');
        }
    };

    return (
        <Layout className="chat-layout">
            <Content className="chat-content">
                <Card className="chat-card" title={`Chat as ${username}`}>
                <div className="messages-container">
    {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.username === username ? 'sent' : 'received'}`}>
            <div className="message-content">
                {msg.username !== username && <strong>{msg.username}: </strong>}
                {msg.message}
            </div>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
        </div>
    ))}
</div>
                    <div className="input-area">
                        <Input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onPressEnter={sendMessage}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <Button 
                            type="primary" 
                            icon={<SendOutlined />} 
                            onClick={sendMessage}
                            className="send-button"
                        >
                            Send
                        </Button>
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default Chat;