import { useState, useEffect } from 'react';
import { getMessages, sendMessage, Message } from '../firebase/firestore';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useChat = (otherUserId: string) => {
  const { userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userData || !otherUserId) return;

      try {
        setLoading(true);
        const messagesData = await getMessages(userData.uid, otherUserId);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('حدث خطأ في تحميل الرسائل');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userData, otherUserId]);

  const sendNewMessage = async (text: string) => {
    if (!userData) return;

    try {
      setSending(true);
      await sendMessage({
        senderId: userData.uid,
        receiverId: otherUserId,
        text,
        read: false
      });
      
      // Refresh messages
      const messagesData = await getMessages(userData.uid, otherUserId);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('حدث خطأ في إرسال الرسالة');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    // TODO: Implement mark as read functionality
    console.log('Marking message as read:', messageId);
  };

  return {
    messages,
    loading,
    sending,
    sendMessage: sendNewMessage,
    markAsRead,
    refetch: async () => {
      if (!userData || !otherUserId) return;
      setLoading(true);
      try {
        const messagesData = await getMessages(userData.uid, otherUserId);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error refetching messages:', error);
      } finally {
        setLoading(false);
      }
    }
  };
};











