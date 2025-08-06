# Taskio - Campus Service Marketplace

A comprehensive service marketplace platform connecting students and campus communities. Taskio enables service providers (Taskios) to offer their skills and services while allowing service seekers to find and book trusted help for various tasks.

## 🚀 Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure email/password authentication with JWT tokens
- **Role-Based Access Control**: Two user types - Taskio (service providers) and Seeker (service consumers)
- **Profile Management**: Complete profile customization with profile pictures and header images
- **Session Management**: Persistent authentication with localStorage
- **Password Security**: Bcryptjs hashing for secure password storage

### 🏠 Landing Page & Discovery
- **Dynamic Hero Section**: Animated search interface with real-time service discovery
- **Service Categories**: Organized service browsing (Home Services, Freelance, Fitness, Education, Technology, Creative, Professional Services, Health & Wellness, Transportation)
- **Search & Filter**: Advanced search functionality with category and keyword filtering
- **Service Showcase**: Featured services with pricing, availability, and provider information
- **Trust Indicators**: Customer reviews, satisfaction guarantees, and background-checked providers

### 📱 Service Management (Taskio Users)
- **Comprehensive Service Creation**: Detailed service listings with multiple pricing models (hourly, fixed, package)
- **Rich Service Details**: 
  - Categories and tags for easy discovery
  - Detailed descriptions and requirements
  - Service images and portfolio uploads
  - Pricing ranges with negotiation options
  - Availability scheduling (days, times, urgency levels)
  - Location settings (in-person, remote, or both)
  - Experience and certification display
  - Equipment and service type specifications
- **Service Lifecycle Management**: Create, edit, activate/deactivate, and delete services
- **Portfolio Management**: Upload multiple images and external links to showcase work

### 📊 Dashboard & Analytics (Taskio Users)
- **Performance Metrics**: 
  - Total earnings tracking
  - Active and completed job counts
  - Service portfolio statistics
  - Average rating display
- **Recent Activity**: Real-time updates on bookings and service interactions
- **Quick Actions**: Direct access to service management and booking views

### 🔄 Booking System
- **Service Booking**: Complete booking flow with detailed forms
- **Booking Management**: 
  - Status tracking (pending, confirmed, in-progress, completed, cancelled)
  - Date and time scheduling
  - Location and contact information
  - Special instructions and requirements
  - Quantity and pricing calculations
- **Booking History**: Comprehensive booking records for both customers and providers
- **Booking Success Flow**: Confirmation pages with booking IDs and next steps

### 🖼️ Image Management
- **Profile Pictures**: Square aspect ratio for user avatars
- **Header Images**: Wide aspect ratio for profile banners
- **Service Images**: Portfolio and service showcase images
- **Cloudinary Integration**: Secure cloud storage with automatic optimization
- **File Validation**: Support for JPEG, PNG, WebP formats (max 5MB)
- **Deferred Upload**: Images only upload when users save changes (prevents unnecessary uploads)

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Search**: Live search results with service previews
- **Interactive Components**: Hover effects, loading states, and smooth transitions
- **Toast Notifications**: User feedback for all actions
- **Protected Routes**: Role-based access to different sections
- **Error Handling**: Comprehensive error messages and fallbacks

## 🛠️ Technical Architecture

### Frontend
- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Context API**: State management
- **React Icons**: Comprehensive icon library
- **React Hot Toast**: User notifications

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT Authentication**: Secure token-based auth
- **Cloudinary**: Image storage and optimization
- **Bcryptjs**: Password hashing

### Data Models
- **User**: Authentication, profiles, roles
- **Service**: Complete service listings with rich metadata
- **Booking**: Booking management with status tracking

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify` - Token verification

### User Management
- `PATCH /api/user/profile` - Update profile information
- `POST /api/user/upload-image` - Upload profile/header images

### Services
- `GET /api/services` - Get user's services (Taskio)
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get specific service details
- `PATCH /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service
- `GET /api/services/public` - Public service discovery with filtering

### Bookings
- `GET /api/bookings` - Get user's bookings (customer/provider)
- `POST /api/bookings` - Create new booking
- `PATCH /api/bookings/[id]` - Update booking status
- `DELETE /api/bookings/[id]` - Cancel booking

### Dashboard
- `GET /api/dashboard/stats` - Get Taskio performance metrics

## 🚀 Future Improvements

### Enhanced Booking System
- **Real-time Chat**: In-app messaging between customers and providers
- **Payment Integration**: Stripe/PayPal integration for secure payments
- **Booking Calendar**: Visual calendar interface for scheduling
- **Automated Reminders**: Email/SMS notifications for upcoming bookings
- **Rating & Review System**: Post-service feedback and ratings

### Advanced Features
- **Push Notifications**: Real-time updates for bookings and messages
- **Service Recommendations**: AI-powered service suggestions
- **Advanced Search**: Filters for price, location, availability, ratings
- **Service Packages**: Bundled services and subscription models
- **Dispute Resolution**: Built-in conflict resolution system

### Platform Enhancements
- **Mobile App**: Native iOS/Android applications
- **Multi-language Support**: Internationalization for global reach
- **Analytics Dashboard**: Advanced insights and reporting
- **Admin Panel**: Platform management and moderation tools
- **API Documentation**: Comprehensive API docs for third-party integrations

### Security & Trust
- **Background Checks**: Integration with verification services
- **Insurance Integration**: Service provider insurance verification
- **Two-Factor Authentication**: Enhanced account security
- **Data Encryption**: End-to-end encryption for sensitive data
- **GDPR Compliance**: Privacy and data protection features

### Performance & Scalability
- **CDN Integration**: Global content delivery
- **Database Optimization**: Query optimization and indexing
- **Caching Strategy**: Redis integration for improved performance
- **Microservices Architecture**: Scalable service-oriented design
- **Load Balancing**: High availability and fault tolerance

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Cloudinary account

### Environment Variables
Create a `.env.local` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **JWT Token Authentication**: Secure session management
- **Password Hashing**: Bcryptjs for password security
- **File Validation**: Type and size restrictions for uploads
- **Role-Based Access Control**: Protected routes and features
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request security

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode Support**: User preference-based theming
- **Accessibility**: WCAG compliant design
- **Loading States**: Smooth loading indicators
- **Error Boundaries**: Graceful error handling
- **Progressive Enhancement**: Core functionality without JavaScript

## 📈 Performance Optimizations

- **Image Optimization**: Automatic compression and format conversion
- **Code Splitting**: Lazy loading for better performance
- **Caching Strategies**: Browser and CDN caching
- **Database Indexing**: Optimized queries for fast responses
- **Bundle Optimization**: Minimized JavaScript bundles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Taskio** - Connecting campus communities through trusted services.
