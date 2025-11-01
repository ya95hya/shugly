import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  Input,
  Select,
  VStack,
  HStack,
  Button,
  InputGroup,
  InputLeftElement,
  Badge,
  Image,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getWorkers, Worker } from '../firebase/firestore';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const { userData } = useAuth();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const workersData = await getWorkers();
        setWorkers(workersData);
        setFilteredWorkers(workersData);
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    let filtered = workers;

    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (serviceFilter) {
      filtered = filtered.filter(worker =>
        worker.services.includes(serviceFilter)
      );
    }

    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(worker => worker.rating >= minRating);
    }

    setFilteredWorkers(filtered);
  }, [workers, searchTerm, serviceFilter, ratingFilter]);

  const services = [
    'تنظيف المنزل',
    'طبخ',
    'غسيل الملابس',
    'رعاية الأطفال',
    'رعاية المسنين',
    'تنظيف السجاد',
    'تنظيف النوافذ',
    'تنظيم المنزل'
  ];

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
    <Box bg="neutral.50" minH="100vh">
      {/* Hero Section */}
      <Box 
        bg="linear-gradient(135deg, brand.50 0%, brand.100 50%, neutral.100 100%)"
        py={20}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23955C33" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}
      >
        <Container maxW="1200px" position="relative" zIndex={1}>
          <VStack spacing={10} textAlign="center">
            <VStack spacing={4}>
              <Heading 
                size="2xl" 
                color="brand.500"
                fontFamily="Avenir Next Arabic, Cairo, sans-serif"
                fontWeight="bold"
                lineHeight="1.2"
              >
                {userData ? `مرحباً ${userData.name}` : 'مرحباً بك في شغلي العراق'}
              </Heading>
              <Text 
                fontSize="xl" 
                color="secondary.700" 
                maxW="700px"
                fontFamily="Cairo, sans-serif"
                fontWeight="medium"
                lineHeight="1.6"
              >
                {userData ? 
                  (userData.role === 'worker' ? 
                    'إدارة خدماتك وحجوزاتك بكفاءة عالية' : 
                    'ابحث عن العامل المناسب لاحتياجاتك التقنية') :
                  'منصة شغلي العراق تربط بين أصحاب الخدمات والعمال المهرة لتقديم أفضل الخدمات المنزلية'
                }
              </Text>
            </VStack>
            {!userData ? (
              <VStack spacing={6}>
                <HStack spacing={4}>
                  <Button 
                    as={RouterLink} 
                    to="/register" 
                    colorScheme="brand" 
                    size="lg"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="bold"
                    px={8}
                    py={6}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s"
                  >
                    ابدأ الآن
                  </Button>
                  <Button 
                    as={RouterLink} 
                    to="/login" 
                    variant="outline" 
                    size="lg"
                    borderColor="brand.500"
                    color="brand.500"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="semibold"
                    px={8}
                    py={6}
                    _hover={{
                      bg: 'brand.50',
                      borderColor: 'brand.600',
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.3s"
                  >
                    تسجيل الدخول
                  </Button>
                </HStack>
              </VStack>
            ) : (
              <HStack spacing={4}>
                {userData.role === 'worker' ? (
                  <>
                    <Button as={RouterLink} to="/worker-dashboard" colorScheme="brand" size="lg">
                      لوحة التحكم
                    </Button>
                    <Button as={RouterLink} to="/worker-services" variant="outline" size="lg">
                      إدارة الخدمات
                    </Button>
                  </>
                ) : userData.role === 'admin' ? (
                  <Button as={RouterLink} to="/admin" colorScheme="brand" size="lg">
                    لوحة الإدارة
                  </Button>
                ) : (
                  <>
                    <Button as={RouterLink} to="/user-dashboard" colorScheme="brand" size="lg">
                      لوحة التحكم
                    </Button>
                    <Button as={RouterLink} to="/my-bookings" variant="outline" size="lg">
                      حجوزاتي
                    </Button>
                  </>
                )}
              </HStack>
            )}
          </VStack>
        </Container>
      </Box>

      {/* Search and Filters - Only show for users and guests */}
      {(!userData || userData.role === 'user') && (
        <Container maxW="1200px" py={8}>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              ابحث عن العامل المناسب
            </Heading>

          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={4} w="full">
            <InputGroup>
              <InputLeftElement>
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="ابحث بالاسم أو نوع الخدمة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              placeholder="جميع الخدمات"
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </Select>

            <Select
              placeholder="جميع التقييمات"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <option value="4">4 نجوم وأكثر</option>
              <option value="3">3 نجوم وأكثر</option>
              <option value="2">2 نجوم وأكثر</option>
            </Select>
          </Grid>

          {/* Workers Grid */}
          {filteredWorkers.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              لا توجد نتائج مطابقة لبحثك
            </Alert>
          ) : (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} w="full">
              {filteredWorkers.map((worker) => (
                <Card 
                  key={worker.uid} 
                  overflow="hidden" 
                  shadow="lg" 
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="neutral.200"
                  bg="white"
                  _hover={{ 
                    shadow: 'xl',
                    transform: 'translateY(-4px)',
                    borderColor: 'brand.300'
                  }}
                  transition="all 0.3s"
                >
                  <Box position="relative">
                    <Image
                      src={worker.images[0] || '/placeholder-worker.jpg'}
                      alt={worker.name}
                      h="220px"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme={worker.availability ? 'green' : 'red'}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontWeight="bold"
                      fontSize="xs"
                    >
                      {worker.availability ? 'متاح' : 'غير متاح'}
                    </Badge>
                  </Box>
                  <CardBody p={6}>
                    <VStack align="start" spacing={4}>
                      <Heading 
                        size="md" 
                        color="secondary.800"
                        fontFamily="Avenir Next Arabic, Cairo, sans-serif"
                        fontWeight="bold"
                      >
                        {worker.name}
                      </Heading>
                      <Text 
                        color="secondary.600" 
                        fontSize="sm"
                        fontFamily="Cairo, sans-serif"
                        lineHeight="1.6"
                        noOfLines={3}
                      >
                        {worker.bio}
                      </Text>
                      <HStack spacing={2}>
                        <HStack spacing={1}>
                          <StarIcon color="brand.400" />
                          <Text 
                            fontSize="sm" 
                            fontWeight="bold"
                            color="brand.600"
                            fontFamily="Cairo, sans-serif"
                          >
                            {worker.rating.toFixed(1)}
                          </Text>
                        </HStack>
                        <Text 
                          fontSize="sm" 
                          color="secondary.500"
                          fontFamily="Cairo, sans-serif"
                        >
                          ({worker.reviewsCount} تقييم)
                        </Text>
                      </HStack>
                      <HStack wrap="wrap" spacing={2}>
                        {worker.services.slice(0, 3).map((service) => (
                          <Badge 
                            key={service} 
                            colorScheme="brand" 
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="medium"
                          >
                            {service}
                          </Badge>
                        ))}
                        {worker.services.length > 3 && (
                          <Badge 
                            colorScheme="secondary" 
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            fontWeight="medium"
                          >
                            +{worker.services.length - 3} أخرى
                          </Badge>
                        )}
                      </HStack>
                      <Text 
                        fontWeight="bold" 
                        color="brand.500"
                        fontSize="lg"
                        fontFamily="Cairo, sans-serif"
                      >
                        {worker.hourlyRate} دينار عراقي/ساعة
                      </Text>
                    </VStack>
                  </CardBody>
                  <CardFooter p={6} pt={0}>
                    <Button
                      as={RouterLink}
                      to={`/worker/${worker.uid}`}
                      colorScheme="brand"
                      w="full"
                      size="lg"
                      fontFamily="Cairo, sans-serif"
                      fontWeight="bold"
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'lg'
                      }}
                      transition="all 0.2s"
                    >
                      عرض التفاصيل
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </Grid>
          )}
        </VStack>
      </Container>
      )}

      {/* Special section for workers */}
      {userData && userData.role === 'worker' && (
        <Container maxW="1200px" py={8}>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              مرحباً بك في لوحة التحكم
            </Heading>
            <Text textAlign="center" color="gray.600" maxW="600px">
              يمكنك إدارة خدماتك وحجوزاتك من هنا
            </Text>
            <HStack spacing={4}>
              <Button as={RouterLink} to="/worker-dashboard" colorScheme="brand" size="lg">
                لوحة التحكم
              </Button>
              <Button as={RouterLink} to="/worker-services" variant="outline" size="lg">
                إدارة الخدمات
              </Button>
            </HStack>
          </VStack>
        </Container>
      )}

      {/* Special section for admins */}
      {userData && userData.role === 'admin' && (
        <Container maxW="1200px" py={8}>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              لوحة الإدارة
            </Heading>
            <Text textAlign="center" color="gray.600" maxW="600px">
              إدارة المنصة والمستخدمين والعمال
            </Text>
            <Button as={RouterLink} to="/admin" colorScheme="brand" size="lg">
              لوحة الإدارة
            </Button>
          </VStack>
        </Container>
      )}
    </Box>
  );
};

export default Home;
