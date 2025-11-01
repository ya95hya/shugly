# إصلاح مشكلة الصفحة الفارغة على GitHub Pages

## المشكلة:
الصفحة تعمل محلياً لكن تظهر فارغة على GitHub Pages

## الحل:

### الخطوة 1: تأكد من إعدادات basename

تم تحديث `src/index.tsx` لاستخدام `PUBLIC_URL` تلقائياً.

### الخطوة 2: أعد بناء المشروع

```powershell
npm run build
```

### الخطوة 3: النشر على GitHub Pages

إذا كنت تستخدم gh-pages:
```powershell
npm run deploy
```

أو إذا كنت تستخدم GitHub Actions:
```powershell
git add .
git commit -m "Fix basename for GitHub Pages"
git push
```

---

## التحقق:

1. انتظر 2-3 دقائق بعد النشر
2. افتح: https://ya95hya.github.io/shugly
3. افتح Developer Console (F12)
4. تحقق من الأخطاء

---

## مشاكل شائعة:

### 1. Console يظهر أخطاء 404 للملفات
**الحل:** تأكد من أن `homepage` في `package.json` صحيح:
```json
"homepage": "https://ya95hya.github.io/shugly"
```

### 2. الصفحة تظهر لكن محتوى فارغ
**الحل:** تحقق من:
- Console للأخطاء
- Network tab - هل الملفات تُحمّل؟
- هل Firebase config يعمل؟

### 3. صفحة 404 عند التنقل
**الحل:** تأكد من وجود ملف `404.html` في `public` و `build`

---

## إذا استمرت المشكلة:

1. افتح Console (F12) على الموقع المنشور
2. ابحث عن:
   - أخطاء JavaScript
   - ملفات غير محملة (404)
   - أخطاء Firebase
3. أرسل الأخطاء

