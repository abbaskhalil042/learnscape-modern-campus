
# LMS Backend API

A comprehensive Learning Management System backend built with Node.js, Express, and MongoDB.

## Features

- **User Authentication** - JWT-based auth with role-based access control
- **Course Management** - CRUD operations for courses with rich metadata
- **Category System** - Hierarchical course categorization
- **Shopping Cart** - Add/remove courses, checkout functionality
- **User Profiles** - Wishlist, enrolled courses, progress tracking
- **Search & Filter** - Full-text search with advanced filtering
- **File Uploads** - Course thumbnails and video content
- **Progress Tracking** - Lesson completion and course progress

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000/api`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Courses
- `GET /api/courses` - Get all courses (with filtering)
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `DELETE /api/courses/:id` - Delete course (instructor/admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add course to cart
- `DELETE /api/cart/remove/:courseId` - Remove course from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `POST /api/cart/checkout` - Process checkout

### Users
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist/add` - Add to wishlist
- `DELETE /api/users/wishlist/remove/:courseId` - Remove from wishlist
- `GET /api/users/enrolled-courses` - Get enrolled courses
- `PUT /api/users/course-progress/:courseId` - Update course progress

## Data Models

### User
- Authentication and profile information
- Enrolled courses with progress tracking
- Wishlist and cart functionality
- Role-based permissions (student, instructor, admin)

### Course
- Rich course metadata (title, description, pricing)
- Curriculum with lessons and resources
- Instructor information
- Ratings and enrollment statistics

### Category
- Hierarchical category system
- Course organization and filtering
- Custom icons and colors

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Database Schema

The application uses MongoDB with Mongoose ODM. Key collections:

- `users` - User accounts and profiles
- `courses` - Course content and metadata
- `categories` - Course categorization
- `reviews` - Course reviews and ratings (future)
- `enrollments` - Course enrollment tracking (embedded in users)

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet.js security headers

## Development

### Running Tests
```bash
npm test
```

### Seeding Data
```bash
npm run seed
```

### Code Structure
```
backend/
├── models/         # Mongoose models
├── routes/         # Express route handlers
├── middleware/     # Custom middleware
├── scripts/        # Utility scripts
├── uploads/        # File storage
└── server.js       # Main application file
```

## Deployment

1. Set production environment variables
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Configure SSL certificates
5. Set up MongoDB replica set for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
