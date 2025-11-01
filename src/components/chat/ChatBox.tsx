import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { getMessages, sendMessage, Message } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface ChatBoxProps {
  otherUserId: string;
  otherUserName: string;
  bookingId?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ otherUserId, otherUserName, bookingId }) => {
  const { userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userData) return;

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

  const handleSendMessage = async (messageText: string) => {
    if (!userData) return;

    try {
      setSending(true);
      await sendMessage({
        senderId: userData.uid,
        receiverId: otherUserId,
        text: messageText,
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

  if (!userData) {
    return (
      <Alert status="error">
        <AlertIcon />
        يجب تسجيل الدخول لإرسال الرسائل
      </Alert>
    );
  }

  return (
    <Card h="600px">
      <CardHeader>
        <HStack justify="space-between">
          <HStack>
            <Avatar size="sm" name={otherUserName} />
            <VStack align="start" spacing={0}>
              <Heading size="sm">{otherUserName}</Heading>
              <Text fontSize="xs" color="gray.500">
                {messages.length} رسالة
              </Text>
            </VStack>
          </HStack>
          {bookingId && (
            <Badge colorScheme="brand" variant="subtle">
              حجز #{bookingId.slice(-6)}
            </Badge>
          )}
        </HStack>
      </CardHeader>
      
      <CardBody p={0}>
        <VStack h="full" spacing={0}>
          <Box flex="1" w="full">
            <MessageList messages={messages} loading={loading} />
          </Box>
          
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={sending}
            placeholder={`اكتب رسالة لـ ${otherUserName}...`}
          />
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ChatBox;
