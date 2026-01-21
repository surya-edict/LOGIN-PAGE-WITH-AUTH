# 🔐 Login Page with OAuth Authentication

A fully functional user authentication system built with **Node.js** and **Express.js**, featuring login/signup capabilities using both traditional credentials and modern **OAuth 2.0** social logins via **Google** and **Microsoft**.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Project Structure](#-project-structure)
5. [Prerequisites](#-prerequisites)
6. [Installation Guide](#-installation-guide)
7. [Environment Configuration](#-environment-configuration)
8. [OAuth Setup Guide](#-oauth-setup-guide)
   - [Google OAuth Setup](#google-oauth-setup)
   - [Microsoft OAuth Setup](#microsoft-oauth-setup)
9. [How Authentication Works](#-how-authentication-works)
10. [API Endpoints Reference](#-api-endpoints-reference)
11. [Database Schema](#-database-schema)
12. [Running the Application](#-running-the-application)
13. [Implementation Details](#-implementation-details)
14. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

This project implements a **Smart Authentication System** that allows users to:

- Register and login using a traditional username/email/password form
- Login/Signup seamlessly using their **Google Account**
- Login/Signup seamlessly using their **Microsoft Account** (Personal or Work/School)

### The "Smart" Approach

Unlike typical implementations that require separate "Sign Up" and "Login" buttons for social providers, our system uses a **unified approach**:

- When a user clicks "Login with Google", the system automatically checks if they are a new or existing user
- **New users** are registered automatically and redirected to a welcome page
- **Existing users** are logged in instantly

This eliminates friction and provides a seamless user experience.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔑 Local Authentication | Traditional username/password login and registration |
| 🔵 Google OAuth | One-click login/signup using Google accounts |
| 🟦 Microsoft OAuth | One-click login/signup using Microsoft accounts (Personal & Work) |
| 🧠 Smart User Detection | Automatically determines if user is new or existing |
| 💾 Persistent Storage | All user data stored in JSON files |
| 📝 Activity Logging | Every login/signup event is logged with timestamps |
| 🔒 Session Management | Secure cookie-based session handling |
| 🎨 Clean UI | Modern, responsive Bootstrap-based interface |

---

## 🛠 Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | JavaScript runtime environment |
| Express.js | 5.2.1 | Web application framework |
| Passport.js | 0.7.0 | Authentication middleware |
| passport-google-oauth20 | 2.0.0 | Google OAuth 2.0 strategy |
| passport-microsoft | 2.1.0 | Microsoft OAuth 2.0 strategy |
| express-session | 1.18.2 | Session management |
| dotenv | 17.2.3 | Environment variable management |

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS3 | Custom styling |
| Bootstrap 4.5.2 | Responsive UI components |
| Vanilla JavaScript | Form handling and UI interactions |

### Data Storage
| File | Purpose |
|------|---------|
| `registrations.json` | Stores all registered user accounts |
| `login_logs.json` | Stores all login/signup activity logs |

---

## 📁 Project Structure

```
Simple-Login-Page/
│
├── 📁 Login_Page/              # Frontend files
│   ├── login.html              # Main login/signup page
│   ├── login.js                # Frontend JavaScript logic
│   ├── style.css               # Custom CSS styles
│   ├── welcome.html            # Post-login welcome page
│   └── debug.html              # Debug/testing page
│
├── 📁 node_modules/            # NPM dependencies (auto-generated)
│
├── 📄 server.js                # Main Express server (THE BRAIN)
├── 📄 package.json             # Project dependencies and metadata
├── 📄 package-lock.json        # Locked dependency versions
│
├── 📄 .env                     # Environment variables (SECRETS - NOT in Git)
├── 📄 .gitignore               # Files to exclude from Git
│
├── 📄 registrations.json       # User database (auto-generated)
├── 📄 login_logs.json          # Activity logs (auto-generated)
├── 📄 users.json               # Additional user data
│
└── 📄 README.md                # This file
```

---

## 📦 Prerequisites

Before setting up this project, ensure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **A Google Cloud Console Account** - [console.cloud.google.com](https://console.cloud.google.com/)
4. **A Microsoft Azure Account** - [portal.azure.com](https://portal.azure.com/)
5. **Git** (optional, for version control)

---

## 🚀 Installation Guide

### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/surya-edict/LOGIN-PAGE-WITH-AUTH.git
cd LOGIN-PAGE-WITH-AUTH
```

### Step 2: Install Dependencies

Run the following command to install all required Node.js packages:

```bash
npm install
```

This will install:
- express
- express-session
- passport
- passport-google-oauth20
- passport-microsoft
- passport-azure-ad
- dotenv

### Step 3: Create Environment File

Create a file named `.env` in the root directory:

```bash
touch .env
```

(On Windows, you can create it manually or use: `echo. > .env`)

### Step 4: Configure Environment Variables

Open `.env` and add your configuration (see next section for details).

### Step 5: Start the Server

```bash
node server.js
```

The server will start at: **http://localhost:3000**

---

## 🔧 Environment Configuration

Create a `.env` file in the root directory with the following variables:

```ini
# Session Configuration
SESSION_SECRET=your_random_secret_string_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft Azure OAuth Credentials
AZURE_CLIENT_ID=your_azure_application_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret_value
AZURE_TENANT_ID=common
REDIRECT_URI=http://localhost:3000/auth/microsoft/callback
```

### Variable Explanations

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | A random string used to encrypt session cookies. Generate using: `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console |
| `AZURE_CLIENT_ID` | Application (client) ID from Azure App Registration |
| `AZURE_CLIENT_SECRET` | Client secret value from Azure App Registration |
| `AZURE_TENANT_ID` | Use `common` to allow all account types, or your specific tenant ID |
| `REDIRECT_URI` | The callback URL configured in Azure (must match exactly) |

---

## 🔐 OAuth Setup Guide

### Google OAuth Setup

#### Step 1: Go to Google Cloud Console
Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/)

#### Step 2: Create a New Project
1. Click the project dropdown at the top
2. Click "New Project"
3. Name it (e.g., "Login Page Auth")
4. Click "Create"

#### Step 3: Enable OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (for testing with any Google account)
3. Fill in the required fields:
   - App name: `Login Page`
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. On Scopes page, click "Add or Remove Scopes"
6. Select: `email`, `profile`, `openid`
7. Save and continue through remaining steps

#### Step 4: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Login Page Web Client`
5. Add Authorized redirect URIs:
   ```
   http://localhost:3000/auth/google/callback
   ```
6. Click "Create"
7. **Copy the Client ID and Client Secret** to your `.env` file

---

### Microsoft OAuth Setup

#### Step 1: Go to Azure Portal
Navigate to [https://portal.azure.com/](https://portal.azure.com/)

#### Step 2: Register a New Application
1. Search for **"App registrations"** in the search bar
2. Click **"New registration"**
3. Fill in the details:
   - Name: `Login Page Auth`
   - Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**
   - Redirect URI: 
     - Platform: **Web**
     - URL: `http://localhost:3000/auth/microsoft/callback`
4. Click "Register"

#### Step 3: Get Application (Client) ID
1. After registration, you'll see the **Application (client) ID**
2. Copy this to your `.env` as `AZURE_CLIENT_ID`

#### Step 4: Get Directory (Tenant) ID
1. On the same overview page, find **Directory (tenant) ID**
2. For multi-tenant support, use `common` in your `.env`

#### Step 5: Create a Client Secret
1. Go to **Certificates & secrets** in the left menu
2. Click **"New client secret"**
3. Add a description: `Login Page Secret`
4. Choose expiry: **24 months** (recommended)
5. Click "Add"
6. **IMPORTANT**: Copy the **Value** immediately (it won't be shown again!)
7. Paste it in your `.env` as `AZURE_CLIENT_SECRET`

#### Step 6: Configure API Permissions
1. Go to **API permissions** in the left menu
2. Click **"Add a permission"**
3. Select **Microsoft Graph**
4. Select **Delegated permissions**
5. Search and select: `User.Read`
6. Click "Add permissions"

---

## 🔄 How Authentication Works

### Traditional Login Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User enters   │───►│  Server checks  │───►│  Session created│
│   credentials   │    │  registrations  │    │  Redirect to    │
│   on login.html │    │  .json file     │    │  welcome.html   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### OAuth Flow (Google/Microsoft)

```
Step 1: User clicks "Login with Google"
         │
         ▼
Step 2: Browser redirects to /auth/google
         │
         ▼
Step 3: Server redirects to Google's login page
         │
         ▼
Step 4: User authenticates with Google
         │
         ▼
Step 5: Google redirects to /auth/google/callback with auth code
         │
         ▼
Step 6: Server exchanges code for access token
         │
         ▼
Step 7: Server fetches user profile (email, name)
         │
         ▼
Step 8: saveUserToDB() function executes:
         │
         ├─► Email exists in registrations.json?
         │   ├─► YES: Mark as "login", log activity
         │   └─► NO:  Mark as "signup", save new user
         │
         ▼
Step 9: Create session cookie
         │
         ▼
Step 10: Redirect to /welcome?type=login or /welcome?type=signup
```

### The Smart Detection Logic

Located in `server.js` - the `saveUserToDB()` function:

```javascript
function saveUserToDB(user) {
    let registrations = loadFile(REGISTRATIONS_FILE);
    
    // Check if user exists
    const existingUserIndex = registrations.findIndex(u => u.email === user.email);
    
    if (existingUserIndex === -1) {
        // NEW USER - Signup
        action = 'signup';
        registrations.push(newUser);
        fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
    } else {
        // EXISTING USER - Login
        action = 'login';
    }
    
    // Log the activity
    loginLogs.push(logEntry);
    fs.writeFileSync(LOGIN_LOGS_FILE, JSON.stringify(loginLogs, null, 2));
    
    return action;
}
```

---

## 📡 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serves the login page |
| GET | `/welcome` | Protected welcome page (requires session) |
| GET | `/logout` | Destroys session and redirects to login |
| GET | `/users` | Debug endpoint - lists all users and activity |
| GET | `/test` | Health check endpoint |

### OAuth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiates Google OAuth flow |
| GET | `/auth/google/callback` | Handles Google OAuth callback |
| GET | `/auth/microsoft` | Initiates Microsoft OAuth flow |
| GET | `/auth/microsoft/callback` | Handles Microsoft OAuth callback |

### API Endpoints

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/signup` | `{ username, email, password }` | Register new user |
| POST | `/api/login` | `{ username, password }` | Login existing user |

---

## 💾 Database Schema

### registrations.json

Stores all registered users:

```json
[
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "hashed_password",
    "provider": "local",
    "signupDate": "2026-01-20T10:30:00.000Z"
  },
  {
    "id": "google_user_id",
    "username": "Jane Doe",
    "email": "jane@gmail.com",
    "provider": "google",
    "signupDate": "2026-01-20T11:00:00.000Z"
  }
]
```

### login_logs.json

Stores all authentication activity:

```json
[
  {
    "email": "john@example.com",
    "username": "john_doe",
    "provider": "local",
    "timestamp": "2026-01-20T10:30:00.000Z",
    "action": "signup"
  },
  {
    "email": "john@example.com",
    "username": "john_doe",
    "provider": "local",
    "timestamp": "2026-01-20T12:00:00.000Z",
    "action": "login"
  }
]
```

---

## ▶️ Running the Application

### Development Mode

```bash
node server.js
```

### What You'll See in Console

```
Server running at http://localhost:3000
Microsoft OAuth configured successfully!
Google OAuth configured successfully!
```

### Testing the Authentication

1. Open browser: **http://localhost:3000**
2. Try local signup with username/email/password
3. Try "Login with Google" button
4. Try "Login with Microsoft" button
5. Check `registrations.json` to verify users are saved
6. Check `login_logs.json` to verify activity is logged

---

## 🔍 Implementation Details

### Key Files Explained

#### `server.js` - The Application Core

| Section | Lines | Purpose |
|---------|-------|---------|
| Imports & Config | 1-16 | Load dependencies and define file paths |
| Helper Functions | 17-74 | `loadFile()` and `saveUserToDB()` for data management |
| Middleware | 76-103 | Session, JSON parsing, Passport initialization |
| Microsoft Strategy | 107-131 | Configure Microsoft OAuth with Azure endpoints |
| Google Strategy | 133-152 | Configure Google OAuth |
| Google Routes | 153-170 | Handle Google auth flow |
| API Routes | 178-220 | Handle local signup/login |
| Microsoft Routes | 239-271 | Handle Microsoft auth flow |
| Protected Routes | 293-305 | Welcome page and home route |

#### `Login_Page/login.html` - The UI

| Section | Purpose |
|---------|---------|
| Login Form | Username/password input with submit button |
| OAuth Buttons | Links to `/auth/google` and `/auth/microsoft` |
| Signup Form | Hidden by default, toggled via JavaScript |
| Form Toggle | Links to switch between login and signup views |

#### `Login_Page/login.js` - Frontend Logic

| Function | Purpose |
|----------|---------|
| Toggle handlers | Switch between login/signup forms |
| Login form submit | Send POST to `/api/login` |
| Signup form submit | Send POST to `/api/signup` with validation |

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot GET /auth/google"

**Cause**: Routes not properly registered  
**Solution**: Ensure Google routes are defined BEFORE `express.static()` middleware in `server.js`

#### 2. "Missing required parameter: client_id"

**Cause**: Environment variables not loaded  
**Solution**: 
- Verify `.env` file exists in root directory
- Check that `require('dotenv').config()` is at the top of `server.js`
- Restart the server after modifying `.env`

#### 3. "redirect_uri_mismatch" Error

**Cause**: Callback URL doesn't match exactly  
**Solution**: 
- Google: Go to Cloud Console → Credentials → Edit OAuth Client → Add exact redirect URI
- Microsoft: Go to Azure → App Registration → Authentication → Add exact redirect URI

#### 4. Microsoft Login Shows "AADSTS50011" Error

**Cause**: Reply URL not configured  
**Solution**: Add `http://localhost:3000/auth/microsoft/callback` to Azure App Registration

#### 5. Session Not Persisting

**Cause**: Session secret not set properly  
**Solution**: Ensure `SESSION_SECRET` is defined in `.env` with a strong random string

---

## 👨‍💻 Author

Developed as part of the internship project for implementing modern authentication systems.

---

## 📄 License

ISC License

---

## 🙏 Acknowledgments

- [Passport.js Documentation](http://www.passportjs.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
