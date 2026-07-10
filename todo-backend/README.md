# Professional Todo List - Backend API

Laravel 11 backend API for the Professional Todo List application.

## Features

- ✅ RESTful API architecture
- 🔐 Token-based authentication (Laravel Sanctum)
- 📝 Complete CRUD for tasks
- 🔍 Advanced filtering and search
- 📊 User-specific data isolation
- 🛡️ Policy-based authorization
- ✨ Request validation
- 📦 Soft deletes

## Requirements

- PHP 8.2 or higher
- Composer
- MySQL 8.0+ or PostgreSQL
- Laravel 11

## Installation

1. **Install dependencies**
   ```bash
   composer install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=todo_app
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

3. **Generate application key**
   ```bash
   php artisan key:generate
   ```

4. **Run migrations**
   ```bash
   php artisan migrate
   ```

5. **Start the server**
   ```bash
   php artisan serve
   ```

API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-07-02T10:00:00.000000Z",
    "updated_at": "2026-07-02T10:00:00.000000Z"
  },
  "token": "1|abc123...",
  "message": "Registration successful"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "2|def456...",
  "message": "Login successful"
}
```

#### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```http
GET /api/user
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-07-02T10:00:00.000000Z"
  }
}
```

### Tasks

#### List Tasks (with filters)
```http
GET /api/tasks?status=pending&priority=high&search=meeting&sort_by=due_date&sort_direction=asc&page=1&per_page=15
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): `pending` | `completed`
- `priority` (optional): `low` | `medium` | `high`
- `search` (optional): Search in title and description
- `sort_by` (optional): `created_at` | `due_date` | `priority` | `title`
- `sort_direction` (optional): `asc` | `desc`
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 15)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Complete project",
      "description": "Finish the todo app",
      "is_completed": false,
      "priority": "high",
      "due_date": "2026-07-10",
      "completed_at": null,
      "created_at": "2026-07-02T10:00:00.000000Z",
      "updated_at": "2026-07-02T10:00:00.000000Z"
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "per_page": 15,
  "total": 1,
  "from": 1,
  "to": 1
}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Task description",
  "priority": "medium",
  "due_date": "2026-07-15"
}
```

**Response:**
```json
{
  "task": {
    "id": 2,
    "title": "New Task",
    "description": "Task description",
    "is_completed": false,
    "priority": "medium",
    "due_date": "2026-07-15",
    "completed_at": null,
    "created_at": "2026-07-02T11:00:00.000000Z",
    "updated_at": "2026-07-02T11:00:00.000000Z"
  },
  "message": "Task created successfully"
}
```

#### Get Single Task
```http
GET /api/tasks/{id}
Authorization: Bearer {token}
```

#### Update Task
```http
PUT /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Task",
  "description": "Updated description",
  "priority": "low",
  "due_date": "2026-07-20"
}
```

#### Toggle Task Completion
```http
PATCH /api/tasks/{id}/toggle-complete
Authorization: Bearer {token}
```

**Response:**
```json
{
  "task": {
    "id": 1,
    "is_completed": true,
    "completed_at": "2026-07-02T12:00:00.000000Z"
  },
  "message": "Task marked as complete"
}
```

#### Delete Task
```http
DELETE /api/tasks/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

#### Bulk Delete Tasks
```http
DELETE /api/tasks/bulk-delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

## Database Schema

### Users Table
```php
- id: bigint (primary key)
- name: string
- email: string (unique)
- email_verified_at: timestamp (nullable)
- password: string
- avatar: string (nullable)
- remember_token: string (nullable)
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp (soft delete)
```

### Tasks Table
```php
- id: bigint (primary key)
- user_id: bigint (foreign key -> users.id)
- title: string
- description: text (nullable)
- is_completed: boolean (default: false)
- priority: enum('low', 'medium', 'high')
- due_date: date (nullable)
- completed_at: timestamp (nullable)
- created_at: timestamp
- updated_at: timestamp
- deleted_at: timestamp (soft delete)
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php      # Authentication endpoints
│   │       └── TaskController.php      # Task CRUD endpoints
│   ├── Middleware/
│   │   └── Cors.php                    # CORS configuration
│   ├── Requests/
│   │   ├── Auth/
│   │   │   ├── LoginRequest.php        # Login validation
│   │   │   └── RegisterRequest.php     # Registration validation
│   │   └── Task/
│   │       └── TaskRequest.php         # Task validation
│   └── Resources/
│       ├── TaskResource.php            # Task API resource
│       └── UserResource.php            # User API resource
├── Models/
│   ├── Task.php                        # Task model
│   └── User.php                        # User model
└── Policies/
    └── TaskPolicy.php                  # Task authorization policy

database/
└── migrations/
    ├── 0001_01_01_000000_create_users_table.php
    ├── 2026_07_01_075723_create_tasks_table.php
    └── 2026_07_01_075850_add_avatar_to_users_table.php

routes/
└── api.php                             # API routes definition
```

## Authorization

The application uses Laravel Policies for authorization:

- Users can only view their own tasks
- Users can only update their own tasks
- Users can only delete their own tasks

## Validation Rules

### Registration
- `name`: required, string, max:255
- `email`: required, email, unique:users
- `password`: required, string, min:8, confirmed

### Login
- `email`: required, email
- `password`: required, string

### Task
- `title`: required, string, max:255
- `description`: nullable, string
- `priority`: required, in:low,medium,high
- `due_date`: nullable, date, after_or_equal:today

## Security Features

- Password hashing with bcrypt
- Token-based authentication
- CSRF protection
- SQL injection prevention
- XSS protection
- Rate limiting
- CORS configuration
- Policy-based authorization

## Testing

Run the test suite:

```bash
php artisan test
```

## Production Deployment

1. Set environment to production
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   ```

2. Optimize for production
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. Set up proper file permissions
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

4. Configure your web server to point to the `public/` directory

## License

This project is licensed under the MIT License.
