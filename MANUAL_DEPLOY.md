# نشر يدوي على GitHub Pages (بدون gh-pages)

## المشكلة:
`gh-pages` لا يمكنه العثور على Git في PATH

## الحل: رفع build يدوياً

### الطريقة 1: استخدام Git مباشرة

```powershell
# 1. تأكد أن build موجود
# إذا لم يكن موجوداً:
npm run build

# 2. انتقل إلى مجلد build
cd build

# 3. ابدأ Git repo جديد
git init

# 4. أضف جميع الملفات
git add .

# 5. Commit
git commit -m "Deploy to GitHub Pages"

# 6. أضف remote
git remote add origin https://github.com/ya95hya/shugly.git

# 7. ارفع إلى فرع gh-pages
git push -f origin HEAD:gh-pages

# 8. ارجع للمجلد الرئيسي
cd ..
```

### الطريقة 2: استخدام GitHub Actions (موصى به)

1. اذهب إلى: https://github.com/ya95hya/shugly
2. اضغط على **Actions** tab
3. اضغط **New workflow**
4. اختر **Simple workflow**
5. استبدل المحتوى بالكود التالي:

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
          cache-dependency-path: './package-lock.json'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          CI: false
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: './build'

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

6. اضغط **Start commit** → **Commit new file**

7. في **Settings** → **Pages**:
   - **Source:** اختر **GitHub Actions**

### الطريقة 3: رفع build يدوياً عبر GitHub Web

1. قم بـ build:
   ```powershell
   npm run build
   ```

2. اذهب إلى: https://github.com/ya95hya/shugly
3. انتقل إلى فرع `gh-pages` (إذا لم يكن موجوداً، أنشئه)
4. اضغط **Add file** → **Upload files**
5. اسحب وأفلت محتويات مجلد `build`
6. اضغط **Commit changes**

---

## الطريقة الموصى بها: GitHub Actions

الأسهل والأفضل - سينشر تلقائياً كل مرة ترفع على main branch.

