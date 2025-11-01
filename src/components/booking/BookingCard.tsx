import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Heading,
  Divider,
  Avatar,
  Flex
} from '@chakra-ui/react';
import { Booking } from '../../firebase/firestore';
import { getStatusColor, getStatusText } from '../../utils/helpers';

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: (bookingId: string, status: Booking['status']) => void;
  showActions?: boolean;
  userRole?: 'user' | 'worker';
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  booking, 
  onStatusChange, 
  showActions = false,
  userRole = 'user'
}) => {
  const handleStatusChange = (newStatus: Booking['status']) => {
    if (onStatusChange) {
      onStatusChange(booking.id, newStatus);
    }
  };

  const getActionButtons = () => {
    if (!showActions) return null;

    if (userRole === 'worker') {
      if (booking.status === 'pending') {
        return (
          <HStack spacing={2}>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => handleStatusChange('accepted')}
            >
              قبول
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => handleStatusChange('rejected')}
            >
              رفض
            </Button>
          </HStack>
        );
      } else if (booking.status === 'accepted') {
        return (
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => handleStatusChange('completed')}
          >
            إنهاء الخدمة
          </Button>
        );
      }
    } else if (userRole === 'user') {
      if (booking.status === 'pending') {
        return (
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={() => handleStatusChange('cancelled')}
          >
            إلغاء الحجز
          </Button>
        );
      } else if (booking.status === 'completed') {
        return (
          <Button
            size="sm"
            colorScheme="brand"
            variant="outline"
          >
            تقييم الخدمة
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1}>
              <Heading size="md">{booking.serviceType}</Heading>
              <Text color="gray.600" fontSize="sm">
                {new Date(booking.date).toLocaleDateString('en-GB')} - {booking.time}
              </Text>
              <Text color="gray.600" fontSize="sm">
                المدة: {booking.duration} ساعة
              </Text>
            </VStack>
            
            <VStack align="end" spacing={2}>
              <Badge colorScheme={getStatusColor(booking.status)}>
                {getStatusText(booking.status)}
              </Badge>
              <Text fontWeight="bold" color="brand.500">
                {booking.totalPrice} دينار عراقي
              </Text>
            </VStack>
          </Flex>

          {booking.notes && (
            <>
              <Divider />
              <Text fontSize="sm" color="gray.600">
                <Text fontWeight="bold">ملاحظات:</Text> {booking.notes}
              </Text>
            </>
          )}

          <Divider />

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.500">
              {new Date(booking.createdAt).toLocaleDateString('en-GB')}
            </Text>
            {getActionButtons()}
          </Flex>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default BookingCard;



