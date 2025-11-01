import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Heading,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Avatar
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { Worker } from '../../firebase/firestore';

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  return (
    <Card overflow="hidden" shadow="md" _hover={{ shadow: 'lg' }} transition="all 0.2s">
      <Image
        src={worker.images[0] || '/placeholder-worker.jpg'}
        alt={worker.name}
        h="200px"
        objectFit="cover"
      />
      <CardBody>
        <VStack align="start" spacing={3}>
          <Heading size="md">{worker.name}</Heading>
          <Text color="gray.600" fontSize="sm" noOfLines={2}>
            {worker.bio}
          </Text>
          
          <HStack>
            <HStack>
              <StarIcon color="yellow.400" />
              <Text fontSize="sm" fontWeight="bold">{worker.rating.toFixed(1)}</Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              ({worker.reviewsCount} تقييم)
            </Text>
          </HStack>
          
          <HStack wrap="wrap" spacing={1}>
            {worker.services.slice(0, 3).map((service) => (
              <Badge key={service} colorScheme="brand" variant="subtle" fontSize="xs">
                {service}
              </Badge>
            ))}
            {worker.services.length > 3 && (
              <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                +{worker.services.length - 3} أخرى
              </Badge>
            )}
          </HStack>
          
          <Text fontWeight="bold" color="brand.500" fontSize="lg">
            {worker.hourlyRate} دينار عراقي/ساعة
          </Text>
          
          <HStack>
            <Text fontSize="sm" color="gray.600">الموقع:</Text>
            <Text fontSize="sm">{worker.location}</Text>
          </HStack>
          
          <HStack>
            <Badge colorScheme={worker.availability ? 'green' : 'red'} variant="subtle">
              {worker.availability ? 'متاح' : 'غير متاح'}
            </Badge>
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter>
        <Button
          as={RouterLink}
          to={`/worker/${worker.uid}`}
          colorScheme="brand"
          w="full"
          isDisabled={!worker.availability}
        >
          {worker.availability ? 'عرض التفاصيل' : 'غير متاح'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkerCard;



