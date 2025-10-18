export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatConfig {
  n8nWebhookUrl: string;
  apiKey?: string;
}
