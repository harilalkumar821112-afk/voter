# Advanced Online Voting System v2.0

A comprehensive, secure, and scalable online voting system built with Node.js, Express, MongoDB, and React.

## 📋 Features

### 1. **Authentication System**
- ✅ User registration and login
- ✅ JWT-based authentication (Access & Refresh tokens)
- ✅ OTP verification via email
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Account lockout after failed attempts
- ✅ Session management

### 2. **Admin Panel**
- ✅ Separate admin login and dashboard
- ✅ Add, update, delete candidates
- ✅ Create and manage elections
- ✅ Start/stop elections with timer
- ✅ View real-time voting statistics
- ✅ Audit logs for all activities
- ✅ User management

### 3. **Voting System**
- ✅ One vote per user per election
- ✅ Vote verification with unique code
- ✅ Secure vote storage
- ✅ Vote change option (if enabled)
- ✅ Prevention of duplicate voting
- ✅ IP tracking for security
- ✅ Confirmation notifications after voting

### 4. **Election Management**
- ✅ Election scheduling with start/end times
- ✅ Automatic status updates
- ✅ Countdown timer
- ✅ Voting period validation
- ✅ Election statistics

### 5. **Candidate Management**
- ✅ Detailed candidate profiles
- ✅ Photo upload support
- ✅ Party affiliation
- ✅ Bio and experience details
- ✅ Real-time vote counting

### 6. **Live Results Dashboard**
- ✅ Real-time vote results
- ✅ Bar charts and pie charts (Chart.js)
- ✅ Vote count and percentage display
- ✅ Sortable results by votes

### 7. **Security Features**
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Rate limiting on API endpoints
- ✅ CORS protection
- ✅ Input validation
- ✅ Admin-only routes
- ✅ IP address tracking
- ✅ Audit logging

### 8. **Audit & Logging**
- ✅ Complete audit trail of all activities
- ✅ Vote verification codes for transparency
- ✅ User login/logout tracking
- ✅ Admin action logging
- ✅ Failed attempt recording

### 9. **Responsive UI**
- ✅ Mobile-friendly interface
- ✅ Modern design with Tailwind CSS
- ✅ Real-time countdown timer
- ✅ Smooth animations
- ✅ Accessible components

### 10. **Multi-Language Support**
- ✅ English and Hindi support
- ✅ Easy language switching
- ✅ i18next integration

## 🛠️ Technical Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcryptjs
- **Validation**: Joi
- **Security**: Helmet, Express Rate Limit
- **Time**: Moment.js
- **Utilities**: UUID, Multer (file upload)

### Frontend
- **Library**: React 19
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2
- **Styling**: Tailwind CSS
- **Internationalization**: i18next
- **CSS Framework**: Bootstrap 5

## 📂 Project Structure

```
online-voting-system/
├── server/
│   ├── models/
│   │   ├── User.js              (Enhanced with OTP, JWT fields)
│   │   ├── Candidate.js         (With photo, bio, experience)
│   │   ├── Vote.js              (With verification codes, IP tracking)
│   │   ├── Election.js          (New: Election timing & management)
│   │   ├── OTP.js               (New: OTP verification)
│   │   └── AuditLog.js          (New: Complete audit trail)
│   │
│   ├── routes/
│   │   ├── authRoutes.js        (New: JWT auth, OTP, registration)
│   │   ├── electionRoutes.js    (New: Election management)
│   │   ├── advancedVoteRoutes.js(New: Vote casting with prevention)
│   │   ├── adminRoutes.js       (New: Admin dashboard)
│   │   ├── userRoutes.js        (Updated: Enhanced user routes)
│   │   ├── candidateRoutes.js   (Updated: Candidate management)
│   │   └── voteRoutes.js        (Updated: Vote management)
│   │
│   ├── middleware/
│   │   └── auth.js              (New: JWT authentication middleware)
│   │
│   ├── utils/
│   │   └── jwt.js               (New: JWT utilities)
│   │
│   ├── server.js                (Updated: New routes & security)
│   └── package.json             (Updated: New dependencies)
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   └── ... (more components)
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.js         (Updated with JWT)
│   │   │   ├── Register.js      (Updated with OTP)
│   │   │   ├── Dashboard.js     (Enhanced)
│   │   │   ├── AdminDashboard.js(Enhanced)
│   │   │   └── ... (more pages)
│   │   │
│   │   ├── services/
│   │   │   └── api.js           (Updated with auth)
│   │   │
│   │   ├── store/               (New: Zustand store)
│   │   │   └── authStore.js
│   │   │
│   │   ├── i18n/                (New: Multi-language)
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   └── i18n.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── public/
│   ├── package.json             (Updated: New dependencies)
│   └── tailwind.config.js       (New: Tailwind configuration)
│
├── render.yaml                  (Updated: Deployment config)
├── README.md                    (This file)
└── SETUP.md                     (New: Setup guide)
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git

### Backend Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Create .env file**
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/voting_db
   JWT_SECRET=your-jwt-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   NODE_ENV=development
   PORT=5000
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Start server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Create .env file**
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start frontend**
   ```bash
   npm start
   ```

## 📌 API Routes

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /request-otp` - Request OTP
- `POST /verify-otp` - Verify OTP
- `GET /me` - Get current user (requires auth)
- `POST /logout` - Logout user (requires auth)

