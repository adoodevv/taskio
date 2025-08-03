# Taskio - Service Management Platform

A comprehensive service management platform where Taskios (service providers) can offer their services and Seekers can book them.

## Features

### Authentication
- User registration and login with email/password
- JWT-based authentication
- Role-based access control (Taskio/Seeker)
- Persistent sessions with localStorage

### Profile Management
- **Profile Picture Upload**: Users can upload and update their profile pictures
- **Header Image Upload**: Users can customize their profile header image
- **Profile Information**: Edit name and view account details
- **Cloudinary Integration**: Secure image storage and optimization

### Service Management (Taskio Users)
- Create comprehensive service listings
- Manage service details, pricing, and availability
- Upload service images and portfolio
- Service statistics and analytics

## Image Upload Features

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits
- Maximum file size: 5MB per image
- Automatic image optimization via Cloudinary

### Image Types
1. **Profile Picture**: Square aspect ratio, displayed in user menu and profile
2. **Header Image**: Wide aspect ratio, displayed as profile banner

## Environment Variables

Create a `.env.local` file with the following variables:

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

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Set up MongoDB Atlas database
   - Configure Cloudinary account
   - Add environment variables

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/verify` - Verify JWT token

### User Profile
- `PATCH /api/user/profile` - Update profile information
- `POST /api/user/upload-image` - Upload profile/header images

### Services (Taskio Only)
- `GET /api/services` - Get user's services
- `POST /api/services` - Create new service
- `GET /api/services/[id]` - Get specific service
- `PATCH /api/services/[id]` - Update service
- `DELETE /api/services/[id]` - Delete service

## Usage

### Uploading Images
1. Navigate to your profile page
2. Click "Edit Profile"
3. Click on the profile picture or header image area
4. Select an image file (JPEG, PNG, or WebP, max 5MB)
5. Image will be automatically uploaded to Cloudinary
6. Changes are saved immediately

### Managing Services (Taskio Users)
1. Access the dashboard
2. Click "Service List" to manage your services
3. Use the "Add New Service" button to create listings
4. Edit or delete existing services as needed

## Security Features

- JWT token authentication
- Password hashing with bcryptjs
- File type and size validation
- Role-based access control
- Protected API routes with middleware

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Image Storage**: Cloudinary
- **State Management**: React Context API
- **UI Components**: Custom components with React Icons
