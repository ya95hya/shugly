import React from 'react';
import {
  Container,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  Text
} from '@chakra-ui/react';
import WorkerServicesForm from '../components/worker/WorkerServicesForm';
import { useAuth } from '../hooks/useAuth';

const WorkerServices: React.FC = () => {
  const { userData } = useAuth();

  if (!userData || userData.role !== 'worker') {
    return (
      <Container maxW="800px" py={8}>
        <Alert status="error">
          <AlertIcon />
          هذه الصفحة متاحة للعمال فقط
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxW="800px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">إدارة الخدمات والأسعار</Heading>
        
        <Alert status="info">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">مرحباً بك في منصة شغلي العراق!</Text>
            <Text fontSize="sm">
              هنا يمكنك إدارة خدماتك وأسعارك. هذه المعلومات ستظهر للمستخدمين في الصفحة الرئيسية.
            </Text>
            <Text fontSize="sm" color="gray.600">
              • أضف الخدمات التي تقدمها<br/>
              • حدد السعر المناسب<br/>
              • اكتب نبذة عن نفسك<br/>
              • حدد موقعك الجغرافي
            </Text>
          </VStack>
        </Alert>

        <WorkerServicesForm />
      </VStack>
    </Container>
  );
};

export default WorkerServices;


