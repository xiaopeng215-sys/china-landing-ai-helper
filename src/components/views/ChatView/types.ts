export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}
