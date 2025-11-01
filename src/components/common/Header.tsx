import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Avatar,
  HStack,
  useColorModeValue,
  Container
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../firebase/auth';

const Header: React.FC = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getNavigationLinks = () => {
    if (!user || !userData) {
      return (
        <HStack spacing={4}>
          <Button as={Link} to="/login" variant="ghost">
            تسجيل الدخول
          </Button>
          <Button as={Link} to="/register" colorScheme="brand">
            إنشاء حساب
          </Button>
        </HStack>
      );
    }

    const baseLinks = [
      { to: '/dashboard', label: 'الرئيسية' },
      { to: '/messages', label: 'الرسائل' },
      { to: '/profile', label: 'الملف الشخصي' }
    ];

    const roleSpecificLinks = {
      user: [
        { to: '/user-dashboard', label: 'لوحة المستخدم' },
        { to: '/my-bookings', label: 'حجوزاتي' }
      ],
      worker: [
        { to: '/worker-dashboard', label: 'لوحة العامل' },
        { to: '/worker-services', label: 'خدماتي' }
      ],
      admin: [
        { to: '/admin', label: 'لوحة الإدارة' }
      ]
    };

    const allLinks = [...baseLinks, ...(roleSpecificLinks[userData.role] || [])];

    return (
      <HStack spacing={4}>
        {allLinks.map((link) => (
          <Button
            key={link.to}
            as={Link}
            to={link.to}
            variant="ghost"
            size="sm"
          >
            {link.label}
          </Button>
        ))}
      </HStack>
    );
  };

  return (
    <Box
      bg={bg}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Container maxW="container.xl">
        <Flex
          h={16}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo */}
          <Box>
            <Link to="/">
              <Text fontSize="xl" fontWeight="bold" color="brand.500">
                شغلي
              </Text>
            </Link>
          </Box>

          {/* Navigation Links */}
          <HStack spacing={8}>
            {getNavigationLinks()}
          </HStack>

          {/* User Menu */}
          {user && userData && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                leftIcon={
                  <Avatar
                    size="sm"
                    name={userData.name}
                    src={userData.avatar}
                  />
                }
              >
                {userData.name}
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/profile">
                  الملف الشخصي
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  تسجيل الخروج
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;