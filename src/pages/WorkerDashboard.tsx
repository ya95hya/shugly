import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getBookings, Booking } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const WorkerDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData) return;

      try {
        setLoading(true);
        
        // جلب جميع الحجوزات للعامل
        const allBookings = await getBookings(userData.uid, 'worker');
        setBookings(allBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    
    // إعادة تحميل البيانات كل 30 ثانية للتأكد من التحديثات
    const interval = setInterval(fetchBookings, 30000);
    
    return () => clearInterval(interval);
  }, [userData]);

  const handleRefresh = async () => {
    if (!userData) return;
    
    try {
      setRefreshing(true);
      
      // جلب جميع الحجوزات للعامل
      const allBookings = await getBookings(userData.uid, 'worker');
      setBookings(allBookings);
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    } finally {
      setRefreshing(false);
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

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalEarnings: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + b.totalPrice, 0)
  };

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
          <Heading size="lg">لوحة تحكم العامل</Heading>
          <Alert status="info" size="sm">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="bold">
                كيفية عمل النظام:
              </Text>
              <Text fontSize="sm">
                1. المستخدم يطلب حجز خدمة - تظهر لك فوراً
              </Text>
              <Text fontSize="sm">
                2. الحجوزات المعلقة تحتاج موافقة الإدارة قبل البدء بها
              </Text>
              <Text fontSize="sm">
                3. بعد موافقة الإدارة، يمكنك قبول/رفض الحجز أو إكماله
              </Text>
            </VStack>
          </Alert>
        </VStack>
          <HStack spacing={2}>
            <IconButton
              aria-label="تحديث البيانات"
              icon={<RepeatIcon />}
              onClick={handleRefresh}
              isLoading={refreshing}
              colorScheme="brand"
              variant="outline"
            />
            <Button as={RouterLink} to="/worker-services" colorScheme="brand">
              إدارة الخدمات
            </Button>
          </HStack>
        </HStack>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي الحجوزات</StatLabel>
                <StatNumber>{stats.total}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>في الانتظار</StatLabel>
                <StatNumber color="orange.500">{stats.pending}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>مقبولة</StatLabel>
                <StatNumber color="green.500">{stats.accepted}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي الأرباح</StatLabel>
                <StatNumber color="brand.500">{stats.totalEarnings} دينار عراقي</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* All Bookings */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Heading size="md">جميع الحجوزات</Heading>
              
              {bookings.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  لا توجد حجوزات بعد
                </Alert>
              ) : (
                <VStack spacing={3} align="stretch">
                  {bookings.slice(0, 5).map((booking) => (
                    <HStack key={booking.id} justify="space-between" p={4} border="1px" borderColor="gray.200" borderRadius="lg" bg="white" _hover={{ shadow: "md" }}>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold" fontSize="md">{booking.serviceType}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {new Date(booking.date).toLocaleDateString('en-GB')} - {booking.time}
                        </Text>
                        <HStack spacing={2}>
                          <Badge colorScheme={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                          {booking.adminApproved === true ? (
                            <Badge colorScheme="green" variant="subtle">
                              موافق عليه من الإدارة
                            </Badge>
                          ) : booking.adminApproved === false ? (
                            <Badge colorScheme="orange" variant="subtle">
                              في انتظار موافقة الإدارة
                            </Badge>
                          ) : (
                            <Badge colorScheme="gray" variant="subtle">
                              غير محدد
                            </Badge>
                          )}
                        </HStack>
                      </VStack>
                      
                      <VStack align="end" spacing={2}>
                        <Text fontWeight="bold" fontSize="lg" color="brand.500">{booking.totalPrice} دينار عراقي</Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(booking.createdAt).toLocaleDateString('en-GB')}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default WorkerDashboard;
