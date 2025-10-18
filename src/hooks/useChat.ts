import { useState, useCallback } from 'react';
import { Message, ChatConfig } from '../types/chat.ts';

export const useChat = (config: ChatConfig) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending message to:', config.n8nWebhookUrl);
      console.log('Message content:', content);
      
      // Versuche zuerst mit CORS
      let response;
      let data;
      
      try {
        response = await fetch(config.n8nWebhookUrl, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
          },
          body: JSON.stringify({
            message: content,
            conversationId: 'default',
            timestamp: new Date().toISOString(),
          }),
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        data = await response.json();
        console.log('Response data:', data);
        
      } catch (corsError) {
        console.log('CORS failed, trying no-cors mode:', corsError);
        
        // Fallback: no-cors Modus (kann keine Antwort lesen)
        await fetch(config.n8nWebhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
          },
          body: JSON.stringify({
            message: content,
            conversationId: 'default',
            timestamp: new Date().toISOString(),
          }),
        });
        
        // Da wir keine Antwort lesen können, simulieren wir eine
        data = { response: 'Nachricht an n8n gesendet (CORS-Problem - keine Antwort empfangen)' };
      }
      
      // Erwarte Antwort im Format: { response: string } oder { message: string }
      const responseText = data.response || data.message || data.text || data.answer || 'Keine Antwort erhalten';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Fetch error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      setError(errorMessage);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `Fehler beim Senden an n8n: ${errorMessage}. Bitte überprüfen Sie die Webhook-URL und CORS-Einstellungen.`,
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
