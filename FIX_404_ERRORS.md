# إصلاح أخطاء 404 على GitHub Pages

## المشكلة:
- الملفات تحاول التحميل من `/shugly-iraq/` بدلاً من `/shugly/`
- manifest.json وغيرها تعطي 404

## الحل:

### الخطوة 1: احذف مجلد build القديم

```powershell
# في مجلد shugly
Remove-Item -Recurse -Force build
```

### الخطوة 2: أعد بناء المشروع

```powershell
npm run build
```

### الخطوة 3: تحقق من ملف build/index.html

افتح `build/index.html` وتأكد أن جميع المسارات تبدأ بـ `/shugly/` وليس `/shugly-iraq/`

### الخطوة 4: النشر

```powershell
git add .
git commit -m "Fix paths for GitHub Pages"
git push
```

---

## حل بديل: تنظيف الكاش

### في المتصفح:

1. افتح Developer Tools (F12)
2. اضغط زر الفأرة الأيمن على زر Refresh
3. اختر **Empty Cache and Hard Reload**

### أو:

1. اضغط `Ctrl + Shift + Delete`
2. اختر **Cached images and files**
3. اضغط **Clear data**

---

## التحقق:

بعد النشر:
1. انتظر 2-3 دقائق
2. افتح: https://ya95hya.github.io/shugly
3. افتح Console (F12)
4. تأكد من عدم وجود أخطاء 404

