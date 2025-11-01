# Firestore Index Configuration

This document contains the required Firestore composite indexes for the Shugly application. You need to create these indexes in your Firebase Console to resolve the query errors.

## Required Indexes

### 1. Workers Collection Index
**Collection:** `workers`
**Fields:**
- `availability` (Ascending)
- `rating` (Descending)
- `__name__` (Descending)

**Purpose:** Used in `getWorkers()` function to fetch available workers sorted by rating.

**Firebase Console Link:**
```
https://console.firebase.google.com/v1/r/project/shugly/firestore/indexes?create_composite=CkZwcm9qZWN0cy9zaHVnbHkvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3dvcmtlcnMvaW5kZXhlcy9fEAEaEAoMYXZhaWxhYmlsaXR5EAEaCgoGcmF0aW5nEAIaDAoIX19uYW1lX18QAg
```

### 2. Bookings Collection Index
**Collection:** `bookings`
**Fields:**
- `userId` (Ascending)
- `createdAt` (Descending)
- `__name__` (Descending)

**Purpose:** Used in `getBookings()` function to fetch user bookings sorted by creation date.

**Firebase Console Link:**
```
https://console.firebase.google.com/v1/r/project/shugly/firestore/indexes?create_composite=Ckdwcm9qZWN0cy9zaHVnbHkvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2Jvb2tpbmdzL2luZGV4ZXMvXxABGgoKBnVzZXJJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
```

### 3. Messages Collection Index (Sender)
**Collection:** `messages`
**Fields:**
- `senderId` (Ascending)
- `timestamp` (Descending)
- `__name__` (Descending)

**Purpose:** Used in `ChatContext` to fetch messages sent by the current user.

**Firebase Console Link:**
```
https://console.firebase.google.com/v1/r/project/shugly/firestore/indexes?create_composite=Ckdwcm9qZWN0cy9zaHVnbHkvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL21lc3NhZ2VzL2luZGV4ZXMvXxABGgwKCHNlbmRlcklkEAEaDQoJdGltZXN0YW1wEAIaDAoIX19uYW1lX18QAg
```

## How to Create These Indexes

### Method 1: Using Firebase Console Links (Recommended)
1. Click on each of the Firebase Console links above
2. They will take you directly to the index creation page
3. Click "Create Index" for each one

### Method 2: Manual Creation
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`shugly`)
3. Navigate to Firestore Database
4. Click on the "Indexes" tab
5. Click "Create Index"
6. For each index:
   - Select the collection name
   - Add the fields in the specified order
   - Set the correct sort order (Ascending/Descending)
   - Click "Create"

## Additional Indexes You May Need

### 4. Bookings by Worker ID
**Collection:** `bookings`
**Fields:**
- `workerId` (Ascending)
- `createdAt` (Descending)
- `__name__` (Descending)

**Purpose:** For worker dashboard to fetch bookings for a specific worker.

### 5. Bookings by Status
**Collection:** `bookings`
**Fields:**
- `status` (Ascending)
- `createdAt` (Descending)
- `__name__` (Descending)

**Purpose:** For admin dashboard to fetch bookings by status.

### 6. Reviews by Worker ID
**Collection:** `reviews`
**Fields:**
- `workerId` (Ascending)
- `createdAt` (Descending)
- `__name__` (Descending)

**Purpose:** For fetching worker reviews.

## Index Creation Time

- **Single-field indexes:** Usually created instantly
- **Composite indexes:** Can take several minutes to hours depending on data size
- **Large collections:** May take longer to build

## Monitoring Index Status

1. Go to Firebase Console → Firestore → Indexes
2. Check the status of your indexes
3. Green checkmark = Ready
4. Yellow clock = Building
5. Red X = Error (check logs)

## Troubleshooting

If you continue to see index errors after creating the indexes:

1. **Wait for index building to complete** - This can take time
2. **Check index status** in Firebase Console
3. **Verify field names** match exactly (case-sensitive)
4. **Check sort order** (Ascending vs Descending)
5. **Clear browser cache** and refresh the application

## Testing

After creating the indexes:
1. Wait for all indexes to show "Ready" status
2. Refresh your application
3. The console errors should disappear
4. All queries should work properly

## Cost Considerations

- **Index storage:** Each index uses additional storage
- **Index maintenance:** Firebase automatically maintains indexes
- **Query performance:** Indexes improve query speed but use resources

For a small to medium application, the storage cost of these indexes is minimal.

