# Session Management - User Login Persistence

## How It Works

### User Login Flow

1. **User logs in** at `/signup` (login mode)
2. **Backend validates** credentials
3. **User data saved** to `localStorage`
4. **Redirect to** `/profile`
5. **Session persists** until logout

---

## Session Storage

### What is Stored
```javascript
localStorage.setItem('user', JSON.stringify({
  _id: "user_id",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  isVerified: true,
  isActive: true,
  createdAt: "2024-01-01T00:00:00.000Z"
}));
```

### Session Persistence

✅ **Persists across:**
- Page refreshes
- Browser tabs
- Browser restarts (until logout)

❌ **Cleared when:**
- User clicks "Logout"
- User clears browser data
- localStorage is manually cleared

---

## Profile Page Protection

### Current Implementation

```javascript
useEffect(() => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    // No user logged in, redirect to signup
    navigate('/signup');
    return;
  }
  
  // User is logged in, load profile
  const parsedUser = JSON.parse(userData);
  setUser(parsedUser);
}, [navigate]);
```

### How It Works

1. **Profile page loads**
2. **Checks localStorage** for user data
3. **If user exists:** Show profile
4. **If no user:** Redirect to signup/login

---

## User Journey

### Scenario 1: New User Signup
```
1. Visit /signup
2. Fill signup form
3. Receive OTP email
4. Enter OTP
5. Account verified
6. Switch to login mode
7. Login with credentials
8. → Saved to localStorage
9. → Redirect to /profile
10. ✅ Stay logged in
```

### Scenario 2: Existing User Login
```
1. Visit /signup
2. Click "Login" toggle
3. Enter email + password
4. Login successful
5. → Saved to localStorage
6. → Redirect to /profile
7. ✅ Stay logged in
```

### Scenario 3: Page Refresh
```
1. User is on /profile
2. User refreshes page (F5)
3. → Check localStorage
4. → User data found
5. ✅ Profile loads (still logged in)
```

### Scenario 4: Close & Reopen Browser
```
1. User is logged in
2. User closes browser
3. User reopens browser
4. User visits /profile
5. → Check localStorage
6. → User data found
7. ✅ Profile loads (still logged in)
```

### Scenario 5: Logout
```
1. User clicks "Logout" button
2. → localStorage.removeItem('user')
3. → Redirect to home page
4. ❌ User logged out
5. If user visits /profile → Redirect to /signup
```

---

## Testing Session Persistence

### Test 1: Login & Refresh
1. Login at http://localhost:5174/signup
2. Go to profile
3. Press F5 (refresh)
4. ✅ Should stay on profile (logged in)

### Test 2: Login & Close Browser
1. Login at http://localhost:5174/signup
2. Go to profile
3. Close browser completely
4. Reopen browser
5. Go to http://localhost:5174/profile
6. ✅ Should show profile (still logged in)

### Test 3: Logout
1. Login and go to profile
2. Click "Logout" button
3. ✅ Should redirect to home
4. Try to visit /profile
5. ✅ Should redirect to /signup

### Test 4: Direct Profile Access
1. Without logging in, visit http://localhost:5174/profile
2. ✅ Should redirect to /signup

---

## Profile Data Updates

### Editing Profile
```javascript
const handleSave = () => {
  // Update localStorage with new data
  const updatedUser = { ...user, ...formData };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  setUser(updatedUser);
  setIsEditing(false);
};
```

### What Happens
1. User edits profile (name, phone, address)
2. Clicks "Save Changes"
3. → Updates localStorage
4. → Updates UI
5. ✅ Changes persist across refreshes

---

## Security Notes

### What is Stored
- ✅ User profile data (name, email, address)
- ✅ Account status (verified, active)
- ❌ Password (never stored in frontend)
- ❌ Sensitive tokens (not needed for basic profile)

### localStorage Security
- Data is stored in browser
- Accessible only to your domain
- Not encrypted (don't store sensitive data)
- Cleared on logout

---

## Summary

✅ **User stays logged in** until they click logout
✅ **Session persists** across page refreshes
✅ **Session persists** across browser restarts
✅ **Profile accessible** anytime while logged in
✅ **Profile protected** - redirects to login if not authenticated
✅ **Profile updates** saved to localStorage

The system works exactly like major websites (Gmail, Facebook, etc.) - you stay logged in until you explicitly logout!
