# رفع المشروع يدوياً إلى GitHub (بدون Git)

## الطريقة 1: استخدام GitHub Web Interface

### الخطوة 1: إنشاء مستودع جديد
1. اذهب إلى [github.com](https://github.com) وسجل الدخول
2. اضغط على زر **"+"** → **"New repository"**
3. اسم المستودع: `shugly-iraq`
4. اختر **Public** ⚠️ (مطلوب للنشر المجاني)
5. **لا تضع** علامة على "Initialize with README"
6. اضغط **"Create repository"**

### الخطوة 2: رفع الملفات
1. في صفحة المستودع الجديد، اضغط على **"uploading an existing file"**
2. **اسحب وأفلت** جميع الملفات من مجلد `shugly` إلى المتصفح
   - **استثناء:** لا ترفع مجلد `node_modules` أو `build`
3. في أسفل الصفحة:
   - **Commit message:** `Initial commit`
   - اضغط **"Commit changes"**

### الخطوة 3: تحديث package.json
1. في GitHub، اضغط على ملف `package.json`
2. اضغط على أيقونة القلم ✏️ (Edit)
3. عدّل السطر:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/shugly-iraq"
   ```
   استبدل `YOUR_USERNAME` باسم المستخدم الفعلي
4. اضغط **"Commit changes"**

### الخطوة 4: النشر على GitHub Pages
**مشكلة:** بدون Git محلي، لن تتمكن من استخدام `npm run deploy`

**الحل البديل:** استخدام GitHub Actions

1. في المستودع على GitHub، اضغط **"Add file"** → **"Create new file"**
2. اسم الملف: `.github/workflows/deploy.yml`
3. انسخ والصق هذا الكود:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: './shugly/package-lock.json'
      
      - name: Install dependencies
        working-directory: ./shugly
        run: npm ci
      
      - name: Build
        working-directory: ./shugly
        run: npm run build
        env:
          CI: false
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: './shugly/build'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
```

4. اضغط **"Commit new file"**

### الخطوة 5: تفعيل GitHub Pages
1. في المستودع → **Settings** → **Pages**
2. **Source:** اختر **"GitHub Actions"**
3. **Save**

### الخطوة 6: انتظر النشر
- بعد دقيقتين، اذهب إلى **Actions** tab في المستودع
- ستجد workflow يعمل، انتظر حتى يكتمل ✅
- موقعك سيكون على: `https://YOUR_USERNAME.github.io/shugly-iraq`

---

## الطريقة 2: استخدام GitHub Desktop (أسهل)

### الخطوة 1: تثبيت GitHub Desktop
1. نزل من: [desktop.github.com](https://desktop.github.com)
2. ثبت التطبيق
3. سجل دخول بحساب GitHub

### الخطوة 2: إنشاء مستودع
1. في GitHub Desktop: **File** → **New Repository**
2. **Name:** `shugly-iraq`
3. **Local Path:** اختر مكان المشروع
4. اضغط **"Create Repository"**

### الخطوة 3: Commit و Push
1. جميع الملفات ستظهر في GitHub Desktop
2. في الأسفل، اكتب رسالة: `Initial commit`
3. اضغط **"Commit to main"**
4. اضغط **"Publish repository"** (اختر Public)

### الخطوة 4: تحديث package.json
1. في GitHub Desktop، اضغط **"Repository"** → **"View on GitHub"**
2. عدّل `package.json` كما في الطريقة 1
3. في GitHub Desktop، اضغط **"Fetch origin"** ثم **"Pull origin"**
4. افتح `package.json` محلياً وعدّله
5. في GitHub Desktop، اضغط **"Commit to main"** ثم **"Push origin"**

### الخطوة 5: النشر
اتبع الخطوات من 4-6 في الطريقة 1 (GitHub Actions)

---

## ملاحظات مهمة

- ⚠️ **لا ترفع `node_modules`** - سيتم تثبيتها تلقائياً عبر GitHub Actions
- ⚠️ **لا ترفع `.env`** أو أي ملفات حساسة
- ✅ **تأكد من رفع `.github/workflows/deploy.yml`** للنشر التلقائي

---

## التحديثات المستقبلية

### مع GitHub Desktop:
1. عدّل الملفات محلياً
2. في GitHub Desktop: **Commit** → **Push**
3. GitHub Actions سينشر التحديثات تلقائياً

### بدون GitHub Desktop (رفع يدوي):
1. عدّل الملفات محلياً
2. في GitHub: **Add file** → **Upload files**
3. **Commit changes**

