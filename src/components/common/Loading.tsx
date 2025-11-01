import React from 'react';
import { Spinner, Center, VStack, Text } from '@chakra-ui/react';

const Loading: React.FC = () => {
  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" color="brand.500" />
        <Text>جاري التحميل...</Text>
      </VStack>
    </Center>
  );
};

export default Loading;



