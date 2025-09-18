# JWT Authentication Flow for Fishing Maps App

## 🔐 How JWT Authentication Works:

### **1. User Login Process**

```
1. User submits login (email + password)
2. Server verifies credentials against database
3. If valid, server creates JWT with user info
4. Server sends JWT back to client
5. Client stores JWT (localStorage or httpOnly cookie)
```

### **2. Making Authenticated Requests**

```
1. Client sends JWT in request header
2. Server verifies JWT signature
3. If valid, server processes request
4. If invalid/expired, server returns 401 error
```

### **3. JWT Content for Fishing App**

```json
{
  // Standard claims
  "sub": "user_123", // User ID
  "iat": 1694889600, // Issued at (timestamp)
  "exp": 1694976000, // Expires at (24 hours later)

  // Custom claims for your app
  "email": "angler@example.com",
  "username": "proFisher",
  "role": "user", // or "admin"
  "preferences": {
    "units": "metric",
    "privacy": "public"
  }
}
```

## 🎣 JWT in Your Fishing App Context:

### **User Authentication:**

- Login to save fish catches
- Access personal statistics
- View private fishing spots
- Sync data across devices

### **Protected Routes:**

```typescript
// Routes that need authentication:
- /profile              // User profile
- /my-catches          // Personal catch history
- /statistics          // Personal stats
- /add-catch           // Log new catch
- /private-lakes       // Private fishing spots
```

### **API Endpoints with JWT:**

```typescript
// Headers for authenticated requests:
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Protected API calls:
POST /api/fish-catch     // Add new catch
GET  /api/user/catches   // Get user's catches
GET  /api/user/stats     // Get user statistics
PUT  /api/user/profile   // Update profile
```

## 🔒 Security Benefits:

### **✅ Stateless Authentication**

- Server doesn't need to store session data
- Scales well with multiple servers
- Works great with serverless functions

### **✅ Self-Contained**

- Contains all user info needed
- No database lookup required for basic auth
- Fast authorization checks

### **✅ Secure**

- Digitally signed (can't be tampered with)
- Can be encrypted for extra security
- Automatic expiration

## ⚠️ Security Considerations:

### **Token Storage:**

```typescript
// ✅ Good: httpOnly cookie (most secure)
// ✅ OK: localStorage (convenient but vulnerable to XSS)
// ❌ Bad: Regular cookie (vulnerable to CSRF)
```

### **Token Expiration:**

```typescript
// Short-lived access token (15-60 minutes)
// Long-lived refresh token (7-30 days)
// Auto-refresh before expiration
```

## 🛠️ Implementation Example:

### **Login API Route:**

```typescript
// /api/auth/login
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Verify user credentials
  const user = await verifyUser(email, password);

  if (user) {
    // Create JWT
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json({ token, user });
  }
}
```

### **Protected API Route:**

```typescript
// /api/fish-catch
export async function POST(request: NextRequest) {
  // Extract JWT from header
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  try {
    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = payload.sub;

    // Process authenticated request
    const catchData = await request.json();
    catchData.user_id = userId; // Add user ID to catch

    // Save to database...
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

## 🎯 Why JWT is Perfect for Your Fishing App:

1. **Mobile-friendly**: Works great with mobile apps
2. **Offline-capable**: User info stored in token
3. **Scalable**: No server-side session storage needed
4. **Cross-domain**: Works across different subdomains
5. **API-first**: Perfect for React frontend + API backend

JWT makes your fishing app secure while keeping user authentication simple and scalable!
