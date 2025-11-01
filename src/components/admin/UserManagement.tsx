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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Alert,
  AlertIcon,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { UserData } from '../../firebase/auth';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        console.log('Fetching users for admin...');
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          ...doc.data(),
          uid: doc.id
        } as UserData));
        console.log('Users fetched:', usersData.length);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('حدث خطأ في تحميل المستخدمين');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'user' | 'worker' | 'admin') => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(user => 
        user.uid === userId ? { ...user, role: newRole } : user
      ));
      toast.success('تم تحديث دور المستخدم');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('حدث خطأ في تحديث دور المستخدم');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.uid !== userId));
      toast.success('تم حذف المستخدم');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('حدث خطأ في حذف المستخدم');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'worker': return 'blue';
      default: return 'green';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مسؤول';
      case 'worker': return 'عامل';
      default: return 'مستخدم';
    }
  };

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
          <Text fontSize="2xl" fontWeight="bold">إدارة المستخدمين</Text>
          <Text color="gray.600">إجمالي المستخدمين: {users.length}</Text>
        </HStack>
        

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>المستخدم</Th>
              <Th>البريد الإلكتروني</Th>
              <Th>الهاتف</Th>
              <Th>الدور</Th>
              <Th>تاريخ الإنشاء</Th>
              <Th>الإجراءات</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.uid}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={user.name} />
                    <Text fontWeight="medium">{user.name}</Text>
                  </HStack>
                </Td>
                <Td>{user.email}</Td>
                <Td>{user.phone}</Td>
                <Td>
                  <Badge colorScheme={getRoleColor(user.role)}>
                    {getRoleText(user.role)}
                  </Badge>
                </Td>
                <Td>
                  {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Menu>
                      <MenuButton as={Button} size="sm" variant="outline">
                        تغيير الدور <ChevronDownIcon />
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleRoleChange(user.uid, 'user')}>
                          مستخدم
                        </MenuItem>
                        <MenuItem onClick={() => handleRoleChange(user.uid, 'worker')}>
                          عامل
                        </MenuItem>
                        <MenuItem onClick={() => handleRoleChange(user.uid, 'admin')}>
                          مسؤول
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    
                    <IconButton
                      aria-label="حذف المستخدم"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.uid)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {users.length === 0 && (
          <Alert status="info">
            <AlertIcon />
            <Text>لا توجد مستخدمين</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default UserManagement;
