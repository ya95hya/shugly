# دليل سريع: نشر على GitHub Pages

## الخطوات السريعة (10 دقائق)

### 1️⃣ إنشاء مستودع على GitHub
- اذهب إلى [github.com](https://github.com) → **New repository**
- اسم المستودع: `shugly-iraq` (أو أي اسم)
- اختر **Public** ⚠️ (مطلوب للنشر المجاني)
- اضغط **Create repository**

### 2️⃣ تحديث package.json
افتح `package.json` وعدّل السطر:
```json
"homepage": "https://YOUR_USERNAME.github.io/shugly-iraq"
```
استبدل `YOUR_USERNAME` باسم المستخدم الفعلي على GitHub.

### 3️⃣ رفع المشروع
```bash
cd shugly
git init
git add .
git commit -m "Ready for GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shugly-iraq.git
git push -u origin main
```

### 4️⃣ النشر
```bash
npm run deploy
```
⏳ انتظر دقيقة واحدة...

### 5️⃣ تفعيل GitHub Pages
- اذهب إلى المستودع على GitHub
- **Settings** → **Pages**
- **Branch:** `gh-pages` → **Save**

### 6️⃣ إعداد Firebase
- [Firebase Console](https://console.firebase.google.com)
- **Authentication** → **Settings** → **Authorized domains**
- أضف: `YOUR_USERNAME.github.io`

## ✅ تم!

موقعك الآن على: `https://YOUR_USERNAME.github.io/shugly-iraq`

---

## عند التحديث

```bash
git add .
git commit -m "Update"
git push
npm run deploy
```

---

## ملاحظات مهمة

- ✅ المستودع يجب أن يكون **Public**
- ✅ عند النشر لأول مرة، انتظر 2-5 دقائق
- ✅ لا تنس إضافة النطاق في Firebase!

