# إعداد متغيرات البيئة

## ⚠️ مهم جداً

قبل تشغيل المشروع، يجب إنشاء ملف `.env.local` وإضافة قيم Firebase.

---

## الخطوة 1: إنشاء ملف .env.local

في مجلد `shugly` (نفس مجلد `package.json`)، أنشئ ملف جديد باسم `.env.local`

**ملاحظة:** اسم الملف يبدأ بنقطة `.` وهو مخفي في بعض أنظمة التشغيل.

### محتوى الملف `.env.local`:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyCExL-MtKKG3_SND8-qjH2M-MI5Vv2V-dY
REACT_APP_FIREBASE_AUTH_DOMAIN=shugly.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=shugly
REACT_APP_FIREBASE_STORAGE_BUCKET=shugly.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=71844095703
REACT_APP_FIREBASE_APP_ID=1:71844095703:web:85f731fb10e8dc8604f292
REACT_APP_FIREBASE_MEASUREMENT_ID=G-699XGN7K81
```

---

## الخطوة 2: التحقق من الملف

- ✅ الملف موجود في: `shugly/.env.local`
- ✅ الملف **لا** يحتوي على مسافات حول `=`
- ✅ كل سطر يحتوي على متغير واحد فقط

---

## الخطوة 3: إعادة تشغيل الخادم

بعد إنشاء `.env.local`:

```powershell
# أوقف الخادم (Ctrl+C)
# ثم أعد تشغيله
npm start
```

**مهم:** متغيرات البيئة تُحمّل فقط عند بدء التطبيق، لذا يجب إعادة التشغيل.

---

## للتحقق من أن كل شيء يعمل:

1. ابدأ الخادم: `npm start`
2. افتح المتصفح
3. افتح Developer Console (F12)
4. تأكد من عدم وجود أخطاء في Console

---

## للاستخدام مع GitHub Actions (النشر):

راجع ملف `FIX_SECURITY_LEAK.md` لإضافة Secrets في GitHub.

