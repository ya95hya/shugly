import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  HStack,
  VStack,
  Text,
  Avatar,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Card,
  CardBody,
  Heading,
  Divider,
  useToast
} from '@chakra-ui/react';
import { getAllBookings, approveBooking, rejectBooking } from '../../firebase/firestore';
import { Booking } from '../../firebase/firestore';
import { getStatusColor, getStatusText } from '../../utils/helpers';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        console.log('Fetching all bookings for admin...');
        const bookingsData = await getAllBookings();
        console.log('Bookings fetched:', bookingsData.length);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'خطأ في تحميل الحجوزات',
          description: 'حدث خطأ في تحميل قائمة الحجوزات',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const handleApproveBooking = async (bookingId: string) => {
    try {
      await approveBooking(bookingId);
      
      // تحديث القائمة المحلية
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'accepted', adminApproved: true } : booking
      ));
      
      // إعادة تحميل البيانات للتأكد من التحديث
      setTimeout(async () => {
        try {
          const updatedBookings = await getAllBookings();
          setBookings(updatedBookings);
        } catch (error) {
          console.error('Error refreshing bookings:', error);
        }
      }, 1000);
      
      toast({
        title: 'تم قبول الحجز',
        description: 'تم قبول الحجز بنجاح وسيظهر للعامل الآن',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error approving booking:', error);
      toast({
        title: 'خطأ في قبول الحجز',
        description: 'حدث خطأ في قبول الحجز',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await rejectBooking(bookingId);
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: 'rejected', adminApproved: false } : booking
      ));
      
      toast({
        title: 'تم رفض الحجز',
        description: 'تم رفض الحجز',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: 'خطأ في رفض الحجز',
        description: 'حدث خطأ في رفض الحجز',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStats = () => {
    const pending = bookings.filter(b => b.status === 'pending').length;
    const accepted = bookings.filter(b => b.status === 'accepted').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const rejected = bookings.filter(b => b.status === 'rejected').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    return { pending, accepted, completed, rejected, cancelled };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">إدارة الحجوزات</Heading>
          <Text color="gray.600">إجمالي الحجوزات: {bookings.length}</Text>
        </HStack>

        {/* Stats Cards */}
        <HStack spacing={4} wrap="wrap">
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                  {stats.pending}
                </Text>
                <Text fontSize="sm" color="gray.600">في الانتظار</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {stats.accepted}
                </Text>
                <Text fontSize="sm" color="gray.600">مقبولة</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {stats.completed}
                </Text>
                <Text fontSize="sm" color="gray.600">مكتملة</Text>
              </VStack>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <VStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {stats.rejected + stats.cancelled}
                </Text>
                <Text fontSize="sm" color="gray.600">ملغية/مرفوضة</Text>
              </VStack>
            </CardBody>
          </Card>
        </HStack>

        <Divider />

        {/* Bookings Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>المستخدم</Th>
              <Th>نوع الخدمة</Th>
              <Th>التاريخ والوقت</Th>
              <Th>المدة</Th>
              <Th>السعر</Th>
              <Th>الحالة</Th>
              <Th>الإجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {bookings.map((booking) => (
              <Tr key={booking.id}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={booking.userId} />
                    <Text fontSize="sm">{booking.userId}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Text fontWeight="medium">{booking.serviceType}</Text>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm">
                      {new Date(booking.date).toLocaleDateString('en-GB')}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {booking.time}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Text>{booking.duration} ساعة</Text>
                </Td>
                <Td>
                  <Text fontWeight="bold" color="brand.500">
                    {booking.totalPrice} دينار عراقي
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(booking.status)}>
                    {getStatusText(booking.status)}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {booking.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleApproveBooking(booking.id)}
                        >
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleRejectBooking(booking.id)}
                        >
                          رفض
                        </Button>
                      </>
                    )}
                    {booking.status === 'accepted' && (
                      <Text fontSize="sm" color="green.500">
                        مقبولة من الإدارة
                      </Text>
                    )}
                    {booking.status === 'completed' && (
                      <Text fontSize="sm" color="blue.500">
                        مكتملة
                      </Text>
                    )}
                    {booking.status === 'rejected' && (
                      <Text fontSize="sm" color="red.500">
                        مرفوضة من الإدارة
                      </Text>
                    )}
                    {booking.status === 'cancelled' && (
                      <Text fontSize="sm" color="gray.500">
                        ملغية
                      </Text>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {bookings.length === 0 && (
          <Alert status="info">
            <AlertIcon />
            <Text>لا توجد حجوزات</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default BookingManagement;
