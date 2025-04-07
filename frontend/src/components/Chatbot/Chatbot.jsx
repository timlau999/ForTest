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
                    src="http://192.168.0.172/chat/share?shared_id=b759201e095b11f0b2b50242ac120006&from=chat&auth=Y0ODcxM2RhMGRkNjExZjBiYmFjMDI0Mm"
                    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                ></iframe>
            </div>
        </div>
    );
};

export default Chatbot;
