import { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, Booking } from '../firebase/firestore';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useBookings = () => {
  const { userData } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userData) {
        console.log('No user data available');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching bookings for user:', userData.uid, 'role:', userData.role);
        
        // تحديد نوع المستخدم بناءً على البيانات المتاحة
        const userRole = userData.role || 'user';
        const bookingsData = await getBookings(userData.uid, userRole as 'user' | 'worker');
        
        console.log('Bookings loaded successfully:', bookingsData.length);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('حدث خطأ في تحميل الحجوزات');
        setBookings([]); // تعيين مصفوفة فارغة في حالة الخطأ
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userData]);

  const updateStatus = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status }
          : booking
      ));
      toast.success('تم تحديث حالة الحجز');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('حدث خطأ في تحديث حالة الحجز');
    }
  };

  const getBookingsByStatus = (status: Booking['status']) => {
    return bookings.filter(booking => booking.status === status);
  };

  const getStats = () => {
    return {
      total: bookings.length,
      pending: getBookingsByStatus('pending').length,
      accepted: getBookingsByStatus('accepted').length,
      completed: getBookingsByStatus('completed').length,
      cancelled: getBookingsByStatus('cancelled').length,
      totalEarnings: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalPrice, 0)
    };
  };

  const refetch = async () => {
    if (!userData) return;
    
    try {
      setLoading(true);
      console.log('Refetching bookings for user:', userData.uid, 'role:', userData.role);
      
      const userRole = userData.role || 'user';
      const bookingsData = await getBookings(userData.uid, userRole as 'user' | 'worker');
      
      console.log('Bookings refetched successfully:', bookingsData.length);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error refetching bookings:', error);
      toast.error('حدث خطأ في إعادة تحميل الحجوزات');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    bookings,
    loading,
    updateStatus,
    getBookingsByStatus,
    getStats,
    refetch
  };
};



