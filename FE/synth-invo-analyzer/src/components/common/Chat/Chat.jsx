// Chat.js
import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const socket = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // or wherever you store the token
        socket.current = new WebSocket(`ws://localhost:8000/ws/chat/?token=${token}`);

        socket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        return () => socket.current.close();
    }, []);

    const sendMessage = () => {
        socket.current.send(JSON.stringify({ message }));
        setMessage('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user_id} ({msg.role}):</strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
