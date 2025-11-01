import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Heading,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../hooks/useAuth';
import { IRAQI_CITIES } from '../../utils/constants';
import toast from 'react-hot-toast';

interface WorkerData {
  services: string[];
  hourlyRate: number;
  bio: string;
  location: string;
  availability: boolean;
}

const WorkerServicesForm: React.FC = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workerData, setWorkerData] = useState<WorkerData>({
    services: [],
    hourlyRate: 50,
    bio: '',
    location: '',
    availability: true
  });
  const [newService, setNewService] = useState('');

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!userData) return;

      try {
        setLoading(true);
        const workerDoc = await getDoc(doc(db, 'workers', userData.uid));
        if (workerDoc.exists()) {
          const data = workerDoc.data();
          setWorkerData({
            services: data.services || [],
            hourlyRate: data.hourlyRate || 50,
            bio: data.bio || '',
            location: data.location || '',
            availability: data.availability !== false
          });
        } else {
          // إذا لم توجد بيانات العامل، استخدم البيانات الافتراضية
          console.log('No worker data found, using defaults');
          setWorkerData({
            services: [],
            hourlyRate: 50,
            bio: '',
            location: '',
            availability: true
          });
        }
      } catch (error) {
        console.error('Error fetching worker data:', error);
        toast.error('حدث خطأ في تحميل بيانات العامل');
        // استخدم البيانات الافتراضية في حالة الخطأ
        setWorkerData({
          services: [],
          hourlyRate: 50,
          bio: '',
          location: '',
          availability: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [userData]);

  const handleAddService = () => {
    if (newService.trim() && !workerData.services.includes(newService.trim())) {
      setWorkerData({
        ...workerData,
        services: [...workerData.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setWorkerData({
      ...workerData,
      services: workerData.services.filter(service => service !== serviceToRemove)
    });
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      setSaving(true);
      
      // إنشاء أو تحديث بيانات العامل
      const workerRef = doc(db, 'workers', userData.uid);
      const workerDoc = await getDoc(workerRef);
      
      const workerDataToSave = {
        uid: userData.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        services: workerData.services,
        hourlyRate: workerData.hourlyRate,
        bio: workerData.bio,
        location: workerData.location,
        availability: workerData.availability,
        rating: 0,
        reviewsCount: 0,
        images: [],
        updatedAt: new Date()
      };

      if (workerDoc.exists()) {
        await updateDoc(workerRef, workerDataToSave);
      } else {
        await setDoc(workerRef, {
          ...workerDataToSave,
          createdAt: new Date()
        });
      }
      
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error updating worker data:', error);
      toast.error('حدث خطأ في حفظ التغييرات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Text>جاري التحميل...</Text>;
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Heading size="md">إدارة الخدمات والأسعار</Heading>

          {/* الخدمات */}
          <FormControl>
            <FormLabel>الخدمات المتاحة</FormLabel>
            <HStack>
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="أضف خدمة جديدة"
                onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
              />
              <Button
                onClick={handleAddService}
                colorScheme="brand"
                leftIcon={<AddIcon />}
                isDisabled={!newService.trim()}
              >
                إضافة
              </Button>
            </HStack>
            
            {workerData.services.length > 0 && (
              <Box mt={3}>
                <Text fontSize="sm" color="gray.600" mb={2}>الخدمات الحالية:</Text>
                <HStack wrap="wrap" spacing={2}>
                  {workerData.services.map((service) => (
                    <Badge
                      key={service}
                      colorScheme="brand"
                      variant="subtle"
                      p={2}
                      borderRadius="md"
                    >
                      {service}
                      <IconButton
                        aria-label="حذف الخدمة"
                        icon={<DeleteIcon />}
                        size="xs"
                        ml={2}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveService(service)}
                      />
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}
          </FormControl>

          <Divider />

          {/* السعر للساعة */}
          <FormControl>
            <FormLabel>السعر للساعة (بالدينار العراقي)</FormLabel>
            <NumberInput
              value={workerData.hourlyRate}
              onChange={(valueString, valueNumber) =>
                setWorkerData({ ...workerData, hourlyRate: valueNumber })
              }
              min={10}
              max={1000}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* الموقع */}
          <FormControl>
            <FormLabel>الموقع</FormLabel>
            <Select
              value={workerData.location}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWorkerData({ ...workerData, location: e.target.value })}
              placeholder="اختر مدينتك"
            >
              {IRAQI_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* نبذة شخصية */}
          <FormControl>
            <FormLabel>نبذة شخصية</FormLabel>
            <Textarea
              value={workerData.bio}
              onChange={(e) => setWorkerData({ ...workerData, bio: e.target.value })}
              placeholder="اكتب نبذة عن نفسك وخبراتك..."
              rows={3}
            />
          </FormControl>

          {/* حالة التوفر */}
          <FormControl>
            <FormLabel>حالة التوفر</FormLabel>
            <HStack>
              <Button
                colorScheme={workerData.availability ? 'green' : 'gray'}
                variant={workerData.availability ? 'solid' : 'outline'}
                onClick={() => setWorkerData({ ...workerData, availability: true })}
              >
                متاح
              </Button>
              <Button
                colorScheme={!workerData.availability ? 'red' : 'gray'}
                variant={!workerData.availability ? 'solid' : 'outline'}
                onClick={() => setWorkerData({ ...workerData, availability: false })}
              >
                غير متاح
              </Button>
            </HStack>
          </FormControl>

          <Alert status="info" size="sm">
            <AlertIcon />
            <Text fontSize="sm">
              يمكن للمستخدمين رؤية خدماتك وأسعارك في الصفحة الرئيسية
            </Text>
          </Alert>

          <Button
            colorScheme="brand"
            size="lg"
            onClick={handleSave}
            isLoading={saving}
            loadingText="جاري الحفظ..."
          >
            حفظ التغييرات
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default WorkerServicesForm;


