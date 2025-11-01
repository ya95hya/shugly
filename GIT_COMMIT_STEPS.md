# خطوات رفع التغييرات على GitHub

## أنت حالياً في مجلد `build`

يجب الانتقال للمجلد الرئيسي أولاً.

---

## الخطوات:

### 1. الانتقال للمجلد الرئيسي

```powershell
cd ..
```

### 2. إضافة جميع التغييرات

```powershell
git add .
```

### 3. Commit التغييرات

```powershell
git commit -m "Remove Firebase config values - use environment variables"
```

### 4. رفع على GitHub

```powershell
git push
```

---

## الأوامر الكاملة (نسخ ولصق):

```powershell
cd ..
git add .
git commit -m "Remove Firebase config values - use environment variables"
git push
```

---

## ملاحظة:

- ✅ ملف `.env.local` لن يُرفع (محمي بـ .gitignore)
- ✅ القيم الحساسة ستُحذف من GitHub بعد الرفع
- ✅ الكود الجديد آمن وآمن

