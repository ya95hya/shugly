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
  IconButton,
  Alert,
  AlertIcon,
  Spinner,
  Flex,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Worker } from '../../firebase/firestore';
import toast from 'react-hot-toast';

const WorkerManagement: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        console.log('Fetching workers for admin...');
        const workersSnapshot = await getDocs(collection(db, 'workers'));
        const workersData = workersSnapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id
        } as Worker));
        console.log('Workers fetched:', workersData.length);
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching workers:', error);
        toast.error('حدث خطأ في تحميل العمال');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const handleToggleAvailability = async (workerId: string, currentAvailability: boolean) => {
    try {
      await updateDoc(doc(db, 'workers', workerId), { 
        availability: !currentAvailability 
      });
      setWorkers(workers.map(worker => 
        worker.uid === workerId 
          ? { ...worker, availability: !currentAvailability }
          : worker
      ));
      toast.success('تم تحديث حالة التوفر');
    } catch (error) {
      console.error('Error updating worker availability:', error);
      toast.error('حدث خطأ في تحديث حالة التوفر');
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العامل؟')) return;

    try {
      await deleteDoc(doc(db, 'workers', workerId));
      setWorkers(workers.filter(worker => worker.uid !== workerId));
      toast.success('تم حذف العامل');
    } catch (error) {
      console.error('Error deleting worker:', error);
      toast.error('حدث خطأ في حذف العامل');
    }
  };

  const getStats = () => {
    const totalWorkers = workers.length;
    const availableWorkers = workers.filter(w => w.availability).length;
    const averageRating = workers.length > 0 
      ? workers.reduce((sum, w) => sum + w.rating, 0) / workers.length 
      : 0;
    const totalServices = workers.reduce((sum, w) => sum + w.services.length, 0);

    return {
      totalWorkers,
      availableWorkers,
      averageRating,
      totalServices
    };
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
          <Text fontSize="2xl" fontWeight="bold">إدارة العمال</Text>
          <Text color="gray.600">إجمالي العمال: {workers.length}</Text>
        </HStack>
        

        {/* Stats */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <Stat>
            <StatLabel>إجمالي العمال</StatLabel>
            <StatNumber>{stats.totalWorkers}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>متاحون</StatLabel>
            <StatNumber color="green.500">{stats.availableWorkers}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>متوسط التقييم</StatLabel>
            <StatNumber color="yellow.500">{stats.averageRating.toFixed(1)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>إجمالي الخدمات</StatLabel>
            <StatNumber color="blue.500">{stats.totalServices}</StatNumber>
          </Stat>
        </Grid>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>العامل</Th>
              <Th>الخدمات</Th>
              <Th>التقييم</Th>
              <Th>السعر</Th>
              <Th>الحالة</Th>
              <Th>الإجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {workers.map((worker) => (
              <Tr key={worker.uid}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={worker.name} />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">{worker.name}</Text>
                      <Text fontSize="xs" color="gray.500">{worker.location}</Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    {worker.services.slice(0, 2).map((service) => (
                      <Badge key={service} size="sm" colorScheme="brand" variant="subtle">
                        {service}
                      </Badge>
                    ))}
                    {worker.services.length > 2 && (
                      <Text fontSize="xs" color="gray.500">
                        +{worker.services.length - 2} أخرى
                      </Text>
                    )}
                  </VStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{worker.rating.toFixed(1)}</Text>
                    <Text fontSize="xs" color="gray.500">
                      ({worker.reviewsCount} تقييم)
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Text fontWeight="bold" color="brand.500">
                    {worker.hourlyRate} ريال/ساعة
                  </Text>
                </Td>
                <Td>
                  <Badge colorScheme={worker.availability ? 'green' : 'red'}>
                    {worker.availability ? 'متاح' : 'غير متاح'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme={worker.availability ? 'red' : 'green'}
                      variant="outline"
                      onClick={() => handleToggleAvailability(worker.uid, worker.availability)}
                    >
                      {worker.availability ? 'تعطيل' : 'تفعيل'}
                    </Button>
                    
                    <IconButton
                      aria-label="حذف العامل"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDeleteWorker(worker.uid)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {workers.length === 0 && (
          <Alert status="info">
            <AlertIcon />
            <Text>لا توجد عمال</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default WorkerManagement;
