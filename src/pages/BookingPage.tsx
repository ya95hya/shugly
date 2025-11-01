import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  HStack,
  Grid,
  Alert,
  AlertIcon,
  Spinner,
  Divider,
  Flex
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { getWorker, createBooking, Worker } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface BookingFormData {
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

const BookingPage: React.FC = () => {
  const { workerId } = useParams<{ workerId: string }>();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { userData } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();
  const watchedDuration = watch('duration', 1);

  useEffect(() => {
    const fetchWorker = async () => {
      if (!workerId) return;

      try {
        setLoading(true);
        const workerData = await getWorker(workerId);
        if (!workerData) {
          console.log('Worker not found for ID:', workerId);
          toast.error('العامل غير موجود');
          navigate('/');
          return;
        }
        setWorker(workerData);
        console.log('Worker loaded successfully:', workerData);
      } catch (error) {
        console.error('Error fetching worker:', error);
        console.error('Worker ID:', workerId);
        console.error('Error details:', error);
        toast.error('حدث خطأ في تحميل بيانات العامل');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId, navigate]);

  const onSubmit = async (data: BookingFormData) => {
    if (!worker || !userData) return;

    try {
      setSubmitting(true);
      const totalPrice = worker.hourlyRate * data.duration;

      await createBooking({
        userId: userData.uid,
        workerId: worker.uid,
        serviceType: data.serviceType,
        date: data.date,
        time: data.time,
        duration: data.duration,
        totalPrice,
        status: 'pending',
        adminApproved: false,
        notes: data.notes
      });

      toast.success('تم إرسال طلب الحجز بنجاح. سيتم مراجعته من قبل الإدارة قريباً');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('حدث خطأ في إرسال طلب الحجز');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxW="800px" py={8}>
        <Flex justify="center" align="center" h="400px">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Container>
    );
  }

  if (!worker) {
    return (
      <Container maxW="800px" py={8}>
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">العامل غير موجود</Text>
              <Text fontSize="sm" color="gray.600">
                تحقق من معرف العامل أو جرب البحث مرة أخرى
              </Text>
            </VStack>
          </Alert>
          <Button onClick={() => navigate('/')} colorScheme="brand">
            العودة إلى الصفحة الرئيسية
          </Button>
        </VStack>
      </Container>
    );
  }

  const totalPrice = worker.hourlyRate * watchedDuration;

  // Default services if worker has no services defined
  const defaultServices = [
    'تنظيف المنزل',
    'طبخ',
    'غسيل الملابس',
    'رعاية الأطفال',
    'رعاية المسنين',
    'تنظيف السجاد',
    'تنظيف النوافذ',
    'تنظيم المنزل'
  ];

  let availableServices = worker.services && worker.services.length > 0 
    ? [...worker.services] 
    : [...defaultServices];

  // Ensure we always have at least one service
  if (availableServices.length === 0) {
    availableServices = ['خدمة عامة'];
  }

  console.log('Worker services:', worker.services);
  console.log('Available services:', availableServices);
  console.log('Worker data:', worker);

  return (
    <Container maxW="800px" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" textAlign="center">
          حجز {worker.name}
        </Heading>
        <Text textAlign="center" color="gray.600" fontSize="sm">
          {availableServices.length} خدمة متاحة • {worker.hourlyRate} دينار عراقي/ساعة
        </Text>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Booking Form */}
          <Card>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>نوع الخدمة</FormLabel>
                    <Select {...register('serviceType', { required: 'يرجى اختيار نوع الخدمة' })}>
                      <option value="">اختر نوع الخدمة</option>
                      {availableServices.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </Select>
                    {errors.serviceType && (
                      <Text color="red.500" fontSize="sm">
                        {errors.serviceType.message}
                      </Text>
                    )}
                    {worker.services && worker.services.length === 0 && (
                      <Alert status="info" mt={2}>
                        <AlertIcon />
                        <Text fontSize="sm">
                          العامل لم يحدد خدمات معينة، يمكنك اختيار من القائمة العامة
                        </Text>
                      </Alert>
                    )}
                    {!worker.services && (
                      <Alert status="warning" mt={2}>
                        <AlertIcon />
                        <Text fontSize="sm">
                          ⚠️ بيانات العامل غير مكتملة، يرجى تحديث ملفه الشخصي
                        </Text>
                      </Alert>
                    )}
                    {availableServices.length > 0 && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {availableServices.length} خدمة متاحة
                      </Text>
                    )}
                    {worker.services && worker.services.length > 0 && (
                      <Text fontSize="xs" color="green.500" mt={1}>
                        ✅ خدمات محددة من العامل
                      </Text>
                    )}
                  </FormControl>

                  <Grid templateColumns="1fr 1fr" gap={4} w="full">
                    <FormControl isRequired>
                      <FormLabel>التاريخ</FormLabel>
                      <Input
                        type="date"
                        {...register('date', { required: 'يرجى اختيار التاريخ' })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.date && (
                        <Text color="red.500" fontSize="sm">
                          {errors.date.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>الوقت</FormLabel>
                      <Select {...register('time', { required: 'يرجى اختيار الوقت' })}>
                        <option value="">اختر الوقت</option>
                        <option value="08:00">8:00 صباحاً</option>
                        <option value="09:00">9:00 صباحاً</option>
                        <option value="10:00">10:00 صباحاً</option>
                        <option value="11:00">11:00 صباحاً</option>
                        <option value="12:00">12:00 ظهراً</option>
                        <option value="13:00">1:00 ظهراً</option>
                        <option value="14:00">2:00 ظهراً</option>
                        <option value="15:00">3:00 عصراً</option>
                        <option value="16:00">4:00 عصراً</option>
                        <option value="17:00">5:00 مساءً</option>
                        <option value="18:00">6:00 مساءً</option>
                        <option value="19:00">7:00 مساءً</option>
                        <option value="20:00">8:00 مساءً</option>
                      </Select>
                      {errors.time && (
                        <Text color="red.500" fontSize="sm">
                          {errors.time.message}
                        </Text>
                      )}
                    </FormControl>
                  </Grid>

                  <FormControl isRequired>
                    <FormLabel>المدة (بالساعات)</FormLabel>
                    <Select {...register('duration', { required: 'يرجى اختيار المدة' })}>
                      <option value="">اختر المدة</option>
                      <option value={1}>ساعة واحدة</option>
                      <option value={2}>ساعتان</option>
                      <option value={3}>3 ساعات</option>
                      <option value={4}>4 ساعات</option>
                      <option value={5}>5 ساعات</option>
                      <option value={6}>6 ساعات</option>
                      <option value={8}>8 ساعات</option>
                    </Select>
                    {errors.duration && (
                      <Text color="red.500" fontSize="sm">
                        {errors.duration.message}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                    <Textarea
                      {...register('notes')}
                      placeholder="أي ملاحظات أو متطلبات خاصة..."
                      rows={3}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isLoading={submitting}
                    loadingText="جاري إرسال الطلب..."
                  >
                    إرسال طلب الحجز
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Booking Summary */}
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">ملخص الحجز</Heading>
                
                <Divider />
                
                <HStack justify="space-between">
                  <Text>السعر للساعة:</Text>
                  <Text fontWeight="bold">{worker.hourlyRate} دينار عراقي</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text>المدة:</Text>
                  <Text fontWeight="bold">{watchedDuration} ساعة</Text>
                </HStack>
                
                <Divider />
                
                <HStack justify="space-between" fontSize="lg">
                  <Text fontWeight="bold">المجموع:</Text>
                  <Text fontWeight="bold" color="brand.500">
                    {totalPrice} دينار عراقي
                  </Text>
                </HStack>

                <Alert status="info" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    سيتم تأكيد الحجز من قبل العامل خلال 24 ساعة
                  </Text>
                </Alert>
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Container>
  );
};

export default BookingPage;
