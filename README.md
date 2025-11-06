# 🚀 Full Stack Laravel + Next.js Application

## 📋 Features

✅ User Authentication (Register, Login, Logout)  
✅ Post Management - Full CRUD Operations  
✅ Repository Pattern Implementation  
✅ Token Authentication with Laravel Sanctum  
✅ Responsive UI with DaisyUI  
✅ Pagination Support  
✅ Protected Routes & Authorization  

---

## 🛠️ Tech Stack

### Backend
- Laravel 11.x
- PHP 8.3
- MySQL 8.0
- Laravel Sanctum (API Authentication)
- Repository Pattern
- Form Request Validation
- API Resources
- UUID

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- DaisyUI 4
- Axios
- js-cookie
- Lucide React Icon
- React Hot Toast

---

## 📁 Project Structure
```
fullstack-web-post/
├── laravel-backend/          # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   └── Repositories/
│   │       ├── Interfaces/
│   │       └── Implementations/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── nextjs-frontend/          # Next.js Frontend
│   ├── app/
│   │   ├── (auth)/          # Public pages
│   │   └── (dashboard)/     # Protected pages
│   ├── lib/
│   │   ├── api/
│   │   └── hooks/
│   └── middleware.ts
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+
- Composer 2.x
- Node.js 20+
- MySQL 8.0+
- Git

### Installation

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd fullstack-web-post
```

#### 2. Backend Setup
```bash
cd laravel-backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
# Edit .env and set your database credentials:
# DB_DATABASE=laravel_nextjs
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Generate application key
php artisan key:generate

# Create database (in MySQL)
mysql -u root -p
CREATE DATABASE laravel_nextjs;
EXIT;

# Run migrations with seeders
php artisan migrate:fresh --seed

# Start server
php artisan serve
# Running at http://localhost:8000
```

#### 3. Frontend Setup
```bash
# Open new terminal
cd nextjs-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add: NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
# Running at http://localhost:3000
```

#### 4. Access Application

Open browser: **http://localhost:3000**

**Test Credentials:**
- Email: `john@example.com`
- Password: `password123`

---

## 🏗️ Architecture & Design Decisions

### Backend (Laravel)

#### Repository Pattern
Implements Repository Pattern for clean architecture and better testability:

**Structure:**
```
app/Repositories/
├── Interfaces/
│   ├── UserRepositoryInterface.php
│   └── PostRepositoryInterface.php
└── Implementations/
    ├── UserRepository.php
    └── PostRepository.php
```

**Benefits:**
- Separation of concerns between business logic and data access
- Easier to test with mocking
- Flexible to change data sources
- Centralized query logic

**Dependency Injection:**
Registered in `AppServiceProvider.php`:
```php
$this->app->bind(PostRepositoryInterface::class, PostRepository::class);
$this->app->bind(UserRepositoryInterface::class, UserRepository::class);
```

#### Key Components

**Controllers:**
- `AuthController.php` - Handles registration, login, logout
- `PostController.php` - Handles CRUD operations for posts

**Form Requests:**
- Server-side validation for all inputs
- `RegisterRequest`, `LoginRequest`, `StorePostRequest`, `UpdatePostRequest`

**API Resources:**
- Consistent JSON response formatting
- `UserResource`, `PostResource`

**Security:**
- Laravel Sanctum for token-based authentication
- Bcrypt password hashing
- CSRF protection
- SQL injection prevention via Eloquent ORM
- Authorization checks for post ownership

### Frontend (Next.js)

#### App Router Structure

**Route Groups:**
- `(auth)/` - Public authentication pages (login, register)
- `(dashboard)/` - Protected pages (posts management)

**Dynamic Routes:**
- `[id]/` - Post detail and edit pages

**Middleware:**
- Protects dashboard routes
- Redirects authenticated users from auth pages
- Cookie-based token management

#### State Management

**Custom Hooks:**
- `useAuth()` - Centralized authentication state and methods
- Manages user session, login, register, logout

**API Layer:**
- Separated in `lib/api/`
- Axios interceptors for automatic token injection
- Type-safe with TypeScript interfaces

#### UI/UX

**DaisyUI Components:**
- Pre-built Tailwind CSS components
- Navbar, Cards, Forms, Buttons, Alerts
- Light/Dark theme support
- Responsive design

**Features:**
- Loading states for better UX
- Error handling with user feedback
- Form validation
- Pagination for post lists

---

## 📝 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |
| GET | `/user` | Get current user | Yes |

### Posts Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/posts` | Get paginated posts | Yes |
| GET | `/posts/{id}` | Get post by ID | Yes |
| POST | `/posts` | Create new post | Yes |
| PUT | `/posts/{id}` | Update post (owner only) | Yes |
| DELETE | `/posts/{id}` | Delete post (owner only) | Yes |

### Request Examples

**Register:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@test.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "password123"
  }'
```

**Get Posts (with token):**
```bash
curl -X GET http://localhost:8000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

---

## 🐛 Troubleshooting

### CORS Error
**Issue:** Frontend can't connect to backend

**Solution:** Update `config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000'],
```

### Database Connection Error
**Issue:** Can't connect to MySQL

**Solution:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check `.env` credentials
3. Ensure database exists: `CREATE DATABASE laravel_nextjs;`

### Port Already in Use
**Issue:** Port 8000 or 3000 already in use

**Solution:**
```bash
# Laravel - different port
php artisan serve --port=8001

# Next.js - different port
npm run dev -- -p 3001
```

### Module Not Found (Frontend)
**Issue:** Missing dependencies

**Solution:**
```bash
cd nextjs-frontend
rm -rf node_modules package-lock.json
npm install
```

### 401 Unauthorized Error
**Issue:** Token not being sent

**Solution:** 
- Check if token exists in cookies
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cookies and login again

---

## 📚 Additional Notes

### Why Repository Pattern?

I chose to implement the Repository Pattern because:

1. **Clean Architecture**: Separates business logic from data access
2. **Testability**: Easy to mock repositories for unit testing
3. **Maintainability**: Centralized data access logic
4. **Flexibility**: Can easily switch between different data sources (MySQL, MongoDB, etc.)

### Why Next.js App Router?

The new App Router provides:

1. **Performance**: React Server Components for faster page loads
2. **SEO**: Built-in server-side rendering
3. **Developer Experience**: File-based routing, layouts, loading states
4. **Modern**: Latest React features (Server Components, Streaming)

### Why DaisyUI?

DaisyUI offers:

1. **Rapid Development**: Pre-built components reduce development time
2. **Consistency**: Unified design system
3. **No JavaScript**: Pure CSS components for better performance
4. **Accessibility**: ARIA-compliant components out of the box

---

## 🎯 Features Implemented

### Authentication ✅
- User registration with validation
- Login with email/password
- Token-based authentication
- Logout functionality
- Protected routes

### Post Management ✅
- List all posts with pagination
- View single post details
- Create new posts
- Edit existing posts (owner only)
- Delete posts (owner only)

### Security ✅
- Password hashing (bcrypt)
- API token authentication (Sanctum)
- CORS protection
- Input validation (frontend + backend)
- Authorization checks
- SQL injection prevention

---

## 👨‍💻 Author

**Assessment Submission**  
PT Informatika Media Pratama - Software Engineer Position  

---

## 📄 License

This project is created for assessment purposes only.

---

**Thank you for reviewing my submission! 🚀**
