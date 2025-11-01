import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Image,
  Button,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  Avatar,
  Flex,
  Icon
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { getWorker, getWorkerReviews, Worker, Review } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const WorkerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userData } = useAuth();

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!id) {
        setError('معرف العامل غير صحيح');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching worker data for ID:', id);
        
        // Try to fetch worker data first
        const workerData = await getWorker(id);
        console.log('Worker data received:', workerData);
        
        if (!workerData) {
          setError('العامل غير موجود في قاعدة البيانات');
          setLoading(false);
          return;
        }
        
        // Then fetch reviews (this won't fail the whole operation)
        let reviewsData: Review[] = [];
        try {
          reviewsData = await getWorkerReviews(id);
          console.log('Reviews data received:', reviewsData);
        } catch (reviewError) {
          console.warn('Error fetching reviews (non-critical):', reviewError);
          // Continue without reviews
        }

        setWorker(workerData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching worker data:', error);
        console.error('Worker ID:', id);
        console.error('Error details:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('permission')) {
            setError('لا توجد صلاحية للوصول إلى بيانات العامل');
          } else if (error.message.includes('not-found')) {
            setError('العامل غير موجود');
          } else if (error.message.includes('index')) {
            setError('يجب إنشاء فهرس في قاعدة البيانات للاستعلامات');
          } else if (error.message.includes('network')) {
            setError('خطأ في الاتصال بالإنترنت');
          } else if (error.message.includes('quota')) {
            setError('تم تجاوز حد الاستعلامات، جرب مرة أخرى لاحقاً');
          } else if (error.message.includes('invalid-argument')) {
            setError('معرف العامل غير صحيح');
          } else {
            setError(`حدث خطأ في تحميل بيانات العامل: ${error.message}`);
          }
        } else {
          setError('حدث خطأ في تحميل بيانات العامل');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [id]);

  if (loading) {
    return (
      <Container maxW="1200px" py={8}>
        <Flex justify="center" align="center" h="400px">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Container>
    );
  }

  if (error || !worker) {
    return (
      <Container maxW="1200px" py={8}>
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">{error || 'العامل غير موجود'}</Text>
              <Text fontSize="sm" color="gray.600">
                تحقق من معرف العامل أو جرب البحث مرة أخرى
              </Text>
              {error.includes('index') && (
                <Text fontSize="xs" color="red.500">
                  💡 يجب إنشاء فهرس في Firebase Console للاستعلامات
                </Text>
              )}
              {error.includes('permission') && (
                <Text fontSize="xs" color="red.500">
                  💡 تحقق من قواعد الأمان في Firebase
                </Text>
              )}
            </VStack>
          </Alert>
          <HStack spacing={4}>
            <Button as={RouterLink} to="/" colorScheme="brand">
              العودة إلى الصفحة الرئيسية
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              إعادة المحاولة
            </Button>
            {error.includes('index') && (
              <Button as={RouterLink} to="/admin" variant="outline" colorScheme="orange">
                لوحة الإدارة
              </Button>
            )}
          </HStack>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="1200px" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        {/* Main Content */}
        <VStack spacing={6} align="stretch">
          {/* Worker Info */}
          <Card>
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: '200px 1fr' }} gap={6}>
                <Image
                  src={worker.images[0] || '/placeholder-worker.jpg'}
                  alt={worker.name}
                  borderRadius="lg"
                  objectFit="cover"
                  h="200px"
                />
                <VStack align="start" spacing={4}>
                  <Heading size="lg">{worker.name}</Heading>
                  <Text color="gray.600">{worker.bio}</Text>
                  
                  <HStack>
                    <HStack>
                      <StarIcon color="yellow.400" />
                      <Text fontWeight="bold">{worker.rating.toFixed(1)}</Text>
                    </HStack>
                    <Text color="gray.500">({worker.reviewsCount} تقييم)</Text>
                  </HStack>

                  <HStack wrap="wrap">
                    {worker.services.map((service) => (
                      <Badge key={service} colorScheme="brand" variant="subtle">
                        {service}
                      </Badge>
                    ))}
                  </HStack>

                  <Text fontSize="xl" fontWeight="bold" color="brand.500">
                    {worker.hourlyRate} دينار عراقي/ساعة
                  </Text>
                </VStack>
              </Grid>
            </CardBody>
          </Card>

          {/* Services */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>الخدمات المتاحة</Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                {worker.services.map((service) => (
                  <Box key={service} p={3} bg="gray.50" borderRadius="md">
                    <Text fontWeight="medium">{service}</Text>
                  </Box>
                ))}
              </Grid>
            </CardBody>
          </Card>

          {/* Reviews */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>التقييمات والمراجعات</Heading>
              {reviews.length === 0 ? (
                <Text color="gray.500">لا توجد تقييمات بعد</Text>
              ) : (
                <VStack spacing={4} align="stretch">
                  {reviews.map((review) => (
                    <Box key={review.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <Avatar size="sm" name={review.userId} />
                          <Text fontWeight="medium">مستخدم</Text>
                        </HStack>
                        <HStack>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              color={i < review.rating ? 'yellow.400' : 'gray.300'}
                            />
                          ))}
                        </HStack>
                      </HStack>
                      <Text>{review.comment}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(review.createdAt).toLocaleDateString('en-GB')}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Card>
        </VStack>

        {/* Sidebar */}
        <VStack spacing={6} align="stretch">
          {/* Booking Card */}
          <Card>
            <CardBody>
              <VStack spacing={4}>
                <Heading size="md">احجز هذا العامل</Heading>
                <Text textAlign="center" color="gray.600">
                  {worker.availability ? 'متاح للحجز' : 'غير متاح حالياً'}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                  {worker.hourlyRate} دينار عراقي/ساعة
                </Text>
                {userData?.role === 'user' ? (
                  <Button
                    as={RouterLink}
                    to={`/booking/${worker.uid}`}
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isDisabled={!worker.availability}
                  >
                    احجز الآن
                  </Button>
                ) : (
                  <Button
                    as={RouterLink}
                    to="/login"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                  >
                    سجل الدخول للحجز
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardBody>
              <VStack spacing={3} align="stretch">
                <Heading size="sm">معلومات الاتصال</Heading>
                <HStack>
                  <Text fontSize="sm" color="gray.600">الموقع:</Text>
                  <Text fontSize="sm">{worker.location}</Text>
                </HStack>
                <HStack>
                  <Text fontSize="sm" color="gray.600">الحالة:</Text>
                  <Badge colorScheme={worker.availability ? 'green' : 'red'}>
                    {worker.availability ? 'متاح' : 'غير متاح'}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Container>
  );
};

export default WorkerDetails;
