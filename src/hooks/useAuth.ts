import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { registerUser, loginUser, logoutUser } from '../firebase/auth';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, userData, loading } = useAuthContext();

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    role: 'user' | 'worker' | 'admin' = 'user'
  ) => {
    try {
      await registerUser(email, password, name, phone, role);
      toast.success('تم إنشاء الحساب بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في إنشاء الحساب');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في تسجيل الدخول');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ في تسجيل الخروج');
      throw error;
    }
  };

  return {
    user,
    userData,
    loading,
    register,
    login,
    logout
  };
};


