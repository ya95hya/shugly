import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Container,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'حدث خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      minH="100vh" 
      bg="linear-gradient(135deg, brand.50 0%, brand.100 50%, neutral.100 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <Container maxW="md">
        <Card 
          shadow="2xl" 
          borderRadius="2xl"
          border="1px solid"
          borderColor="neutral.200"
          bg="white"
        >
          <CardBody p={8}>
            <VStack spacing={8}>
              {/* شعار الشركة */}
              <VStack spacing={4}>
                <Box
                  w="80px"
                  h="80px"
                  bg="brand.500"
                  borderRadius="2xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                  fontSize="2xl"
                  fontFamily="Avenir Next Arabic, Cairo, sans-serif"
                  boxShadow="lg"
                >
                  ش
                </Box>
                <VStack spacing={2}>
                  <Heading 
                    size="lg" 
                    textAlign="center" 
                    color="brand.500"
                    fontFamily="Avenir Next Arabic, Cairo, sans-serif"
                    fontWeight="bold"
                  >
                    تسجيل الدخول
                  </Heading>
                  <Text 
                    color="secondary.600" 
                    textAlign="center"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="medium"
                  >
                    مرحباً بك في شعاع العراق
                  </Text>
                </VStack>
              </VStack>
            
            
            {error && (
              <Alert status="error">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">{error}</Text>
                  {error.includes('invalid-credential') && (
                    <Text fontSize="sm">
                      تأكد من تسجيل حساب جديد أولاً، أو استخدم البيانات الصحيحة
                    </Text>
                  )}
                </VStack>
              </Alert>
            )}

            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing={6}>
                
                <FormControl isRequired>
                  <FormLabel 
                    color="secondary.700"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="semibold"
                    fontSize="sm"
                  >
                    البريد الإلكتروني
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    borderRadius="lg"
                    borderColor="neutral.300"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
                    }}
                    fontFamily="Cairo, sans-serif"
                    fontSize="md"
                    py={6}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel 
                    color="secondary.700"
                    fontFamily="Cairo, sans-serif"
                    fontWeight="semibold"
                    fontSize="sm"
                  >
                    كلمة المرور
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة المرور"
                      borderRadius="lg"
                      borderColor="neutral.300"
                      _focus={{
                        borderColor: 'brand.500',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)'
                      }}
                      fontFamily="Cairo, sans-serif"
                      fontSize="md"
                      py={6}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        color="secondary.500"
                        _hover={{ color: 'brand.500' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="جاري تسجيل الدخول..."
                  fontFamily="Cairo, sans-serif"
                  fontWeight="bold"
                  py={6}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.2s"
                >
                  تسجيل الدخول
                </Button>
              </VStack>
            </Box>

            <Text 
              textAlign="center"
              color="secondary.600"
              fontFamily="Cairo, sans-serif"
            >
              ليس لديك حساب؟{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#955C33', 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  fontFamily: 'Cairo, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                إنشاء حساب جديد
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
    </Box>
  );
};

export default Login;


