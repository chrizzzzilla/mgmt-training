import React from 'react';
import { MessageCircle, Settings } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  onSettingsClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title = "ChatGPT Clone", 
  onSettingsClick 
}) => {
  return (
    <div className="bg-chat-sidebar border-b border-chat-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <MessageCircle size={20} className="text-white" />
        </div>
        <h1 className="text-xl font-semibold text-chat-text">{title}</h1>
      </div>
      
      {onSettingsClick && (
        <button
          onClick={onSettingsClick}
          className="p-2 text-chat-text-secondary hover:text-chat-text 
                   hover:bg-chat-input rounded-lg transition-colors duration-200"
          title="Einstellungen"
        >
          <Settings size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
