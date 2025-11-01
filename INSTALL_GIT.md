# حل مشكلة Git غير مثبت

## ❌ المشكلة
```
git : The term 'git' is not recognized
```

## ✅ الحلول المتاحة

---

## الحل 1: تثبيت Git (موصى به - 5 دقائق)

### الخطوات:

1. **نزل Git:**
   - اذهب إلى: https://git-scm.com/download/win
   - اضغط **Download** (سيختار الإصدار المناسب تلقائياً)
   - حجم التحميل: ~50 MB

2. **ثبت Git:**
   - افتح الملف المحمل (مثل: `Git-2.xx.x-64-bit.exe`)
   - اضغط **Next** في جميع الخطوات (الإعدادات الافتراضية جيدة)
   - ⚠️ **مهم:** في خطوة "Adjusting your PATH environment":
     - اختر **"Git from the command line and also from 3rd-party software"**
   - اضغط **Install** وانتظر حتى يكتمل التثبيت

3. **اختبر التثبيت:**
   - أغلق PowerShell الحالي
   - افتح PowerShell جديد
   - اكتب:
     ```powershell
     git --version
     ```
   - يجب أن يظهر شيء مثل: `git version 2.xx.x`

4. **أعد المحاولة:**
   ```powershell
   cd shugly
   git init
   ```

---

## الحل 2: استخدام GitHub Desktop (أسهل للمبتدئين)

### الخطوات:

1. **نزل GitHub Desktop:**
   - اذهب إلى: https://desktop.github.com
   - اضغط **Download for Windows**

2. **ثبت وافتح:**
   - ثبت التطبيق وافتحه
   - سجل دخول بحساب GitHub

3. **استخدم GitHub Desktop:**
   - **File** → **Add Local Repository**
   - اختر مجلد `shugly`
   - سيتعرف على Git تلقائياً
   - يمكنك Commit و Push من الواجهة

**مميزات:**
- ✅ واجهة رسومية سهلة
- ✅ لا تحتاج لتعلم أوامر Git
- ✅ مجاني تماماً

---

## الحل 3: رفع يدوي بدون Git

إذا كنت لا تريد تثبيت Git الآن، يمكنك:

1. اقرأ ملف: `GITHUB_MANUAL_UPLOAD.md`
2. ارفع الملفات يدوياً عبر GitHub Web Interface
3. استخدم GitHub Actions للنشر التلقائي (جاهز في المشروع)

---

## الحل 4: استخدام Vercel (بدون Git محلي)

يمكنك نشر الموقع مباشرة على Vercel بدون Git محلي:

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. **Add New Project**
4. يمكنك رفع الملفات مباشرة من جهازك

---

## توصياتي

1. **للمبتدئين:** استخدم **GitHub Desktop** (الحل 2)
2. **للمحترفين:** ثبت **Git** (الحل 1)
3. **للسرعة:** استخدم **Vercel** (الحل 4)
4. **بدون تثبيت:** ارفع يدوياً (الحل 3)

---

## بعد التثبيت

بمجرد تثبيت Git، يمكنك متابعة النشر:

```powershell
cd shugly
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shugly-iraq.git
git push -u origin main
npm run deploy
```

---

## روابط مفيدة

- **Git Download:** https://git-scm.com/download/win
- **GitHub Desktop:** https://desktop.github.com
- **Vercel:** https://vercel.com

