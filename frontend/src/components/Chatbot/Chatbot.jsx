import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div className="chatbot-icon" onClick={toggleChatbot}>
                💬
            </div>
            <div className={`chatbot-window ${isOpen ? 'show' : ''}`}>
                <iframe
                    src="http://192.168.0.179/chat/share?shared_id=9fe6964c25a711f099c20242ac120006&from=chat&auth=E5YWRkYjBlMjVhNzExZjBiYTJhMDI0Mm"
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                ></iframe>
            </div>
        </div>
    );
};

export default Chatbot;
