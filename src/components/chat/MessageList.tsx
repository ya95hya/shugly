import React, { useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { Message } from '../../firebase/firestore';
import { useAuth } from '../../hooks/useAuth';

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading = false }) => {
  const { userData } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner color="brand.500" />
      </Flex>
    );
  }

  if (messages.length === 0) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Text color="gray.500">لا توجد رسائل بعد</Text>
      </Flex>
    );
  }

  return (
    <Box h="400px" overflowY="auto" p={4}>
      <VStack spacing={3} align="stretch">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === userData?.uid;
          
          return (
            <Flex
              key={message.id}
              justify={isOwnMessage ? 'flex-end' : 'flex-start'}
            >
              <HStack
                spacing={2}
                maxW="70%"
                bg={isOwnMessage ? 'brand.500' : 'gray.100'}
                color={isOwnMessage ? 'white' : 'black'}
                p={3}
                borderRadius="lg"
                align="start"
              >
                {!isOwnMessage && (
                  <Avatar size="sm" name="مستخدم" />
                )}
                
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm">{message.text}</Text>
                  <Text fontSize="xs" opacity={0.7}>
                    {new Date(message.timestamp).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </VStack>
                
                {isOwnMessage && (
                  <Avatar size="sm" name={userData?.name} />
                )}
              </HStack>
            </Flex>
          );
        })}
        <div ref={messagesEndRef} />
      </VStack>
    </Box>
  );
};

export default MessageList;



