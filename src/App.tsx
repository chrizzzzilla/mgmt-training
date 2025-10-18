import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './components/ChatHeader.tsx';
import MessageBubble from './components/MessageBubble.tsx';
import ChatInput from './components/ChatInput.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import { useChat } from './hooks/useChat.ts';
import { ChatConfig, Message } from './types/chat.ts';

const defaultConfig: ChatConfig = {
  n8nWebhookUrl: 'http://localhost:3001/api/n8n',
  apiKey: '',
};

function App() {
  const [config, setConfig] = useState<ChatConfig>(() => {
    const saved = localStorage.getItem('chatConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat(config);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem('chatConfig', JSON.stringify(config));
  }, [config]);

  const handleSendMessage = (content: string) => {
    if (!config.n8nWebhookUrl) {
      setShowSettings(true);
      return;
    }
    
    // Test-Modus: Wenn die Nachricht mit "test:" beginnt, simuliere eine Antwort
    if (content.toLowerCase().startsWith('test:')) {
      const testResponse = content.substring(5).trim() || 'Test-Nachricht erhalten!';
      const testMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `[TEST-MODUS] ${testResponse}`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, testMessage]);
      return;
    }
    
    sendMessage(content);
  };

  const handleSaveConfig = (newConfig: ChatConfig) => {
    setConfig(newConfig);
  };

  const handleClearChat = () => {
    if (window.confirm('Möchten Sie den Chat wirklich löschen?')) {
      clearMessages();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-chat-bg">
      <ChatHeader 
        onSettingsClick={() => setShowSettings(true)}
      />
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-semibold text-chat-text mb-2">
              Willkommen bei ChatGPT Clone
            </h2>
            <p className="text-chat-text-secondary mb-6 max-w-md">
              Beginnen Sie eine Unterhaltung, indem Sie eine Nachricht eingeben. 
              Die n8n Webhook-Integration ist bereits konfiguriert und bereit!
              <br /><br />
              <strong>Tipp:</strong> Schreiben Sie "test: Hallo" um den Test-Modus zu verwenden.
            </p>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg 
                       transition-colors duration-200"
            >
              Einstellungen anzeigen
            </button>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="bg-chat-message-ai text-chat-text border border-chat-border 
                                rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-chat-text-secondary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-chat-text-secondary rounded-full animate-bounce" 
                           style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-chat-text-secondary rounded-full animate-bounce" 
                           style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-3 mx-4 mb-2 rounded-lg">
          <strong>Fehler:</strong> {error}
        </div>
      )}

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder="Nachricht eingeben..."
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        config={config}
        onSave={handleSaveConfig}
      />

      {/* Clear Chat Button (only show when there are messages) */}
      {messages.length > 0 && (
        <div className="absolute bottom-20 right-4">
          <button
            onClick={handleClearChat}
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full 
                     shadow-lg transition-colors duration-200"
            title="Chat löschen"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
