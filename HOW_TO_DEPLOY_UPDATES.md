# كيفية نشر التحديثات على GitHub Pages

لديك خياران لنشر التحديثات:

---

## الطريقة 1: GitHub Actions (موصى به - تلقائي) ✅

هذه الطريقة **الأسهل والأفضل** - كل ما تحتاجه هو رفع التغييرات على GitHub!

### الخطوات:

```powershell
# 1. أضف التغييرات
git add .

# 2. احفظ التغييرات
git commit -m "Update: وصف التحديثات"

# 3. ارفع على GitHub
git push
```

### ماذا يحدث بعدها:

1. ✅ GitHub Actions سيكتشف التحديثات تلقائياً
2. ✅ سيبني المشروع تلقائياً
3. ✅ سينشر على GitHub Pages تلقائياً
4. ✅ خلال 2-5 دقائق، ستكون التحديثات على الموقع!

### التحقق من النشر:

1. اذهب إلى: https://github.com/ya95hya/shugly
2. اضغط على **Actions** tab
3. ستجد workflow يعمل
4. انتظر حتى يكتمل (علامة ✅ خضراء)
5. افتح الموقع: https://ya95hya.github.io/shugly

---

## الطريقة 2: استخدام gh-pages مباشرة

إذا لم تكن تستخدم GitHub Actions:

```powershell
# 1. أضف التغييرات
git add .

# 2. احفظ التغييرات
git commit -m "Update: وصف التحديثات"

# 3. ارفع على GitHub
git push

# 4. انشر على GitHub Pages
npm run deploy
```

---

## ⚠️ مهم: إضافة Firebase Secrets (للمرة الأولى فقط)

إذا لم تقم بإضافة Secrets بعد، يجب إضافتها لنشر التحديثات:

1. اذهب إلى: https://github.com/ya95hya/shugly/settings/secrets/actions
2. اضغط **New repository secret**
3. أضف كل متغير:

### Secrets المطلوبة:

- `REACT_APP_FIREBASE_API_KEY` = `AIzaSyCExL-MtKKG3_SND8-qjH2M-MI5Vv2V-dY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN` = `shugly.firebaseapp.com`
- `REACT_APP_FIREBASE_PROJECT_ID` = `shugly`
- `REACT_APP_FIREBASE_STORAGE_BUCKET` = `shugly.firebasestorage.app`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` = `71844095703`
- `REACT_APP_FIREBASE_APP_ID` = `1:71844095703:web:85f731fb10e8dc8604f292`
- `REACT_APP_FIREBASE_MEASUREMENT_ID` = `G-699XGN7K81`

**بعد إضافة Secrets، ارفع التغييرات مرة أخرى:**
```powershell
git add .
git commit -m "Add Firebase secrets"
git push
```

---

## ملخص سريع:

### للنشر العادي:
```powershell
git add .
git commit -m "Update"
git push
```

### للتحقق من النشر:
- انتظر 2-5 دقائق
- اذهب إلى: https://ya95hya.github.io/shugly
- افتح Actions tab على GitHub للتحقق من الحالة

---

## استكشاف الأخطاء:

### المشكلة: النشر لا يعمل
**الحل:** تحقق من:
1. هل Secrets موجودة في GitHub?
2. هل workflow يعمل في Actions tab?
3. هل هناك أخطاء في Actions?

### المشكلة: الموقع لا يعمل بعد النشر
**الحل:**
1. انتظر 2-3 دقائق أخرى
2. افتح Developer Console (F12)
3. تحقق من الأخطاء
4. تأكد من Firebase Secrets

---

## نصائح:

- ✅ استخدم رسائل commit واضحة: `"Add feature X"` أو `"Fix bug Y"`
- ✅ راجع Actions tab للتأكد من نجاح النشر
- ✅ اختبر الموقع بعد النشر

