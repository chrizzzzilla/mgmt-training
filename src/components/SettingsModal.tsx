import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ChatConfig } from '../types/chat.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ChatConfig;
  onSave: (config: ChatConfig) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  config, 
  onSave 
}) => {
  const [formData, setFormData] = useState<ChatConfig>(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof ChatConfig, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-chat-sidebar border border-chat-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-chat-text">Einstellungen</h2>
          <button
            onClick={onClose}
            className="text-chat-text-secondary hover:text-chat-text transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-chat-text mb-2">
              n8n Webhook URL
            </label>
            <input
              type="url"
              value={formData.n8nWebhookUrl}
              onChange={(e) => handleChange('n8nWebhookUrl', e.target.value)}
              className="w-full bg-chat-input text-chat-text border border-chat-border 
                       rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-n8n-instance.com/webhook/..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-chat-text mb-2">
              API Key (optional)
            </label>
            <input
              type="password"
              value={formData.apiKey || ''}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              className="w-full bg-chat-input text-chat-text border border-chat-border 
                       rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ihr API-Schlüssel"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-chat-input text-chat-text border border-chat-border 
                       rounded-lg px-4 py-2 hover:bg-chat-message-user transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 
                       hover:bg-blue-700 transition-colors"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
