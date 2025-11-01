# دليل النشر على GitHub Pages

هذا الدليل يوضح كيفية نشر موقع شغلي على GitHub Pages خطوة بخطوة.

## المتطلبات الأساسية

- حساب GitHub
- Git مثبت على جهازك
- Node.js و npm مثبتان

---

## الخطوات التفصيلية

### الخطوة 1: إنشاء مستودع على GitHub

1. اذهب إلى [GitHub.com](https://github.com) وسجل الدخول
2. اضغط على زر **"+"** في أعلى الصفحة → **"New repository"**
3. املأ التفاصيل:
   - **Repository name:** `shugly-iraq` (أو أي اسم تريده)
   - **Visibility:** اختر **Public** (GitHub Pages المجاني يتطلب public repo)
   - **لا تضع** علامة على "Initialize this repository with a README"
4. اضغط **"Create repository"**

---

### الخطوة 2: رفع المشروع إلى GitHub

افتح Terminal/PowerShell في مجلد المشروع (`shugly`) وقم بالتالي:

```bash
# إذا لم يكن المشروع متصلاً بـ Git بعد
git init

# أضف جميع الملفات
git add .

# ارفع التغييرات
git commit -m "Initial commit - Ready for GitHub Pages"

# أضف المستودع البعيد (استبدل YOUR_USERNAME باسم المستخدم الفعلي)
git remote add origin https://github.com/YOUR_USERNAME/shugly-iraq.git

# رفع المشروع
git branch -M main
git push -u origin main
```

**ملاحظة:** استبدل `YOUR_USERNAME` باسم المستخدم الفعلي على GitHub.

---

### الخطوة 3: تحديث package.json

1. افتح ملف `package.json`
2. ابحث عن السطر:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/shugly-iraq"
   ```
3. استبدل `YOUR_USERNAME` باسم المستخدم الفعلي على GitHub
4. إذا كان اسم المستودع مختلف، استبدل `shugly-iraq` باسم المستودع الفعلي

**مثال:**
```json
"homepage": "https://yahya.github.io/shugly-iraq"
```

---

### الخطوة 4: نشر الموقع

بعد تحديث `package.json`، قم بتنفيذ الأمر التالي:

```bash
npm run deploy
```

هذا الأمر سيقوم بـ:
1. بناء المشروع (`npm run build`)
2. رفع مجلد `build` إلى فرع `gh-pages` في GitHub
3. تفعيل GitHub Pages تلقائياً

---

### الخطوة 5: تفعيل GitHub Pages (إذا لم يتم تلقائياً)

1. اذهب إلى المستودع على GitHub
2. اضغط على **Settings** (الإعدادات)
3. من القائمة الجانبية، اختر **Pages**
4. في قسم **Source**:
   - **Branch:** اختر `gh-pages`
   - **Folder:** اختر `/ (root)`
5. اضغط **Save**

---

### الخطوة 6: الانتظار والنشر

- قد يستغرق النشر من 1-5 دقائق
- بعد النشر، ستجد الرابط في صفحة **Settings → Pages**
- الرابط سيكون مثل: `https://YOUR_USERNAME.github.io/shugly-iraq`

---

### الخطوة 7: إعداد Firebase للنطاق الجديد

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. اختر مشروعك **shugly**
3. اضغط على **Authentication** → **Settings** → **Authorized domains**
4. اضغط **"Add domain"**
5. أدخل نطاق GitHub Pages: `YOUR_USERNAME.github.io`
6. اضغط **Add**

**مهم:** بدون هذه الخطوة، لن يعمل تسجيل الدخول!

---

## تحديث الموقع بعد التعديلات

كل مرة تقوم بتعديلات وتريد نشرها:

```bash
# أضف التغييرات
git add .

# احفظ التغييرات
git commit -m "Update website"

# ارفع إلى GitHub
git push

# انشر على GitHub Pages
npm run deploy
```

---

## حل المشاكل الشائعة

### المشكلة 1: الصفحات لا تعمل بعد التنقل
**الحل:** تأكد من أن `homepage` في `package.json` صحيح.

### المشكلة 2: الأصول (Assets) لا تظهر
**الحل:** تأكد من أن المسارات في الكود تستخدم المسارات النسبية.

### المشكلة 3: صفحة 404 عند التنقل
**الحل:** أضف ملف `404.html` في مجلد `public`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <script>
      sessionStorage.redirect = location.href;
      location.replace("/");
    </script>
  </head>
  <body></body>
</html>
```

### المشكلة 4: Firebase لا يعمل
**الحل:** تأكد من:
- إضافة `YOUR_USERNAME.github.io` في Firebase Authorized domains
- إضافة `github.io` أيضاً إذا لزم الأمر

---

## ملاحظات مهمة

1. **المستودع يجب أن يكون Public:** GitHub Pages المجاني لا يدعم Private repositories
2. **الفرع gh-pages:** سيتم إنشاؤه تلقائياً عند تنفيذ `npm run deploy`
3. **التحديثات:** قد تستغرق دقيقة أو دقيقتين لتظهر على الموقع
4. **النطاق المخصص:** يمكنك إضافة نطاق مخصص من Settings → Pages → Custom domain

---

## إضافة نطاق مخصص (اختياري)

1. في GitHub: **Settings → Pages → Custom domain**
2. أدخل نطاقك (مثل: `shugly.com`)
3. اتبع التعليمات لتحديث DNS
4. اضغط **Enforce HTTPS**

---

## روابط مفيدة

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [gh-pages Package](https://www.npmjs.com/package/gh-pages)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment#github-pages)

---

## ملخص الأوامر السريعة

```bash
# أول مرة
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/shugly-iraq.git
git branch -M main
git push -u origin main
npm run deploy

# عند التحديث
git add .
git commit -m "Update"
git push
npm run deploy
```

**تم! موقعك الآن على الإنترنت مجاناً! 🎉**

