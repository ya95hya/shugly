# إصلاح تسريب Firebase Config على GitHub

## المشكلة:
تم رفع Firebase configuration مع القيم الحساسة على GitHub

## الحل:

### الخطوة 1: إنشاء ملف .env.local

أنشئ ملف `.env.local` في المجلد الرئيسي (`shugly`) وأضف:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyCExL-MtKKG3_SND8-qjH2M-MI5Vv2V-dY
REACT_APP_FIREBASE_AUTH_DOMAIN=shugly.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=shugly
REACT_APP_FIREBASE_STORAGE_BUCKET=shugly.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=71844095703
REACT_APP_FIREBASE_APP_ID=1:71844095703:web:85f731fb10e8dc8604f292
REACT_APP_FIREBASE_MEASUREMENT_ID=G-699XGN7K81
```

**ملاحظة:** ملف `.env.local` محمي بواسطة `.gitignore` ولن يتم رفعه على GitHub

---

### الخطوة 2: إزالة القيم من GitHub (مهم!)

القيم موجودة في تاريخ Git. يجب إزالتها:

#### الطريقة 1: استخدام BFG Repo-Cleaner (موصى به)
```bash
# نزل BFG من: https://rtyley.github.io/bfg-repo-cleaner/

# احذف القيم الحساسة
java -jar bfg.jar --replace-text passwords.txt

# تنظيف Git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### الطريقة 2: إعادة كتابة config.ts على GitHub
1. اذهب إلى: https://github.com/ya95hya/shugly
2. افتح `src/firebase/config.ts`
3. اضغط **Edit** (✏️)
4. استبدل القيم بأرقام وهمية:
   ```typescript
   const firebaseConfig = {
       apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
       authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
       projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
       storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
       messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
       appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
       measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || ""
   };
   ```
5. **Commit changes**

#### الطريقة 3: إنشاء مستودع جديد (أسهل)
إذا كان المستودع جديداً ولا يوجد commits مهمة:
1. احذف المستودع على GitHub
2. أنشئ مستودع جديد
3. ارفع الكود مع config.ts محدث

---

### الخطوة 3: تحديث config.ts محلياً

الملف `config.ts` محدث الآن ويستخدم متغيرات البيئة مع fallback values.

**للإنتاج:** يجب إزالة القيم الافتراضية تماماً:

```typescript
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.REACT_APP_FIREBASE_APP_ID!,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID!
};
```

---

### الخطوة 4: إعداد GitHub Actions (للنشر التلقائي)

في GitHub:
1. اذهب إلى المستودع → **Settings** → **Secrets and variables** → **Actions**
2. اضغط **New repository secret**
3. أضف كل متغير:
   - Name: `REACT_APP_FIREBASE_API_KEY`
   - Value: `AIzaSyCExL-MtKKG3_SND8-qjH2M-MI5Vv2V-dY`
4. كرر لجميع المتغيرات الأخرى

ثم حدّث `.github/workflows/deploy.yml`:

```yaml
- name: Build
  run: npm run build
  env:
    CI: false
    REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
    REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
    REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
    REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
    REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
    REACT_APP_FIREBASE_MEASUREMENT_ID: ${{ secrets.REACT_APP_FIREBASE_MEASUREMENT_ID }}
```

---

### الخطوة 5: تحديث Firebase Security Rules

1. اذهب إلى Firebase Console
2. **Firestore Database** → **Rules**
3. تأكد من أن القواعد محمية بشكل صحيح:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

---

## ملاحظات مهمة:

1. ✅ **Firebase API keys مصممة للعرض العام** - التحكم في الصلاحيات عبر Security Rules
2. ⚠️ **لكن من الأفضل إخفائها** لأسباب أمنية إضافية
3. ✅ **.env.local محمي** بواسطة .gitignore
4. ⚠️ **القيم موجودة في Git history** - تحتاج تنظيف إذا كان مستودع عام

---

## للتحقق:

1. ✅ تأكد أن `.env.local` موجود
2. ✅ تأكد أن `.env.local` في `.gitignore`
3. ✅ احذف القيم المباشرة من GitHub
4. ✅ اختبر التطبيق محلياً

