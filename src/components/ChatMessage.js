import React from 'react';

function ChatMessage({ message, className }) {
  return (
    <div className={`chat-message ${message.isUser ? 'user' : 'bot'} ${className}`}>
      <p>{message.text}</p>
    </div>
  );
}

export default ChatMessage;