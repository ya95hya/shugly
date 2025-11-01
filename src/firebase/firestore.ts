import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Types
export interface Worker {
  uid: string;
  name: string;
  email: string;
  phone: string;
  services: string[];
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  bio: string;
  images: string[];
  location: string;
  availability: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  workerId: string;
  serviceType: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  adminApproved: boolean;
  createdAt: Date;
  notes?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  workerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Workers
export const getWorkers = async (): Promise<Worker[]> => {
  try {
    const workersRef = collection(db, 'workers');
    // Try with orderBy first, if it fails (missing index), try without
    try {
      const q = query(workersRef, where('availability', '==', true), orderBy('rating', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as Worker));
    } catch (orderByError: any) {
      // If orderBy fails (likely missing index), fetch all and sort in memory
      console.warn('OrderBy failed, fetching without orderBy:', orderByError);
      const q = query(workersRef, where('availability', '==', true));
      const snapshot = await getDocs(q);
      const workers = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as Worker));
      // Sort in memory
      return workers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  } catch (error) {
    console.error('Error fetching workers:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
};

export const getWorker = async (workerId: string): Promise<Worker | null> => {
  try {
    console.log('Fetching worker with ID:', workerId);
    const workerDoc = await getDoc(doc(db, 'workers', workerId));
    console.log('Worker document exists:', workerDoc.exists());
    
    if (workerDoc.exists()) {
      const workerData = { ...workerDoc.data(), uid: workerDoc.id } as Worker;
      console.log('Worker data:', workerData);
      return workerData;
    }
    
    console.log('Worker document does not exist');
    return null;
  } catch (error) {
    console.error('Error in getWorker:', error);
    throw error;
  }
};

// Bookings
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getBookings = async (userId: string, userRole: 'user' | 'worker'): Promise<Booking[]> => {
  try {
    console.log('Fetching bookings for:', { userId, userRole });
    
    const bookingsRef = collection(db, 'bookings');
    const field = userRole === 'user' ? 'userId' : 'workerId';
    const q = query(bookingsRef, where(field, '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const allBookings = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
    
    console.log('All bookings found:', allBookings.length);
    
    // للعامل والمستخدم: عرض جميع الحجوزات (بدون تصفية)
    console.log('All bookings for', userRole, ':', allBookings.length);
    return allBookings;
  } catch (error) {
    console.error('Error in getBookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<void> => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { status });
  } catch (error) {
    throw error;
  }
};

// Get all bookings for admin
export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
  } catch (error) {
    throw error;
  }
};

// Get bookings by status
export const getBookingsByStatus = async (status: Booking['status']): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('status', '==', status), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
  } catch (error) {
    throw error;
  }
};

// Admin approval functions
export const approveBooking = async (bookingId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { 
      adminApproved: true,
      status: 'accepted'
    });
  } catch (error) {
    throw error;
  }
};

export const rejectBooking = async (bookingId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { 
      adminApproved: false,
      status: 'rejected'
    });
  } catch (error) {
    throw error;
  }
};

// Get pending bookings for worker (waiting for admin approval)
export const getPendingBookingsForWorker = async (workerId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('workerId', '==', workerId), 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const allPending = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Booking));
    
    // تصفية الحجوزات المعلقة (غير مقبولة من الإدارة)
    return allPending.filter(booking => 
      booking.adminApproved === false || 
      booking.adminApproved === undefined
    );
  } catch (error) {
    throw error;
  }
};

// Update old bookings to add adminApproved field
export const updateOldBookings = async (): Promise<void> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('adminApproved', '==', undefined));
    const snapshot = await getDocs(q);
    
    const updatePromises = snapshot.docs.map(async (doc) => {
      const bookingData = doc.data();
      const adminApproved = bookingData.status === 'accepted' ? true : false;
      await updateDoc(doc.ref, { adminApproved });
    });
    
    await Promise.all(updatePromises);
    console.log('Updated old bookings with adminApproved field');
  } catch (error) {
    console.error('Error updating old bookings:', error);
    throw error;
  }
};

// Reviews
export const createReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getWorkerReviews = async (workerId: string): Promise<Review[]> => {
  try {
    console.log('Fetching reviews for worker ID:', workerId);
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('workerId', '==', workerId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Review));
    console.log('Reviews found:', reviews.length);
    return reviews;
  } catch (error) {
    console.error('Error in getWorkerReviews:', error);
    // Return empty array instead of throwing error for reviews
    return [];
  }
};

// Messages
export const sendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (userId: string, otherUserId: string): Promise<Message[]> => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('senderId', 'in', [userId, otherUserId]),
      where('receiverId', 'in', [userId, otherUserId]),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
  } catch (error) {
    throw error;
  }
};

// Services
export const getServices = async (): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Service));
  } catch (error) {
    throw error;
  }
};


