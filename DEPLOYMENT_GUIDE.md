# دليل استضافة موقع شغلي على الإنترنت

هذا الدليل يوضح كيفية استضافة تطبيق React الخاص بك على منصات الاستضافة المختلفة (غير Firebase).

## الخيارات المتاحة

### 1. **Vercel** (الأسهل والأسرع) ⭐ موصى به

**المميزات:**
- مجاني للمشاريع الشخصية
- نشر تلقائي من GitHub
- دعم ممتاز لتطبيقات React
- SSL مجاني
- CDN عالمي

**خطوات النشر:**

1. **إنشاء حساب على Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجل دخول باستخدام حساب GitHub

2. **إعداد المشروع:**
   ```bash
   # تأكد من أن المشروع محفوظ في GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **النشر:**
   - في Vercel، اضغط "New Project"
   - اختر مستودع GitHub الخاص بك
   - Vercel سيكتشف تلقائياً أنه مشروع React
   - اضغط "Deploy"
   - سيتم نشر الموقع خلال دقائق!

4. **إعدادات البناء (Build Settings):**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

---

### 2. **Netlify** (سهل جداً أيضاً)

**المميزات:**
- مجاني
- نشر تلقائي
- SSL مجاني
- دعم Forms و Functions

**خطوات النشر:**

1. **إنشاء حساب:**
   - اذهب إلى [netlify.com](https://netlify.com)
   - سجل دخول باستخدام GitHub

2. **إنشاء ملف netlify.toml (اختياري):**
   ```toml
   [build]
     command = "npm run build"
     publish = "build"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **النشر:**
   - اضغط "Add new site" → "Import an existing project"
   - اختر GitHub واختر المستودع
   - Build command: `npm run build`
   - Publish directory: `build`
   - اضغط "Deploy site"

---

### 3. **GitHub Pages** (مجاني تماماً)

**المميزات:**
- مجاني بالكامل
- مضمن في GitHub

**خطوات النشر:**

1. **تثبيت gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **إضافة scripts في package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build",
     ...
   },
   "homepage": "https://ya95hya.github.io/shugly"
   ```

3. **النشر:**
   ```bash
   npm run deploy
   ```

---

### 4. **Render** (بديل جيد)

**المميزات:**
- مجاني
- نشر تلقائي
- SSL مجاني

**خطوات النشر:**

1. اذهب إلى [render.com](https://render.com)
2. سجل دخول باستخدام GitHub
3. اضغط "New" → "Static Site"
4. اختر المستودع
5. إعدادات:
   - Build Command: `npm run build`
   - Publish Directory: `build`
6. اضغط "Create Static Site"

---

### 5. **Railway** (للمشاريع الأكبر)

**المميزات:**
- مجاني للبداية
- دعم قوي

**خطوات النشر:**

1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول باستخدام GitHub
3. "New Project" → "Deploy from GitHub repo"
4. اختر المستودع
5. Railway سيكتشف الإعدادات تلقائياً

---

## إعدادات مهمة قبل النشر

### 1. متغيرات البيئة (Environment Variables)

إذا كنت تستخدم متغيرات بيئة حساسة (مثل مفاتيح API)، أنشئ ملف `.env.production`:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

ثم عدّل `config.ts` لاستخدامها:

```typescript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... إلخ
};
```

**ملاحظة:** أضف هذه المتغيرات في إعدادات الاستضافة (Vercel/Netlify) أيضاً.

### 2. إعدادات CORS في Firebase

تأكد من إضافة نطاق الاستضافة في Firebase Console:
- Firebase Console → Authentication → Settings → Authorized domains
- أضف نطاقك (مثل: `your-app.vercel.app`)

### 3. إعدادات Firestore Rules

تأكد من أن قواعد Firestore تسمح بالوصول من النطاق الجديد.

---

## توصياتي

- **للمبتدئين:** استخدم **Vercel** - الأسهل والأسرع
- **للمشاريع الشخصية:** **Netlify** أو **Vercel**
- **للمشاريع المفتوحة المصدر:** **GitHub Pages**

---

## بعد النشر

1. **اختبر الموقع:**
   - تأكد من عمل جميع الصفحات
   - اختبر تسجيل الدخول والتسجيل
   - تأكد من عمل Firebase

2. **ربط نطاق مخصص (Custom Domain):**
   - في Vercel/Netlify: Settings → Domains
   - أضف نطاقك (مثل: `shugly.com`)
   - اتبع التعليمات لإعداد DNS

3. **مراقبة الأداء:**
   - استخدم أدوات مثل Google Analytics
   - راقب الأخطاء في Console

---

## استكشاف الأخطاء

### المشكلة: الصفحات لا تعمل بعد التحديث
**الحل:** تأكد من وجود redirect rule في `netlify.toml` أو إعدادات Vercel:
```
/* -> /index.html (200)
```

### المشكلة: Firebase لا يعمل
**الحل:** 
- تأكد من إضافة النطاق في Firebase Console
- تحقق من متغيرات البيئة
- تأكد من صحة `firebaseConfig`

---

## روابط مفيدة

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment)

