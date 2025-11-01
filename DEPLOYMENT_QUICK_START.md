# دليل سريع للنشر على Vercel (5 دقائق)

## الخطوات السريعة:

### 1. رفع المشروع على GitHub (إذا لم يكن موجوداً)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/shugly-iraq.git
git push -u origin main
```

### 2. النشر على Vercel

1. **اذهب إلى:** [vercel.com](https://vercel.com)
2. **اضغط:** "Sign Up" أو "Login" باستخدام GitHub
3. **اضغط:** "Add New..." → "Project"
4. **اختر:** المستودع الخاص بك (shugly-iraq)
5. **الإعدادات:**
   - Framework Preset: Create React App (سيتم اكتشافه تلقائياً)
   - Root Directory: `./shugly` (إذا كان المشروع داخل مجلد)
   - Build Command: `npm run build`
   - Output Directory: `build`
6. **اضغط:** "Deploy"
7. **انتظر دقيقتين** ⏳
8. **تم!** 🎉 ستحصل على رابط مثل: `your-app.vercel.app`

### 3. إعداد Firebase للنطاق الجديد

1. **اذهب إلى:** [Firebase Console](https://console.firebase.google.com)
2. **اختر المشروع:** shugly
3. **Authentication → Settings → Authorized domains**
4. **اضغط:** "Add domain"
5. **أدخل:** `your-app.vercel.app`
6. **احفظ**

### 4. اختبر الموقع

- افتح الرابط الذي حصلت عليه من Vercel
- جرب تسجيل الدخول والتسجيل
- تأكد من عمل جميع الميزات

---

## إضافة نطاق مخصص (اختياري)

1. في Vercel: **Settings → Domains**
2. **Add Domain** → أدخل نطاقك (مثل: `shugly.com`)
3. اتبع التعليمات لتحديث DNS

---

## تحديثات تلقائية

كل مرة ترفع تغييرات على GitHub:
```bash
git add .
git commit -m "Update"
git push
```
Vercel سينشر التحديثات تلقائياً! 🚀

