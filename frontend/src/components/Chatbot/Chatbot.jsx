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
                 //   src="http://192.168.0.179/chat/share?shared_id=996c372e30a411f095bb0242ac150006&from=agent&auth=E5YWRkYjBlMjVhNzExZjBiYTJhMDI0Mm"
                    src="http://34.234.143.101/chat/share?shared_id=83eb3b1c318e11f0bc090242ac120006&from=agent&auth=NjYjg4OTAyMzE4ZTExZjBhN2RmMDI0Mm"
		    style={{ width: '100%', height: '100%' }}
                    frameBorder="0"
                ></iframe>
            </div>
        </div>
    );
};

export default Chatbot;
