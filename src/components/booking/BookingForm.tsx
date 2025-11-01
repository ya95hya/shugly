import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  VStack,
  HStack,
  Grid,
  Text,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Worker } from '../../firebase/firestore';

interface BookingFormProps {
  worker: Worker;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

interface BookingFormData {
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ worker, onSubmit, loading = false }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>();
  const watchedDuration = watch('duration', 1);

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
    <Box>
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

          <Alert status="info" size="sm">
            <AlertIcon />
            <Text fontSize="sm">
              السعر الإجمالي: <Text as="span" fontWeight="bold">{totalPrice} دينار عراقي</Text>
            </Text>
          </Alert>

          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            w="full"
            isLoading={loading}
            loadingText="جاري إرسال الطلب..."
          >
            إرسال طلب الحجز
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default BookingForm;


