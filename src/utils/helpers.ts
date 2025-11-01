import { Booking } from '../firebase/firestore';

export const getStatusColor = (status: Booking['status']): string => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'accepted':
      return 'green';
    case 'rejected':
      return 'red';
    case 'completed':
      return 'blue';
    case 'cancelled':
      return 'gray';
    default:
      return 'gray';
  }
};

export const getStatusText = (status: Booking['status']): string => {
  switch (status) {
    case 'pending':
      return 'معلق';
    case 'accepted':
      return 'مقبول';
    case 'rejected':
      return 'مرفوض';
    case 'completed':
      return 'مكتمل';
    case 'cancelled':
      return 'ملغي';
    default:
      return 'غير محدد';
  }
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'مساءً' : 'صباحاً';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ar-SA')} ريال`;
};

export const calculateTotalPrice = (hourlyRate: number, duration: number): number => {
  return hourlyRate * duration;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+966|0)?[5-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const generateBookingId = (): string => {
  return 'BK' + Date.now().toString(36).toUpperCase();
};

export const getTimeSlots = (): string[] => {
  const slots = [];
  for (let hour = 8; hour <= 20; hour++) {
    const timeString = hour.toString().padStart(2, '0') + ':00';
    slots.push(timeString);
  }
  return slots;
};

export const isDateInPast = (date: string): boolean => {
  const today = new Date();
  const selectedDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  return selectedDate < today;
};

export const getNextAvailableDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};