# Professional Todo List - Frontend

A modern, professional todo list application built with Vue 3, TypeScript, and Tailwind CSS.

## Features

- ✅ **Task Management**: Create, read, update, and delete tasks
- 🔐 **Authentication**: Secure login and registration
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 🔍 **Advanced Filtering**: Filter by status, priority, and search
- 📊 **Statistics**: Track pending and completed tasks
- 📱 **Responsive**: Works on all devices
- ⚡ **Fast**: Built with Vite for optimal performance
- 🎯 **TypeScript**: Fully typed for better developer experience

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation frontend tooling
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Modern date utility library

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

## Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your API URL if different from default:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── TaskCard.vue
│   ├── TaskModal.vue
│   ├── TaskFilters.vue
│   └── TheHeader.vue
├── views/              # Page components
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── TasksView.vue
├── stores/             # Pinia stores
│   ├── auth.ts
│   └── tasks.ts
├── router/             # Vue Router configuration
│   └── index.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   ├── axios.ts
│   └── helpers.ts
├── config/             # Configuration files
│   └── api.ts
├── App.vue            # Root component
├── main.ts            # Application entry point
└── style.css          # Global styles
```

## Features Overview

### Authentication
- User registration with validation
- Secure login with token-based authentication
- Automatic token refresh
- Protected routes

### Task Management
- Create tasks with title, description, priority, and due date
- Edit existing tasks
- Mark tasks as complete/incomplete
- Delete tasks with confirmation
- Bulk operations support

### Filtering & Search
- Filter by status (All, Pending, Completed)
- Filter by priority (Low, Medium, High)
- Search by title and description
- Sort by multiple fields
- Debounced search for better performance

### UI/UX
- Clean and professional design
- Smooth animations and transitions
- Loading states and error handling
- Responsive layout for all screen sizes
- Accessible form controls

## API Integration

The frontend communicates with the Laravel backend API:

- **Base URL**: `http://localhost:8000/api`
- **Authentication**: Bearer token in Authorization header
- **Endpoints**:
  - `POST /register` - User registration
  - `POST /login` - User login
  - `POST /logout` - User logout
  - `GET /user` - Get current user
  - `GET /tasks` - List tasks with filters
  - `POST /tasks` - Create task
  - `PUT /tasks/{id}` - Update task
  - `PATCH /tasks/{id}/toggle-complete` - Toggle completion
  - `DELETE /tasks/{id}` - Delete task

## Development Tips

1. **Hot Module Replacement**: Changes are reflected instantly
2. **TypeScript**: Use proper types for better IDE support
3. **Pinia DevTools**: Install Vue DevTools for state debugging
4. **Tailwind IntelliSense**: Install the VSCode extension for class suggestions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning or commercial purposes.
