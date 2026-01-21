require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const fs = require('fs');

const app = express();
const PORT = 3000;
const REGISTRATIONS_FILE = path.join(__dirname, 'registrations.json');
const LOGIN_LOGS_FILE = path.join(__dirname, 'login_logs.json');

// Helper to load file
function loadFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]', 'utf8');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error loading ${filePath}:`, err);
        return [];
    }
}

// Helper to save user
function saveUserToDB(user) {
    let registrations = loadFile(REGISTRATIONS_FILE);
    let loginLogs = loadFile(LOGIN_LOGS_FILE);

    // Check if user exists in registrations
    const existingUserIndex = registrations.findIndex(u => u.email === user.email);
    let action = 'login';

    if (existingUserIndex === -1) {
        // --- SIGNUP CASE ---
        action = 'signup';

        // Add to registrations.json
        const newUser = {
            ...user,
            signupDate: new Date().toISOString()
        };
        registrations.push(newUser);
        fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), 'utf8');
        console.log(`🆕 User Registered: ${user.email}`);
    } else {
        // --- LOGIN CASE ---
        // Optional: Update user details in registration if they changed (like profile pic)
        // For now, we just acknowledge they exist
        console.log(`👤 User Logged In: ${user.email}`);
    }

    // --- LOG ENTRY ---
    // Always add to login_logs.json
    const logEntry = {
        email: user.email,
        username: user.username,
        provider: user.provider,
        timestamp: new Date().toISOString(),
        action: action
    };

    loginLogs.push(logEntry);
    fs.writeFileSync(LOGIN_LOGS_FILE, JSON.stringify(loginLogs, null, 2), 'utf8');

    return action;
}

// Middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming Request: ${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});



// Microsoft Strategy Config
passport.use(new MicrosoftStrategy({
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URI,
    scope: ['user.read'],
    tenant: process.env.AZURE_TENANT_ID,
    authorizationURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`,
    tokenURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
},
    function (accessToken, refreshToken, profile, done) {
        console.log('✅ User Profile Received:', profile);
        // Create user object properly
        const user = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile.id,
            provider: 'microsoft'
        };



        return done(null, user);
    }
));

// Google Strategy Config
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        console.log('✅ Google Profile Received:', profile);
        const user = {
            id: profile.id,
            username: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile.id,
            provider: 'google'
        };



        return done(null, user);
    }
));
// Google OAuth Routes - Moved to top for priority
app.get('/auth/google', (req, res, next) => {
    console.log('🔵 Google Auth Route hit');
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log('✅ Google Authentication successful!');

        // Save to DB and get action type
        const action = saveUserToDB(req.user);

        req.session.user = req.user;
        res.redirect(`/welcome?type=${action}`);
    }
);

// Serve static files
app.use(express.static(path.join(__dirname, 'Login_Page')));

// In-memory user storage -> Replaced by JSON file system
// const users = [];

// API Routes
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const registrations = loadFile(REGISTRATIONS_FILE);
    const existingUser = registrations.find(u => u.email === email || u.username === username);
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'User already exists.' });
    }

    const newUser = { username, email, password, provider: 'local' };

    // Save to Database
    saveUserToDB(newUser);

    // Auto-login: Create session immediately
    req.session.user = newUser;

    console.log('User registered and logged in:', username);
    res.json({ success: true, message: 'Signup successful!' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const registrations = loadFile(REGISTRATIONS_FILE);

    // Find user with matching credentials
    const user = registrations.find(u => u.username === username && u.password === password);

    if (user) {
        // Log this login event
        saveUserToDB(user);

        req.session.user = user;
        res.json({ success: true, message: 'Login successful!' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
});

// Test route to verify routing works
app.get('/test', (req, res) => {
    console.log('✅ Test route hit!');
    res.send('Server is working! OAuth routing should work.');
});

// Route to view all users (Debug purpose)
app.get('/users', (req, res) => {
    const registrations = loadFile(REGISTRATIONS_FILE);
    const logs = loadFile(LOGIN_LOGS_FILE);
    res.json({
        total_users: registrations.length,
        registrations: registrations,
        recent_activity: logs
    });
});

// Microsoft OAuth Routes
app.get('/auth/microsoft',
    (req, res, next) => {
        console.log('🔵 Starting Microsoft OAuth flow...');
        passport.authenticate('microsoft', {
            prompt: 'select_account',
            failureRedirect: '/'
        })(req, res, next);
    }
);

app.get('/auth/microsoft/callback',
    (req, res, next) => {
        console.log('🔵 Microsoft callback received');
        console.log('Query params:', req.query);
        next();
    },
    passport.authenticate('microsoft', {
        failureRedirect: '/auth-failure',
        failureMessage: true
    }),
    (req, res) => {
        // Successful authentication
        console.log('✅ Authentication successful!');
        console.log('User:', req.user);

        // Save to DB and get action type
        const action = saveUserToDB(req.user);

        req.session.user = req.user;
        res.redirect(`/welcome?type=${action}`);
    }
);



// Error handling for authentication failures
app.use((err, req, res, next) => {
    console.error('❌ Authentication Error:', err);
    console.error('Error details:', {
        message: err.message,
        stack: err.stack
    });
    res.redirect('/?error=auth_failed');
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy();
        res.redirect('/');
    });
});

// Welcome page (protected)
app.get('/welcome', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'Login_Page', 'welcome.html'));
    } else {
        res.redirect('/');
    }
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login_Page', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Microsoft OAuth configured successfully!');
    console.log('Google OAuth configured successfully!');
});
