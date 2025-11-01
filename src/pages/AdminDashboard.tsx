import React, { useState, useEffect } from 'react';
import {
  Container,
  Heading,
  VStack,
  Card,
  CardBody,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import UserManagement from '../components/admin/UserManagement';
import WorkerManagement from '../components/admin/WorkerManagement';
import BookingManagement from '../components/admin/BookingManagement';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching admin dashboard stats...');
        
        // Fetch users count
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnapshot.size;
        console.log('Users fetched:', totalUsers);
        
        // Fetch workers count
        const workersSnapshot = await getDocs(collection(db, 'workers'));
        const totalWorkers = workersSnapshot.size;
        console.log('Workers fetched:', totalWorkers);
        
        // Fetch bookings count
        const bookingsSnapshot = await getDocs(collection(db, 'bookings'));
        const totalBookings = bookingsSnapshot.size;
        console.log('Bookings fetched:', totalBookings);
        
        // Calculate revenue
        let totalRevenue = 0;
        bookingsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === 'completed') {
            totalRevenue += data.totalPrice || 0;
          }
        });

        console.log('Stats calculated:', { totalUsers, totalWorkers, totalBookings, totalRevenue });

        setStats({
          totalUsers,
          totalWorkers,
          totalBookings,
          totalRevenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default values on error
        setStats({
          totalUsers: 0,
          totalWorkers: 0,
          totalBookings: 0,
          totalRevenue: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">لوحة التحكم الإدارية</Heading>
        
        <Text color="gray.600" fontSize="sm">
          إدارة شاملة للمنصة: المستخدمين، العمال، الحجوزات، والإحصائيات
        </Text>
        
        
        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي المستخدمين</StatLabel>
                <StatNumber color="blue.500">{stats.totalUsers}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي العمال</StatLabel>
                <StatNumber color="green.500">{stats.totalWorkers}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي الحجوزات</StatLabel>
                <StatNumber color="purple.500">{stats.totalBookings}</StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>إجمالي الإيرادات</StatLabel>
                <StatNumber color="brand.500">{stats.totalRevenue} دينار عراقي</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Management Tabs */}
        <Tabs>
          <TabList>
            <Tab>إدارة المستخدمين</Tab>
            <Tab>إدارة العمال</Tab>
            <Tab>إدارة الحجوزات</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <UserManagement />
            </TabPanel>
            <TabPanel px={0}>
              <WorkerManagement />
            </TabPanel>
            <TabPanel px={0}>
              <BookingManagement />
            </TabPanel>
          </TabPanels>
        </Tabs>
        
      </VStack>
    </Container>
  );
};

export default AdminDashboard;
