import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Card,
  CardBody,
  HStack,
  Text,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Grid,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { getBookings, Booking, updateBookingStatus } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
  const { userData } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData) {
        console.log('No user data available in MyBookings');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching bookings for user in MyBookings:', userData.uid);
        const bookingsData = await getBookings(userData.uid, 'user');
        console.log('Bookings loaded in MyBookings:', bookingsData.length);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings in MyBookings:', error);
        toast.error('حدث خطأ في تحميل الحجوزات');
        setBookings([]); // تعيين مصفوفة فارغة في حالة الخطأ
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      toast.success('تم إلغاء الحجز');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('حدث خطأ في إلغاء الحجز');
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  );

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
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={2}>
            <Heading size="lg">حجوزاتي</Heading>
            <Alert status="info" size="sm">
              <AlertIcon />
              <Text fontSize="sm">
                جميع الحجوزات تحتاج موافقة الإدارة قبل أن يتم تأكيدها
              </Text>
            </Alert>
          </VStack>
          <IconButton
            aria-label="تحديث البيانات"
            icon={<RepeatIcon />}
            onClick={() => window.location.reload()}
            colorScheme="brand"
            variant="outline"
          />
        </HStack>

        {/* Filter Buttons */}
        <HStack spacing={2} wrap="wrap">
          {(['all', 'pending', 'accepted', 'completed', 'cancelled'] as const).map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filter === status ? 'solid' : 'outline'}
              colorScheme={filter === status ? 'brand' : 'gray'}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'الكل' : getStatusText(status)}
            </Button>
          ))}
        </HStack>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Alert status="info">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">
                {filter === 'all' ? 'لا توجد حجوزات' : `لا توجد حجوزات ${getStatusText(filter)}`}
              </Text>
              <Text fontSize="sm">
                {bookings.length === 0 
                  ? 'لم تقم بإنشاء أي حجوزات بعد. ابدأ بإنشاء حجز جديد!' 
                  : 'جرب تغيير الفلتر لعرض حجوزات أخرى'
                }
              </Text>
            </VStack>
          </Alert>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredBookings.map((booking) => (
              <Card key={booking.id}>
                <CardBody>
                  <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={4}>
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="bold" fontSize="lg">
                          {booking.serviceType}
                        </Text>
                        <Badge colorScheme={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                      </HStack>
                      
                      <Text color="gray.600">
                        التاريخ: {new Date(booking.date).toLocaleDateString('en-GB')}
                      </Text>
                      
                      <Text color="gray.600">
                        الوقت: {booking.time}
                      </Text>
                      
                      <Text color="gray.600">
                        المدة: {booking.duration} ساعة
                      </Text>
                      
                      {booking.notes && (
                        <Text color="gray.600" fontSize="sm">
                          ملاحظات: {booking.notes}
                        </Text>
                      )}
                    </VStack>

                    <VStack align="end" spacing={3}>
                      <Text fontSize="xl" fontWeight="bold" color="brand.500">
                        {booking.totalPrice} دينار عراقي
                      </Text>
                      
                      <Text fontSize="sm" color="gray.500">
                        {new Date(booking.createdAt).toLocaleDateString('en-GB')}
                      </Text>

                      {booking.status === 'pending' && (
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          إلغاء الحجز
                        </Button>
                      )}

                      {booking.status === 'completed' && (
                        <Button size="sm" colorScheme="brand" variant="outline">
                          تقييم الخدمة
                        </Button>
                      )}
                    </VStack>
                  </Grid>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default MyBookings;



