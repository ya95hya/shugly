# دليل سريع: نشر على GitHub Pages

## الخطوات السريعة (10 دقائق)

### 1️⃣ إنشاء مستودع على GitHub
- اذهب إلى [github.com](https://github.com) → **New repository**
- اسم المستودع: `shugly`
- اختر **Public** ⚠️ (مطلوب للنشر المجاني)
- اضغط **Create repository**

### 2️⃣ تحديث package.json
افتح `package.json` وتأكد من السطر:
```json
"homepage": "https://ya95hya.github.io/shugly"
```
يجب أن يكون موجوداً وصحيحاً.

### 3️⃣ رفع المشروع
```bash
cd shugly
git init
git add .
git commit -m "Ready for GitHub Pages"
git branch -M main
git remote add origin https://github.com/ya95hya/shugly.git
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
- أضف: `ya95hya.github.io`

## ✅ تم!

موقعك الآن على: `https://ya95hya.github.io/shugly`

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

