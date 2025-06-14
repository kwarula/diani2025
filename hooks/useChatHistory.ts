import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/database';

type ChatHistoryItem = Database['public']['Tables']['chat_history']['Row'];

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  responseData?: any;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert database chat history to Message format
  const convertToMessage = (item: ChatHistoryItem): Message => {
    return {
      id: item.id,
      text: item.message,
      isUser: item.is_user,
      timestamp: new Date(item.created_at),
      responseData: item.response_data,
    };
  };

  // Load chat history from Supabase
  const loadChatHistory = useCallback(async () => {
    if (!user) {
      setChatHistory([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(100); // Limit to last 100 messages

      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      const convertedMessages = data.map(convertToMessage);
      setChatHistory(convertedMessages);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save message to chat history
  const saveMessage = useCallback(async (message: string, isUser: boolean, responseData?: any) => {
    if (!user) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .insert({
          user_id: user.id,
          message,
          is_user: isUser,
          response_data: responseData,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving message:', error);
        return;
      }

      const newMessage = convertToMessage(data);
      setChatHistory(current => [...current, newMessage]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [user]);

  // Clear chat history
  const clearChatHistory = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing chat history:', error);
        return;
      }

      setChatHistory([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  }, [user]);

  // Load chat history when user changes
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  return {
    chatHistory,
    isLoading,
    saveMessage,
    clearChatHistory,
    refreshChatHistory: loadChatHistory,
  };
}