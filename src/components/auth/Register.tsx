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
  Select,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'worker' | 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone,
        formData.role
      );
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'حدث خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={8}>
      <Card>
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center">
              إنشاء حساب جديد
            </Heading>
            
            
            {error && (
              <Alert status="error">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">{error}</Text>
                  {error.includes('email-already-in-use') && (
                    <Text fontSize="sm">
                      هذا البريد مستخدم بالفعل، جرب بريد آخر أو سجل دخول
                    </Text>
                  )}
                  {error.includes('weak-password') && (
                    <Text fontSize="sm">
                      كلمة المرور يجب أن تكون 6 أحرف على الأقل
                    </Text>
                  )}
                </VStack>
              </Alert>
            )}

            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing={4}>
                
                <FormControl isRequired>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسمك الكامل"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="أدخل رقم هاتفك"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>نوع الحساب</FormLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                <option value="user">User (مستخدم)</option>
                <option value="worker">Worker (عامل)</option>
                <option value="admin">Admin (مسؤول)</option>
                  </Select>
                  
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>كلمة المرور</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="أدخل كلمة المرور"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="أعد إدخال كلمة المرور"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        variant="ghost"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  loadingText="جاري إنشاء الحساب..."
                >
                  إنشاء الحساب
                </Button>
              </VStack>
            </Box>

            <Text textAlign="center">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" style={{ color: '#0073e6', fontWeight: 'bold' }}>
                تسجيل الدخول
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Register;


