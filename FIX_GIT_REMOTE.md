# حل مشكلة Git Remote

## المشكلة:
```
remote: Repository not found.
fatal: repository 'https://github.com/YOUR_USERNAME/shugly-iraq.git/' not found
```

## الحل:

### الخطوة 1: احذف الـ remote القديم

في PowerShell (في مجلد المشروع):

```powershell
git remote remove origin
```

### الخطوة 2: أضف الـ remote الصحيح

```powershell
git remote add origin https://github.com/ya95hya/shugly.git
```

### الخطوة 3: تحقق من الـ remote

```powershell
git remote -v
```

يجب أن ترى:
```
origin  https://github.com/ya95hya/shugly.git (fetch)
origin  https://github.com/ya95hya/shugly.git (push)
```

### الخطوة 4: ارفع المشروع

```powershell
git push -u origin main
```

---

## إذا ظهرت رسالة تفيد بأن المستودع غير موجود على GitHub:

### يجب أولاً إنشاء المستودع على GitHub:

1. اذهب إلى [github.com](https://github.com) وسجل الدخول
2. اضغط على زر **"+"** → **"New repository"**
3. **Repository name:** `shugly`
4. اختر **Public** ⚠️ (مطلوب للنشر المجاني)
5. **لا تضع** علامة على "Initialize with README"
6. اضغط **"Create repository"**

ثم كرر الخطوات من 1-4 أعلاه.

---

## الأوامر الكاملة (نسخ ولصق):

```powershell
# احذف الـ remote القديم
git remote remove origin

# أضف الـ remote الصحيح
git remote add origin https://github.com/ya95hya/shugly.git

# تحقق
git remote -v

# ارفع
git push -u origin main
```

---

## إذا كانت المشكلة مستمرة:

تأكد من:
1. ✅ المستودع `shugly` موجود على GitHub
2. ✅ اسم المستخدم `ya95hya` صحيح
3. ✅ لديك صلاحيات للوصول للمستودع
4. ✅ سجلت الدخول في Git (git config user.name و user.email)

