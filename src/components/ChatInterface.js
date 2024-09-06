import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import monkLogo from '../images/monk.png';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load messages from local storage
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Add an initial message from the bot
      setMessages([{ text: "Hello! I'm here to help you build your MVP. What's your idea?", isUser: false }]);
    }
  }, []);

  useEffect(() => {
    // Save messages to local storage
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (message) => {
    setMessages([...messages, { text: message, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that guides users in building their MVP (Minimum Viable Product). You provide advice on choosing frameworks, hosting solutions, and other aspects of MVP development." },
          ...messages.map(msg => ({
            role: msg.isUser ? "user" : "assistant",
            content: msg.text
          })),
          { role: "user", content: message }
        ],
      });

      const botReply = response.data.choices[0].message.content;
      setMessages(prevMessages => [...prevMessages, { text: botReply, isUser: false }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: "I'm sorry, I'm having trouble responding right now. Please try again later.", isUser: false }]);
    }

    setIsLoading(false);
  };

  const handleStartOver = () => {
    setMessages([{ text: "Hello! I'm here to help you build your MVP. What's your idea?", isUser: false }]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <img src={monkLogo} alt="Monk Logo" className="monk-logo" />
        <span className="chat-title">MonkLab</span>
        <button className="start-over-btn" onClick={handleStartOver}>Start Over</button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message} 
            className={index % 2 === 0 ? 'even' : 'odd'}
          />
        ))}
        {isLoading && <div className="loading-indicator">AI is thinking...</div>}
      </div>
      <div className="chat-input-container">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default ChatInterface;