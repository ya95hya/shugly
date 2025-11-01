import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Avatar,
  Button,
  Divider,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { userData, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: ''
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        bio: ''
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      await updateDoc(doc(db, 'users', userData.uid), {
        name: formData.name,
        phone: formData.phone
      });
      
      toast.success('تم حفظ التغييرات بنجاح');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('حدث خطأ في حفظ التغييرات');
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

  if (!userData) {
    return (
      <Container maxW="800px" py={8}>
        <VStack spacing={4}>
          <Alert status="error">
            <AlertIcon />
            لم يتم العثور على بيانات المستخدم. تأكد من تسجيل الدخول بشكل صحيح.
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            colorScheme="brand"
            variant="outline"
          >
            إعادة تحميل الصفحة
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="800px" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">الملف الشخصي</Heading>

        <Card>
          <CardBody>
            <VStack spacing={6}>
              {/* Profile Header */}
              <VStack spacing={4}>
                <Avatar size="xl" name={userData.name} />
                <VStack spacing={1}>
                  <Heading size="md">{userData.name}</Heading>
                  <Text color="gray.600">{userData.email}</Text>
                  <Text color="gray.600">{userData.phone}</Text>
                  <Text color="brand.500" fontSize="sm" fontWeight="bold">
                    {userData.role === 'user' ? 'مستخدم' : 
                     userData.role === 'worker' ? 'عامل' : 
                     userData.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                  </Text>
                </VStack>
              </VStack>

              <Divider />

              {/* Profile Form */}
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4} w="full">
                <FormControl>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isDisabled={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isDisabled={!isEditing}
                  />
                </FormControl>

                <FormControl gridColumn={{ base: '1', md: '1 / -1' }}>
                  <FormLabel>نبذة شخصية</FormLabel>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    isDisabled={!isEditing}
                    rows={3}
                  />
                </FormControl>
              </Grid>

              {/* Action Buttons */}
              <HStack spacing={4}>
                {isEditing ? (
                  <>
                    <Button colorScheme="brand" onClick={handleSave}>
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      إلغاء
                    </Button>
                  </>
                ) : (
                  <Button colorScheme="brand" onClick={() => setIsEditing(true)}>
                    تعديل الملف الشخصي
                  </Button>
                )}
                
                {userData.role === 'worker' && (
                  <Button 
                    as="a" 
                    href="/worker-services" 
                    colorScheme="green" 
                    variant="outline"
                  >
                    إدارة الخدمات
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Profile;
