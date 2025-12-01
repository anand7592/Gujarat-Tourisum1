# 🏛️ Gujarat Tourism - Frontend Application

A comprehensive **Tourism Management System** built with **React**, **TypeScript**, and **Vite**. This frontend application provides a complete admin dashboard for managing tourist destinations, hotels, bookings, packages, and customer reviews across Gujarat, India.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Security Architecture](#security-architecture)
- [API Endpoints](#api-endpoints)
- [Pages & Routes](#pages--routes)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Development Workflow](#development-workflow)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**Gujarat Tourism** is a full-featured tourism management platform designed to streamline the administration of:

- **Tourist Destinations**: Main attractions and landmarks
- **Sub-Places**: Specific points of interest within destinations
- **Hotels**: Accommodation options with room types and pricing
- **Tour Packages**: Pre-designed itineraries with pricing and schedules
- **Bookings**: Reservation management with Razorpay payment integration
- **Ratings & Reviews**: Customer feedback system for places and hotels
- **User Management**: Admin and customer account administration

This frontend application communicates with a RESTful backend API and implements enterprise-level security measures including JWT authentication, protected routes, and HTTP-only cookie sessions.

---

## ✨ Key Features

### 🔐 **Security First**
- **JWT Token Authentication** with localStorage management
- **HTTP-Only Cookies** for secure session handling
- **Protected Routes** with server-side session verification
- **Role-Based Access Control** (Admin/User roles)
- **Automatic Token Refresh & Expiry Handling**

### 🎨 **Modern UI/UX**
- **Responsive Design** with Tailwind CSS v4
- **Shadcn UI Components** for consistent design system
- **Real-time Form Validation** using React Hook Form + Zod
- **Interactive Data Tables** with CRUD operations
- **Loading States & Error Handling** throughout the app

### 💳 **Payment Integration**
- **Razorpay Payment Gateway** integration
- **Test/Live Mode** support
- **Order Creation & Verification**
- **Payment Status Tracking**

### 📊 **Dashboard Analytics**
- **Statistics Overview** (Users, Places, Hotels, Bookings)
- **Revenue Tracking**
- **Recent Activities & Pending Items**
- **Quick Action Cards**

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend Framework** | React 19 | UI component library |
| **Language** | TypeScript 5.9 | Type-safe development |
| **Build Tool** | Vite 7.2 | Fast bundling & HMR |
| **Routing** | React Router DOM 7.9 | Client-side navigation |
| **State Management** | React Context API | Auth & global state |
| **HTTP Client** | Axios 1.13 | API communication |
| **Form Management** | React Hook Form 7.66 | Form state & validation |
| **Validation** | Zod 4.1 | Schema validation |
| **Styling** | Tailwind CSS 4.1 | Utility-first CSS |
| **UI Components** | Radix UI + Shadcn | Accessible components |
| **Icons** | Lucide React | Icon library |
| **Payment** | Razorpay 2.9 | Payment processing |
| **Linting** | ESLint 9.39 | Code quality |

---

## 📂 Project Structure

```
Gujarat-Tourisum1/
│
├── public/                          # Static assets
│
├── src/
│   ├── assets/                      # Images, fonts, etc.
│   │
│   ├── components/                  # Reusable components
│   │   ├── layout/                  # Layout components
│   │   │   ├── DashboardLayout.tsx  # Main dashboard wrapper
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   └── Navbar/              # Navigation components
│   │   │       ├── Navbar.tsx
│   │   │       ├── DesktopNavLinks.tsx
│   │   │       └── UserAvatarMenu.tsx
│   │   │
│   │   ├── ratings/                 # Rating components
│   │   │   ├── AddRatingDialog.tsx
│   │   │   ├── star-input.tsx
│   │   │   └── star-rating.tsx
│   │   │
│   │   ├── ui/                      # Shadcn UI components
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ... (other UI primitives)
│   │   │
│   │   ├── users/                   # User-specific components
│   │   │   └── UserTable.tsx
│   │   │
│   │   └── ProtectedRoute.tsx       # Route authentication guard
│   │
│   ├── context/                     # React Context providers
│   │   └── AuthContext.tsx          # Authentication state management
│   │
│   ├── hooks/                       # Custom React hooks
│   │
│   ├── lib/                         # Utility libraries
│   │   ├── api.ts                   # Axios instance & interceptors
│   │   ├── backendStatus.ts         # Backend health check
│   │   ├── debugAuth.ts             # Auth debugging utilities
│   │   ├── testRazorpay.ts          # Razorpay test utilities
│   │   └── utils.ts                 # Helper functions
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── auth/
│   │   │   ├── Login.tsx            # Login page
│   │   │   └── Register.tsx         # Registration page
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx        # Main dashboard
│   │   │
│   │   ├── users/
│   │   │   └── Users.tsx            # User management
│   │   │
│   │   ├── place/
│   │   │   ├── Place.tsx            # Places listing
│   │   │   ├── PlaceForm.tsx        # Add/Edit place
│   │   │   └── PlaceList.tsx        # Places table
│   │   │
│   │   ├── subPlace/
│   │   │   ├── SubPlace.tsx         # Sub-places listing
│   │   │   ├── SubPlaceForm.tsx     # Add/Edit sub-place
│   │   │   └── SubPlaceList.tsx     # Sub-places table
│   │   │
│   │   ├── hotels/
│   │   │   ├── Hotel.tsx            # Hotels listing
│   │   │   ├── HotelForm.tsx        # Add/Edit hotel
│   │   │   └── HotelList.tsx        # Hotels table
│   │   │
│   │   ├── packages/
│   │   │   ├── Package.tsx          # Packages listing
│   │   │   ├── PackageForm.tsx      # Add/Edit package
│   │   │   └── PackageList.tsx      # Packages table
│   │   │
│   │   ├── bookings/
│   │   │   ├── Bookings.tsx         # Bookings listing
│   │   │   ├── BookingForm.tsx      # Create booking
│   │   │   ├── BookingList.tsx      # Bookings table
│   │   │   └── Payment.tsx          # Payment processing
│   │   │
│   │   └── Ratings/
│   │       └── Ratings.tsx          # Ratings management
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   │
│   ├── App.tsx                      # Root component & routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
│
├── .env                             # Environment variables
├── components.json                  # Shadcn UI config
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML template
├── netlify.toml                     # Netlify deployment config
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite configuration
├── BOOKING_SETUP.md                 # Booking system guide
├── RAZORPAY_SETUP.md                # Payment setup guide
└── README.md                        # This file
```

---

## 🔒 Security Architecture

### **Multi-Layer Protection**

#### 1️⃣ **Authentication Flow**
```
Login → Backend Validates → Issues JWT Token + HTTP-Only Cookie
         ↓
Frontend stores JWT in localStorage + Cookie in browser
         ↓
On App Load → AuthContext verifies session with backend (/auth/me)
         ↓
If valid → Allow access | If invalid → Redirect to /login
```

#### 2️⃣ **Protected Routes**
```tsx
// ProtectedRoute Component
<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    {/* All admin routes */}
  </Route>
</Route>
```

**How it works:**
- Wraps all authenticated routes
- Shows loading spinner during session verification
- Redirects to `/login` if not authenticated
- Prevents unauthorized access to admin panel

#### 3️⃣ **HTTP-Only Cookies**
- Stored by backend automatically
- Cannot be accessed by JavaScript (XSS protection)
- Sent automatically with every API request (`withCredentials: true`)

#### 4️⃣ **Token Management**
```typescript
// Axios Request Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Axios Response Interceptor (Token Expiry Handling)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 5️⃣ **Session Verification**
```typescript
// AuthContext verifies user on mount
useEffect(() => {
  const verifyUser = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user); // Backend is the source of truth
  };
  verifyUser();
}, []);
```

---

## 🌐 API Endpoints

### **Authentication**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| GET | `/auth/logout` | Logout user | ✅ |

### **Users Management**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/users` | Get all users | ✅ | ✅ |
| POST | `/users` | Create new user | ✅ | ✅ |
| PUT | `/users/:id` | Update user | ✅ | ✅ |
| DELETE | `/users/:id` | Delete user | ✅ | ✅ |

### **Places (Tourist Destinations)**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/places` | Get all places | ✅ | ❌ |
| GET | `/places/:id` | Get place by ID | ✅ | ❌ |
| POST | `/places` | Create place | ✅ | ✅ |
| PUT | `/places/:id` | Update place | ✅ | ✅ |
| DELETE | `/places/:id` | Delete place | ✅ | ✅ |

### **Sub-Places (Points of Interest)**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/subplaces` | Get all sub-places | ✅ | ❌ |
| GET | `/subplaces/:id` | Get sub-place by ID | ✅ | ❌ |
| POST | `/subplaces` | Create sub-place | ✅ | ✅ |
| PUT | `/subplaces/:id` | Update sub-place | ✅ | ✅ |
| DELETE | `/subplaces/:id` | Delete sub-place | ✅ | ✅ |

### **Hotels**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/hotels` | Get all hotels | ✅ | ❌ |
| GET | `/hotels/:id` | Get hotel by ID | ✅ | ❌ |
| POST | `/hotels` | Create hotel | ✅ | ✅ |
| PUT | `/hotels/:id` | Update hotel | ✅ | ✅ |
| DELETE | `/hotels/:id` | Delete hotel | ✅ | ✅ |

### **Packages**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/packages` | Get all packages | ✅ | ❌ |
| GET | `/packages/:id` | Get package by ID | ✅ | ❌ |
| POST | `/packages` | Create package | ✅ | ✅ |
| PUT | `/packages/:id` | Update package | ✅ | ✅ |
| DELETE | `/packages/:id` | Delete package | ✅ | ✅ |

### **Bookings**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/bookings` | Get user's bookings | ✅ | ❌ |
| GET | `/bookings/:id` | Get booking by ID | ✅ | ❌ |
| POST | `/bookings` | Create new booking | ✅ | ❌ |
| DELETE | `/bookings/:id` | Cancel booking | ✅ | ❌ |
| PATCH | `/bookings/:id/status` | Update booking status | ✅ | ✅ |

### **Payment (Razorpay)**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bookings/:id/create-order` | Create Razorpay order | ✅ |
| POST | `/bookings/:id/verify-payment` | Verify payment signature | ✅ |

### **Ratings & Reviews**
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/ratings` | Get all ratings | ✅ | ❌ |
| POST | `/ratings` | Create rating | ✅ | ❌ |
| PUT | `/ratings/:id/respond` | Admin response | ✅ | ✅ |
| DELETE | `/ratings/:id` | Delete rating | ✅ | ✅ |

---

## 🗺️ Pages & Routes

### **Public Routes** (No Authentication Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `Login.tsx` | User login page with email/password |
| `/register` | `Register.tsx` | New user registration |
| `/` | Redirect | Redirects to `/login` |

### **Protected Routes** (Authentication Required)

All protected routes are wrapped in:
1. **`<ProtectedRoute />`** - Checks authentication status
2. **`<DashboardLayout />`** - Provides navbar & layout structure

| Route | Component | Description | Admin Only |
|-------|-----------|-------------|------------|
| `/dashboard` | `Dashboard.tsx` | Main analytics dashboard | ❌ |
| `/dashboard/user` | `Users.tsx` | User management (CRUD) | ✅ |
| `/dashboard/place` | `Place.tsx` | Tourist places management | ✅ |
| `/dashboard/subplace` | `SubPlaces.tsx` | Sub-places management | ✅ |
| `/dashboard/hotel` | `Hotels.tsx` | Hotels management | ✅ |
| `/dashboard/package` | `Package.tsx` | Tour packages management | ✅ |
| `/dashboard/bookings` | `Bookings.tsx` | Booking management | ❌ |
| `/dashboard/booking/:id/payment` | `Payment.tsx` | Payment processing page | ❌ |
| `/dashboard/rating` | `Ratings.tsx` | Reviews & ratings | ✅ |

### **Page Security Implementation**

Each page implements authorization checks:

```typescript
// Example: Users.tsx (Admin Only)
const { user } = useAuth();

if (!user?.isAdmin) {
  return <div>Access Denied: Admin privileges required</div>;
}
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm/yarn/pnpm
- Backend API running (separate repository)
- Razorpay account for payment testing

### **1. Clone Repository**
```bash
git clone <repository-url>
cd Gujarat-Tourisum1
```

### **2. Install Dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay Configuration (Get from https://dashboard.razorpay.com/)
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_here
```

### **4. Start Development Server**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

---

## ⚙️ Environment Configuration

### **Required Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay test/live key | `rzp_test_1234567890` |

### **Optional Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `Gujarat Tourism` |

### **Environment-Specific Configs**

**Development:**
```bash
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

**Production:**
```bash
VITE_API_URL=https://api.yourbackend.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## 💻 Development Workflow

### **Available Scripts**

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code with ESLint
npm run lint
```

### **Code Quality**
- **TypeScript Strict Mode** enabled for type safety
- **ESLint** configured with React + TypeScript rules
- **Prettier** integration (recommended)

### **Component Development**
- Use **Shadcn UI** for consistent design system
- Follow **component composition** patterns
- Implement **proper TypeScript types** from `src/types/index.ts`

---

## 📦 Build & Deployment

### **Build for Production**
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### **Deployment Options**

#### **Netlify** (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

Configuration is already set in `netlify.toml`.

#### **Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### **Manual Deployment**
1. Build the project: `npm run build`
2. Upload `dist/` folder to any static hosting service
3. Configure environment variables in hosting platform

### **Important: Environment Variables**
Ensure these are set in your hosting platform:
- `VITE_API_URL`
- `VITE_RAZORPAY_KEY_ID`

---

## 🤝 Contributing

### **Development Guidelines**
1. Follow existing code structure and naming conventions
2. Use TypeScript types from `src/types/index.ts`
3. Implement proper error handling
4. Add loading states for async operations
5. Test authentication flows thoroughly

### **Pull Request Process**
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 Additional Documentation

- **[BOOKING_SETUP.md](./BOOKING_SETUP.md)** - Complete booking system setup guide
- **[RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)** - Payment gateway configuration

---

## 📧 Support

For issues or questions:
- Open an issue in the repository
- Contact the development team

---

## 📝 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ for Gujarat Tourism**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
