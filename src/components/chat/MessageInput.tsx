import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  placeholder = "اكتب رسالتك..."
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box p={4} borderTop="1px" borderColor="gray.200">
      <form onSubmit={handleSubmit}>
        <HStack spacing={2}>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            isDisabled={disabled}
            size="md"
          />
          <IconButton
            type="submit"
            aria-label="إرسال الرسالة"
            icon={<ArrowForwardIcon />}
            colorScheme="brand"
            isDisabled={!message.trim() || disabled}
            size="md"
          />
        </HStack>
      </form>
    </Box>
  );
};

export default MessageInput;