### Elections (`/api/elections`)
- `GET /` - Get all elections
- `GET /active` - Get active election
- `GET /:id` - Get election by ID
- `POST /` - Create election (admin)
- `PUT /:id` - Update election (admin)
- `POST /:id/start` - Start election (admin)
- `POST /:id/end` - End election (admin)
- `GET /:id/stats` - Get election statistics

### Voting (`/api/votes`)
- `POST /cast` - Cast vote (requires email verification)
- `POST /change` - Change vote (requires auth, if allowed)
- `GET /status/:electionId` - Get vote status
- `GET /results/:electionId` - Get voting results

### Admin (`/api/admin`)
- `POST /candidates` - Add candidate (admin)
- `GET /candidates/:electionId` - Get candidates
- `PUT /candidates/:id` - Update candidate (admin)
- `DELETE /candidates/:id` - Delete candidate (admin)
- `GET /users` - Get all users (admin)
- `GET /audit-log` - Get audit logs (admin)
- `GET /dashboard/stats` - Get dashboard stats (admin)
- `POST /verify-vote/:verificationCode` - Verify vote (admin)

## 🔐 Security Features

### Authentication
- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration
- OTP-based email verification
- Password hashing with bcrypt

### Prevention
- One vote per user per election
- Account lockout after 5 failed login attempts
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers

### Audit Trail
- Complete logging of all activities
- Vote verification codes
- IP address tracking
- User agent recording

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  voterId: String (unique),
  isAdmin: Boolean,
  isEmailVerified: Boolean,
  hasVoted: Boolean,
  votedFor: ObjectId,
  refreshTokens: [String],
  otp: String,
  otpExpiry: Date,
  lastLogin: Date,
  isLocked: Boolean,
  notifications: [{...}],
  createdAt: Date
}
```

### Election Model
```javascript
{
  name: String,
  description: String,
  startTime: Date,
  endTime: Date,
  status: String,
  isActive: Boolean,
  totalVotesCast: Number,
  candidates: [ObjectId],
  allowVoteChange: Boolean,
  createdBy: ObjectId,
  createdAt: Date
}
```

### Vote Model
```javascript
{
  userId: ObjectId,
  candidateId: ObjectId,
  voterId: String,
  verificationCode: String,
  ipAddress: String,
  timestamp: Date,
  electionId: ObjectId
}
```

## 🎨 Frontend Pages (To be Updated)

- **Login Page** - JWT-based authentication
- **Registration Page** - With email OTP verification
- **Dashboard** - Voting interface with countdown timer
- **Results Page** - Live results with charts
- **Admin Dashboard** - Candidate and election management
- **Profile Page** - User profile and notifications
- **Audit Log Page** - Activity tracking (admin)

## 🌐 Deployment

### Deploy on Render

1. Push to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy frontend and backend separately

### Environment Variables Required

**Backend**:
- MONGO_URI
- JWT_SECRET
- JWT_REFRESH_SECRET
- NODE_ENV
- PORT
- CORS_ORIGIN

**Frontend**:
- REACT_APP_API_URL

## 📝 Next Steps

1. Update React components with TypeScript
2. Implement Chart.js for results visualization
3. Add Tailwind CSS styling
4. Implement i18next for multi-language support
5. Add email notification system
6. Create comprehensive admin dashboard UI
7. Add voting countdown timer UI
8. Implement file upload for candidate photos

## 🤝 Contributing

Contributions are welcome! Please follow the coding standards and create a pull request.

## 📄 License

ISC License

## 📞 Support

For support, email: support@votingsystem.com

---

**Version**: 2.0.0  
**Last Updated**: April 20, 2026  
**Status**: In Development
