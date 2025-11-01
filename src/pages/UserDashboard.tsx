import React, { useState, useEffect } from 'react';
import {
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
  Button,
  Badge,
  Spinner,
  Flex,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBookings } from '../hooks/useBookings';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Booking, Worker } from '../firebase/firestore';

const UserDashboard: React.FC = () => {
  const { userData } = useAuth();
  const { bookings, loading, getStats } = useBookings();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [availableWorkers, setAvailableWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(true);
  const [allServices, setAllServices] = useState<string[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [serviceStats, setServiceStats] = useState<{[key: string]: number}>({});

  useEffect(() => {
    if (bookings.length > 0) {
      setRecentBookings(bookings.slice(0, 3));
    }
  }, [bookings]);

  useEffect(() => {
    const fetchAvailableWorkers = async () => {
      try {
        setWorkersLoading(true);
        const workersSnapshot = await getDocs(collection(db, 'workers'));
        console.log('Workers snapshot size:', workersSnapshot.size);
        
        const workers = workersSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Worker data:', { id: doc.id, name: data.name, availability: data.availability });
          return {
            ...data,
            uid: doc.id
          } as Worker;
        });
        
        const availableWorkers = workers.filter(worker => worker.availability);
        console.log('Available workers:', availableWorkers.length);
        setAvailableWorkers(availableWorkers);
      } catch (error) {
        console.error('Error fetching workers:', error);
        console.error('Error details:', error);
        // Set empty array on error to prevent crashes
        setAvailableWorkers([]);
      } finally {
        setWorkersLoading(false);
      }
    };

    fetchAvailableWorkers();
  }, []);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        setServicesLoading(true);
        const workersSnapshot = await getDocs(collection(db, 'workers'));
        const servicesSet = new Set<string>();
        
        const serviceCounts: {[key: string]: number} = {};
        
        workersSnapshot.docs.forEach(doc => {
          const worker = doc.data() as Worker;
          if (worker.services && Array.isArray(worker.services)) {
            worker.services.forEach(service => {
              if (service && service.trim()) {
                const trimmedService = service.trim();
                servicesSet.add(trimmedService);
                serviceCounts[trimmedService] = (serviceCounts[trimmedService] || 0) + 1;
              }
            });
          }
        });
        
        setAllServices(Array.from(servicesSet).sort());
        setServiceStats(serviceCounts);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchAllServices();
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

  const stats = getStats();

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">لوحة تحكم المستخدم</Heading>
        
        <Text color="gray.600">
          مرحباً {userData?.name}، هنا يمكنك إدارة حجوزاتك والبحث عن العمال والخدمات المتاحة
        </Text>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي الحجوزات</StatLabel>
                <StatNumber color="blue.500">{stats.total}</StatNumber>
                <StatHelpText>جميع الحجوزات</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>الحجوزات المعلقة</StatLabel>
                <StatNumber color="yellow.500">{stats.pending}</StatNumber>
                <StatHelpText>في انتظار الموافقة</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>الحجوزات المقبولة</StatLabel>
                <StatNumber color="green.500">{stats.accepted}</StatNumber>
                <StatHelpText>تم قبولها</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>الحجوزات المكتملة</StatLabel>
                <StatNumber color="purple.500">{stats.completed}</StatNumber>
                <StatHelpText>تم إنهاؤها</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">البحث عن العمال</Heading>
                <Text color="gray.600">
                  ابحث عن العمال المتاحين لحجز الخدمات
                </Text>
                <Button as={RouterLink} to="/" colorScheme="brand" size="lg">
                  البحث عن العمال
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">حجوزاتي</Heading>
                <Text color="gray.600">
                  إدارة جميع حجوزاتك
                </Text>
                <Button as={RouterLink} to="/my-bookings" colorScheme="green" size="lg">
                  عرض الحجوزات
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">الحجوزات الأخيرة</Heading>
                  <Button as={RouterLink} to="/my-bookings" variant="outline" size="sm">
                    عرض الكل
                  </Button>
                </HStack>
                
                <VStack spacing={3} align="stretch">
                  {recentBookings.map((booking) => (
                    <HStack key={booking.id} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{booking.serviceType}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {new Date(booking.date).toLocaleDateString('en-GB')} - {booking.time}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Badge colorScheme={
                          booking.status === 'pending' ? 'yellow' :
                          booking.status === 'accepted' ? 'green' :
                          booking.status === 'completed' ? 'blue' : 'red'
                        }>
                          {booking.status === 'pending' ? 'معلق' :
                           booking.status === 'accepted' ? 'مقبول' :
                           booking.status === 'completed' ? 'مكتمل' : 'ملغي'}
                        </Badge>
                        <Text fontSize="sm" color="brand.500" fontWeight="bold">
                          {booking.totalPrice} دينار عراقي
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        {recentBookings.length === 0 && (
          <Alert status="info">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">لا توجد حجوزات بعد</Text>
              <Text fontSize="sm">
                ابدأ بالبحث عن العمال وحجز الخدمات
              </Text>
              <Button as={RouterLink} to="/" colorScheme="brand" size="sm">
                البحث عن العمال
              </Button>
            </VStack>
          </Alert>
        )}

        {/* Available Workers */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">العمال المتاحين</Heading>
                <Text color="gray.600" fontSize="sm">
                  {availableWorkers.length} عامل متاح
                </Text>
              </HStack>
              
              {workersLoading ? (
                <Flex justify="center" align="center" h="100px">
                  <Spinner color="brand.500" />
                </Flex>
              ) : availableWorkers.length > 0 ? (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
                  {availableWorkers.slice(0, 6).map((worker) => (
                    <Card key={worker.uid} overflow="hidden" shadow="sm" _hover={{ shadow: 'md' }}>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack>
                            <Text fontWeight="bold" fontSize="sm">{worker.name}</Text>
                            <Badge colorScheme="green" size="sm">متاح</Badge>
                          </HStack>
                          <Text fontSize="xs" color="gray.600" noOfLines={2}>
                            {worker.bio || 'لا توجد نبذة شخصية'}
                          </Text>
                          <HStack wrap="wrap" spacing={1}>
                            {worker.services.slice(0, 2).map((service) => (
                              <Badge key={service} size="xs" colorScheme="brand" variant="subtle">
                                {service}
                              </Badge>
                            ))}
                            {worker.services.length > 2 && (
                              <Text fontSize="xs" color="gray.500">
                                +{worker.services.length - 2} أخرى
                              </Text>
                            )}
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="bold" color="brand.500">
                              {worker.hourlyRate} دينار عراقي/ساعة
                            </Text>
                            <Button 
                              as={RouterLink} 
                              to={`/worker/${worker.uid}`} 
                              size="xs" 
                              colorScheme="brand"
                              onClick={() => console.log('Navigating to worker:', worker.uid, worker.name)}
                            >
                              عرض التفاصيل
                            </Button>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              ) : (
                <Alert status="info">
                  <AlertIcon />
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm">لا يوجد عمال متاحين حالياً</Text>
                    <Text fontSize="xs" color="gray.500">
                      تحقق من أن العمال مسجلون ومتاحون في النظام
                    </Text>
                  </VStack>
                </Alert>
              )}
              
                  {availableWorkers.length > 6 && (
                    <Button as={RouterLink} to="/" variant="outline" size="sm">
                      عرض جميع العمال
                    </Button>
                  )}
                  
                  {availableWorkers.length === 0 && !workersLoading && (
                    <Button as={RouterLink} to="/register" colorScheme="brand" size="sm">
                      سجل كعامل
                    </Button>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* All Available Services */}
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Heading size="md">جميع الخدمات المتاحة</Heading>
                      <Text fontSize="sm" color="gray.600">
                        اكتشف جميع الخدمات التي يقدمها العمال المسجلون
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={0}>
                      <Text color="gray.600" fontSize="sm">
                        {allServices.length} خدمة مختلفة
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        من {availableWorkers.length} عامل متاح
                      </Text>
                    </VStack>
                  </HStack>
                  
                  {servicesLoading ? (
                    <Flex justify="center" align="center" h="100px">
                      <Spinner color="brand.500" />
                    </Flex>
                  ) : allServices.length > 0 ? (
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
                      {allServices.map((service, index) => (
                        <Card key={index} overflow="hidden" shadow="sm" _hover={{ shadow: 'md' }}>
                          <CardBody>
                            <VStack align="stretch" spacing={2}>
                              <Text fontWeight="bold" fontSize="sm" textAlign="center">
                                {service}
                              </Text>
                              <Text fontSize="xs" color="gray.600" textAlign="center">
                                {serviceStats[service] || 0} عامل متاح
                              </Text>
                              {serviceStats[service] > 0 ? (
                                <Badge colorScheme="green" size="sm">
                                  متاح
                                </Badge>
                              ) : (
                                <Badge colorScheme="gray" size="sm">
                                  غير متاح
                                </Badge>
                              )}
                              <Button 
                                as={RouterLink} 
                                to={`/?service=${encodeURIComponent(service)}`} 
                                size="xs" 
                                colorScheme="brand"
                                variant="outline"
                                isDisabled={!serviceStats[service] || serviceStats[service] === 0}
                                _disabled={{
                                  opacity: 0.4,
                                  cursor: 'not-allowed'
                                }}
                              >
                                {serviceStats[service] > 0 ? 'البحث عن العمال' : 'غير متاح'}
                              </Button>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </Grid>
                  ) : (
                    <Alert status="info">
                      <AlertIcon />
                      <Text fontSize="sm">لا توجد خدمات متاحة حالياً</Text>
                    </Alert>
                  )}
                  
                  {allServices.length > 0 && (
                    <VStack spacing={3}>
                      <HStack spacing={2} justify="center">
                        <Button as={RouterLink} to="/" variant="outline" size="sm">
                          عرض جميع العمال والخدمات
                        </Button>
                        <Text fontSize="xs" color="gray.500">
                          {allServices.length} خدمة مختلفة متاحة
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        💡 انقر على أي خدمة للبحث عن العمال المتخصصين فيها
                      </Text>
                      <Text fontSize="xs" color="gray.400" textAlign="center">
                        🔍 الخدمات مرتبة أبجدياً لسهولة البحث
                      </Text>
                      <Text fontSize="xs" color="gray.400" textAlign="center">
                        ⚠️ تأكد من أن العمال مسجلون في النظام لعرض الخدمات
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      );
    };

    export default UserDashboard;
