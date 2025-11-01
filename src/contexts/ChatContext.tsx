import React, { createContext, useContext, useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Message } from '../firebase/firestore';

interface ChatContextType {
  conversations: { [key: string]: Message[] };
  unreadCount: { [key: string]: number };
  loading: boolean;
}

const ChatContext = createContext<ChatContextType>({
  conversations: {},
  unreadCount: {},
  loading: true
});

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useAuth();
  const [conversations, setConversations] = useState<{ [key: string]: Message[] }>({});
  const [unreadCount, setUnreadCount] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) {
      setConversations({});
      setUnreadCount({});
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'messages'),
        where('senderId', '==', userData.uid),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        const messages: Message[] = [];
        snapshot.forEach((doc) => {
          messages.push({ ...doc.data(), id: doc.id } as Message);
        });

        // Group messages by conversation
        const groupedMessages: { [key: string]: Message[] } = {};
        messages.forEach((message) => {
          const otherUserId = message.receiverId;
          if (!groupedMessages[otherUserId]) {
            groupedMessages[otherUserId] = [];
          }
          groupedMessages[otherUserId].push(message);
        });

        setConversations(groupedMessages);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'messages'),
        where('receiverId', '==', userData.uid),
        where('read', '==', false)
      ),
      (snapshot) => {
        const unread: { [key: string]: number } = {};
        snapshot.forEach((doc) => {
          const message = doc.data() as Message;
          const senderId = message.senderId;
          unread[senderId] = (unread[senderId] || 0) + 1;
        });
        setUnreadCount(unread);
      }
    );

    return () => unsubscribe();
  }, [userData]);

  const value = {
    conversations,
    unreadCount,
    loading
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};















