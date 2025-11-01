import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

export interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'worker' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string,
  role: 'user' | 'worker' | 'admin' = 'user'
): Promise<UserCredential> => {
  try {
    // Prevent admin role registration - admins must be created manually
    if (role === 'admin') {
      throw new Error('لا يمكن إنشاء حساب مسؤول من خلال التسجيل. يجب إنشاء حسابات المسؤولين يدوياً.');
    }

    // Ensure only valid roles
    const validRole = (role === 'user' || role === 'worker') ? role : 'user';

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Create user document in Firestore
    const userData: UserData = {
      uid: userCredential.user.uid,
      name,
      email,
      phone,
      role: validRole,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    // If user is a worker, create worker document
    if (validRole === 'worker') {
      const workerData = {
        uid: userCredential.user.uid,
        name,
        email,
        phone,
        services: [],
        hourlyRate: 50,
        rating: 0,
        reviewsCount: 0,
        bio: '',
        images: [],
        location: '',
        availability: true,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'workers', userCredential.user.uid), workerData);
    }

    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    throw error;
  }
};
