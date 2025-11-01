import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  Button,
  Card,
  CardBody,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const Messages: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Container maxW="1200px" py={8}>
        <Flex justify="center" align="center" h="400px">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">الرسائل</Heading>
        
        <Alert status="info">
          <AlertIcon />
          نظام الرسائل قيد التطوير وسيتم إضافته قريباً
        </Alert>
      </VStack>
    </Container>
  );
};

export default Messages;



