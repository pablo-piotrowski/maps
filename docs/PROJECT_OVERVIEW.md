# Project Overview - Maps (Fishing Application)

## 📋 General Description

The **Maps** application is a modern fishing platform utilizing interactive maps for managing fishing spots and maintaining a fishing logbook. Users can record their catches at specific lakes, browse catch history from other anglers, and analyze statistics.

## 🛠 Technology Stack

### Framework and Runtime
- **Next.js 15.3.3** (App Router) - main application framework
- **React 19** - UI library
- **TypeScript 5** - static typing
- **Node.js** - server environment

### Frontend
- **Tailwind CSS 4** - application styling
- **Mapbox GL JS 3.12** - interactive maps
- **react-map-gl 8.0.4** - React wrapper for Mapbox
- **deck.gl 9.2.2** - advanced map visualizations

### State Management
- **Redux Toolkit 2.9.0** - application state management
- **React Redux 9.2.0** - Redux integration with React

### Backend and Database
- **PostgreSQL** (Neon Database) - main database
- **pg 8.16.3** - PostgreSQL driver for Node.js
- **Next.js API Routes** - backend endpoints

### Authentication and Security
- **JWT (JSON Web Tokens)** - user authentication
- **bcryptjs 3.0.2** - password hashing
- **jsonwebtoken 9.0.2** - token management

### Testing and Code Quality
- **Vitest 1.6.0** - testing framework
- **ESLint** - code linting
- **TypeScript** - static type checking

## 🏗 Application Architecture

### Folder Structure

```
maps/
├── app/                      # Next.js App Router
│   ├── api/                 # Backend API endpoints
│   │   ├── auth/           # Authentication (login, register, logout)
│   │   └── fish-catch/     # API operations for catches (Create + Read)
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── map/                # Main map application
│       ├── components/     # Map components
│       └── hooks/          # Custom hooks
├── lib/                     # Libraries and utilities
│   ├── store/              # Redux store and slices
│   └── hooks/              # Global custom hooks
├── types/                   # TypeScript definitions
├── components/             # Global components
├── database/               # SQL scripts and DB documentation
└── docs/                   # Technical documentation
```

## 🔐 Authentication System

### JWT Implementation
- **Registration**: Data validation, password hashing, JWT generation
- **Login**: Credential verification, JWT token return
- **Authorization**: Middleware verifying tokens in API requests
- **Security**: Tokens expire after 7 days, passwords require diverse characters

### Redux Auth State
- Global user state management
- Automatic token verification on app startup
- Session persistence in localStorage
- Error handling and loading states

## 🗺 Map Functionality

### Mapbox Integration
- **Interactive maps** with custom tileset for lakes
- **Vector tiles** for optimal performance
- **Configurable view** with position and zoom persistence
- **Hover effects** and clickable lakes

### UI State Management (Redux)
- **MapUI Slice**: Map state management (position, zoom, popup)
- **Persistence**: Automatic map state saving in localStorage
- **Drawer management**: Animated side panels for lakes

## 🐟 Catch Management

### API Endpoints
- `POST /api/fish-catch` - Add new catch (authentication required)
- `GET /api/fish-catch?lake_id=X` - Get catches for lake
- ❌ Update/Delete - not implemented (partial CRUD)

### Privacy & Security
- Public catches visible to everyone
- User privacy settings respected
- Own catches always visible to user

## 📊 UI Components

### Lake Drawer
- **Responsive side panel** with animations
- **Catch table** with sorting (own catches on top)
- **Add catch form** (logged-in users only)
- **Loading states** and error handling

### Fish Catch Form
- **Validation** of required fields
- **Optimal UX** with feedback messages
- **Automatic** date/time saving
- **Redux integration** for state management

### Authentication Forms
- **Comprehensive validation** of forms
- **Error handling** with user-friendly messages

## 🔄 State Management (Redux)

### Auth Slice
- **Async thunks**: login, register, verifyToken
- **Automatic token handling**: localStorage sync
- **Error management**: user-friendly error states

### MapUI Slice
- **View state**: zoom, center, popup info
- **Drawer management**: open/close animations
- **Persistence middleware**: localStorage integration
- **Optimized updates**: debounced map interactions

## 📱 Responsiveness

### Mobile-First Design
- **Adaptive layouts** for different screen sizes
- **Touch-friendly** map interactions
- **Drawer behavior** optimized for mobile

## 🚀 Deployment and DevOps

### Next.js Optimizations
- **App Router** for server-side rendering
- **Bundle optimization** with Turbopack dev server

### Vercel Integration
- **Neon Database** integration
- **Environment secrets** management
- **Automatic deployments** with git integration
- **Performance monitoring** built-in

## 🔐 Security

### Input Validation
- **Server-side** and client-side validation
- **SQL injection** protection with parameterized queries
- **XSS protection** through proper escaping
- **CSRF** protection for state-changing operations

### Authentication Security
- **Password hashing** with bcrypt (12 rounds)
- **JWT expiration** and refresh logic

## 🎯 Future Extensions

### Planned Features
1. **Advanced statistics** - charts, comparisons, rankings
2. **Social features** - following other anglers, comments
3. **Weather integration** - weather at fishing spots
4. **Mobile app** - React Native or PWA
5. **Photo uploads** - catch photos with cloud storage integration

### Possible Technical Improvements
1. **Caching layer** - Redis for performance
2. **Background jobs** - email notifications, data processing
3. **Monitoring** - error tracking, performance metrics
4. **Analytics** - user behavior, feature usage
5. **Internationalization** - multi-language support
6. **Accessibility improvements** - WCAG compliance

## Documentation
- **Technical docs** in `/docs` folder
- **API documentation** inline comments
- **Database schema** docs in `/database`

---

**The Maps Project** is a solid foundation for a fishing application with modern technology stack, good architecture, and capabilities for extension with advanced social and analytical features.