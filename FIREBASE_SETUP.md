# إعداد Firebase

## الخطوات المطلوبة لإعداد Firebase

### 1. إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "إضافة مشروع" أو "Add Project"
3. أدخل اسم المشروع: `shugly`
4. اختر "تمكين Google Analytics" (اختياري)
5. انقر على "إنشاء مشروع"

### 2. إضافة تطبيق ويب

1. في لوحة المشروع، انقر على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `shugly-web`
3. اختر "إعداد Firebase Hosting" (اختياري)
4. انقر على "تسجيل التطبيق"

### 3. نسخ بيانات التكوين

ستظهر لك بيانات التكوين، انسخها وألصقها في ملف `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 4. تفعيل Authentication

1. في القائمة الجانبية، انقر على "Authentication"
2. انقر على "البدء" أو "Get started"
3. انتقل إلى تبويب "Sign-in method"
4. فعّل "البريد الإلكتروني/كلمة المرور" (Email/Password)

### 5. إعداد Firestore Database

1. في القائمة الجانبية، انقر على "Firestore Database"
2. انقر على "إنشاء قاعدة بيانات"
3. اختر "بدء في وضع الاختبار" (Start in test mode)
4. اختر موقع قاعدة البيانات (الأقرب لمنطقتك)

### 6. إعداد Storage

1. في القائمة الجانبية، انقر على "Storage"
2. انقر على "البدء" أو "Get started"
3. اختر "بدء في وضع الاختبار" (Start in test mode)
4. اختر موقع التخزين (نفس موقع قاعدة البيانات)

### 7. قواعد الأمان (Security Rules)

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Workers data is readable by all authenticated users
    match /workers/{workerId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == workerId;
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.workerId == request.auth.uid);
    }
    
    // Reviews
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (resource.data.senderId == request.auth.uid || 
         resource.data.receiverId == request.auth.uid);
    }
    
    // Services (read only)
    match /services/{serviceId} {
      allow read: if request.auth != null;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /workers/{workerId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == workerId;
    }
  }
}
```

### 8. إعداد البيانات الأولية

بعد إعداد Firebase، ستحتاج إلى إضافة بعض البيانات الأولية:

#### إضافة أنواع الخدمات
```javascript
// في Firestore، أضف مجموعة "services" مع الوثائق التالية:

// وثيقة 1
{
  name: "تنظيف المنزل",
  description: "تنظيف شامل للمنزل",
  icon: "home"
}

// وثيقة 2
{
  name: "طبخ",
  description: "إعداد وجبات الطعام",
  icon: "chef-hat"
}

// وثيقة 3
{
  name: "رعاية الأطفال",
  description: "رعاية ومراقبة الأطفال",
  icon: "baby"
}

// وثيقة 4
{
  name: "غسيل الملابس",
  description: "غسيل وكي الملابس",
  icon: "shirt"
}
```

### 9. اختبار التكوين

1. تأكد من تحديث ملف `src/firebase/config.ts` ببيانات التكوين الصحيحة
2. شغل المشروع: `npm start`
3. جرب إنشاء حساب جديد
4. تأكد من ظهور البيانات في Firebase Console

### 10. نصائح إضافية

- استخدم متصفح Chrome أو Edge للحصول على أفضل تجربة
- تأكد من تفعيل JavaScript في المتصفح
- في حالة وجود مشاكل، تحقق من Console في المتصفح
- تأكد من أن جميع الخدمات مفعلة في Firebase Console

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في التكوين**: تأكد من نسخ بيانات التكوين بشكل صحيح
2. **مشاكل في Authentication**: تأكد من تفعيل Email/Password في Firebase
3. **مشاكل في Firestore**: تأكد من إعداد قواعد الأمان بشكل صحيح
4. **مشاكل في Storage**: تأكد من تفعيل Storage وإعداد القواعد

### للحصول على المساعدة:
- راجع [وثائق Firebase](https://firebase.google.com/docs)
- تحقق من Console في المتصفح للأخطاء
- تأكد من أن جميع الخدمات مفعلة في Firebase Console



