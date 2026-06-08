# Login System Implementation

## Overview
A simple authentication system has been implemented using SvelteKit and MariaDB with the following features:

## Features

### User Registration (Signup)
- Users can create an account with:
  - Username
  - Email
  - Password (minimum 6 characters)
- Duplicate username check
- Validation of all required fields

### User Login
- Login with:
  - Username
  - Password
- Session management via HTTP-only cookies
- 7-day session expiry

### User Logout
- Clears the session cookie
- Redirects to home page

### Profile Page
- View user information (username and email)
- Protected route - requires authentication
- Redirects to login if not authenticated

## Files Created

### Backend
- **`src/lib/db.js`** - Database connection pool and query execution
- **`src/hooks.server.js`** - Server-side hook to load user from session cookie
- **`src/routes/api/signup/+server.js`** - API endpoint for user registration
- **`src/routes/api/login/+server.js`** - API endpoint for user login
- **`src/routes/api/logout/+server.js`** - API endpoint for user logout
- **`src/routes/+layout.js`** - Load user data into page data

### Frontend
- **`src/routes/login/+page.svelte`** - Login page with form
- **`src/routes/signup/+page.svelte`** - Signup page with form
- **`src/routes/profile/+page.svelte`** - User profile page
- **`src/routes/profile/+page.js`** - Profile page loader (auth check)
- **`src/routes/+layout.svelte`** - Updated with user display and logout

## Database Requirements

Your MariaDB database must have a `users` table with the following columns:
- `id` (INT, PRIMARY KEY, AUTO INCREMENT)
- `username` (VARCHAR)
- `password` (VARCHAR)
- `email` (VARCHAR)
- `created_at` (TIMESTAMP)

## Environment Variables

The `.env` file is used to configure database connection:
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name

## Usage

1. Visit `/signup` to create a new account
2. Visit `/login` to log in with your username and password
3. Once logged in, you'll see your username in the header
4. Visit `/profile` to view your profile information
5. Click the "Logout" button to log out

## Security Notes

⚠️ **Important**: This is a basic implementation for learning purposes. For production:
- Implement password hashing (bcrypt, argon2)
- Use HTTPS only
- Implement CSRF protection
- Add rate limiting to prevent brute force attacks
- Use secure session management (e.g., Redis)
- Validate and sanitize all inputs
- Add password reset functionality
- Consider using OAuth/JWT instead of simple cookies

## Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5174` (or the next available port if 5174 is in use).
