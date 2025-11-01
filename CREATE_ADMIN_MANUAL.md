# إنشاء حساب مسؤول (Admin) يدوياً

## ⚠️ مهم

تم منع إنشاء حسابات Admin من خلال واجهة التسجيل العامة. يجب إنشاء حسابات المسؤولين يدوياً.

---

## الطريقة 1: من Firebase Console

### الخطوة 1: إنشاء مستخدم في Firebase Authentication

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك **shugly**
3. من القائمة الجانبية، اختر **Authentication**
4. اضغط على **Users** tab
5. اضغط **Add user**
6. أدخل:
   - **Email:** بريد المسؤول
   - **Password:** كلمة مرور قوية
7. اضغط **Add user**

### الخطوة 2: تحديث Role في Firestore

1. في Firebase Console، اختر **Firestore Database**
2. اذهب إلى collection **users**
3. ابحث عن المستند الخاص بالمستخدم الجديد (باستخدام UID من Authentication)
4. إذا لم يكن موجوداً، أنشئ مستند جديد:
   - **Document ID:** نفس UID من Authentication
5. أضف/عدّل الحقول:
   ```json
   {
     "uid": "المستخدم_UID",
     "name": "اسم المسؤول",
     "email": "البريد_الإلكتروني",
     "phone": "رقم_الهاتف",
     "role": "admin",
     "createdAt": "2024-01-01T00:00:00Z"
   }
   ```
6. احفظ التغييرات

---

## الطريقة 2: من Firebase Admin SDK (للمطورين)

إذا كان لديك Firebase Admin SDK مثبت:

```javascript
const admin = require('firebase-admin');

// إنشاء مستخدم
const userRecord = await admin.auth().createUser({
  email: 'admin@example.com',
  password: 'securePassword123',
  displayName: 'Admin User'
});

// تحديث role في Firestore
await admin.firestore().collection('users').doc(userRecord.uid).set({
  uid: userRecord.uid,
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '+964XXXXXXXXX',
  role: 'admin',
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

---

## التحقق من الحساب

1. سجل دخول باستخدام البريد الإلكتروني وكلمة المرور الجديدة
2. يجب أن يظهر لك **لوحة الإدارة (Admin Dashboard)**
3. يمكنك الوصول إلى: `/admin`

---

## ملاحظات أمنية

- ✅ استخدم كلمات مرور قوية لحسابات Admin
- ✅ قلل عدد حسابات Admin إلى الحد الأدنى
- ✅ راقب حسابات Admin بانتظام
- ✅ استخدم Firebase Security Rules لحماية البيانات الحساسة

---

## إزالة صلاحيات Admin

لإزالة صلاحيات Admin من حساب:

1. اذهب إلى Firestore → **users**
2. افتح مستند المستخدم
3. غير `role` من `"admin"` إلى `"user"` أو `"worker"`
4. احفظ التغييرات

---

## نصائح

- احتفظ بقائمة بحسابات Admin وبياناتها في مكان آمن
- فكّر في استخدام Multi-Factor Authentication (MFA) لحسابات Admin
- راجع حسابات Admin بانتظام

