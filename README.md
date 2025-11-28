# Fishing Maps Platform 🎣

Interactive fishing platform for tracking catches, discovering fishing spots, and viewing community statistics.

## 🚀 Features

- **Interactive Map**: Mapbox-powered fishing spots with real-time data
- **Fish Catch Tracking**: Log catches with species, weight, length, and location
- **User Authentication**: JWT-based secure login and registration
- **Personal Statistics**: Track your fishing progress and achievements
- **Global Platform Stats**: View community-wide fishing statistics
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with persistence
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT tokens
- **Maps**: Mapbox GL JS
- **Testing**: Vitest with React Testing Library

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── fish-catch/      # Fish catch CRUD
│   │   └── stats/           # Statistics endpoints
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── map/                 # Interactive map page
│   └── stats/               # Statistics pages
│       └── global/          # Global platform stats
├── components/               # Organized component structure
│   ├── features/            # Feature-specific components
│   │   ├── map/             # Map-related components
│   │   └── stats/           # Statistics components
│   ├── layout/              # Layout components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utilities and configurations
│   ├── hooks/               # Custom React hooks
│   └── store/               # Redux store configuration
├── types/                   # TypeScript type definitions
└── __tests__/               # Test files
```

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Mapbox API key

### Installation

```bash
# Clone repository
git clone https://github.com/pablo-piotrowski/maps.git
cd maps

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your database and Mapbox credentials

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# JWT
JWT_SECRET="your-jwt-secret"

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="your-mapbox-token"
```

## 🗄️ Database Setup

Run the SQL files in `database/` directory:

1. `create_users_table.sql` - User accounts
2. `create_fish_catches_table.sql` - Fish catch records  
3. `add_user_to_fish_catches.sql` - User relationship

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- MapHeader.test.tsx
```

## 🚀 Deployment

### Build
```bash
npm run build
npm start
```

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Fish Catches
- `GET /api/fish-catch` - Get user's catches
- `POST /api/fish-catch` - Add new catch
- `PUT /api/fish-catch` - Update catch
- `DELETE /api/fish-catch` - Delete catch

### Statistics
- `GET /api/stats/global` - Global platform statistics

## 🎨 Component Architecture

### Layout Components (`components/layout/`)
- **MapHeader**: Main navigation with authentication state

### UI Components (`components/ui/`)
- **StatsSkeleton**: Loading skeleton for statistics

### Feature Components (`components/features/`)

#### Map (`components/features/map/`)
- **LakeDrawer**: Lake information and catch management
- **FishCatchForm**: Form for adding/editing catches
- **FishCatchesTable**: Display catch history

#### Stats (`components/features/stats/`)
- **GlobalStats**: Platform-wide statistics display

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run type-check   # TypeScript type checking
```

## 📱 Features in Detail

### Interactive Map
- Click anywhere to add fishing spots
- View existing catches by location
- Real-time data loading
- Mobile-responsive controls

### User Authentication
- Secure JWT-based authentication
- Persistent login sessions
- Protected routes and API endpoints

### Statistics Dashboard
- Personal fishing statistics
- Global community insights
- Visual data representation
- Real-time updates

### Fish Catch Management
- Species selection
- Weight and length tracking
- Location-based organization
- Historical data viewing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Mapbox](https://mapbox.com) for interactive maps
- [Vercel](https://vercel.com) for deployment platform
- [Neon](https://neon.tech) for PostgreSQL hosting
