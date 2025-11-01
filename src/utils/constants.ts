export const APP_NAME = 'شغلي العراق';
export const APP_DESCRIPTION = 'منصة ربط المستخدمين بعمال الأعمال المنزلية في العراق';

export const USER_ROLES = {
  USER: 'user',
  WORKER: 'worker',
  ADMIN: 'admin'
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const SERVICES = [
  'تنظيف المنزل',
  'طبخ',
  'غسيل الملابس',
  'رعاية الأطفال',
  'رعاية المسنين',
  'تنظيف السجاد',
  'تنظيف النوافذ',
  'تنظيم المنزل',
  'غسيل الأطباق',
  'تنظيف المطبخ',
  'تنظيف الحمام',
  'كوي الملابس'
];

export const TIME_SLOTS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00'
];

export const DURATION_OPTIONS = [
  { value: 1, label: 'ساعة واحدة' },
  { value: 2, label: 'ساعتان' },
  { value: 3, label: '3 ساعات' },
  { value: 4, label: '4 ساعات' },
  { value: 5, label: '5 ساعات' },
  { value: 6, label: '6 ساعات' },
  { value: 8, label: '8 ساعات' }
];

export const IRAQI_CITIES = [
  'بغداد',
  'البصرة',
  'الموصل',
  'أربيل',
  'السليمانية',
  'دهوك',
  'كركوك',
  'النجف',
  'كربلاء',
  'بابل',
  'الديوانية',
  'الناصرية',
  'العمارة',
  'الرمادي',
  'تكريت',
  'سامراء',
  'بعقوبة',
  'الحلة',
  'الكوت',
  'الزبير',
  'أبو الخصيب',
  'القرنة',
  'الشطرة',
  'الرفاعي',
  'الحي',
  'القلعة',
  'الخالص',
  'بلد',
  'دجيل',
  'المدائن'
];



