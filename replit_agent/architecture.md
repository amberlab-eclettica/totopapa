# Architecture Overview - TOTOPAPA

## 1. Overview

TOTOPAPA is a full-stack web application that allows users to participate in a fantasy Vatican election game. The application enables users to register, browse and vote for cardinal candidates, add new candidates, post anonymous "Vatican whispers" (news), and view election statistics. The application follows a client-server architecture with a React frontend and an Express backend.

## 2. System Architecture

The application follows a modern client-server architecture:

- **Frontend**: React single-page application (SPA) with TypeScript
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components

The system is structured into three main directories:
- `/client`: Contains the React frontend application
- `/server`: Contains the Express.js backend server
- `/shared`: Contains shared types, schemas, and utilities used by both frontend and backend

## 3. Key Components

### 3.1 Frontend Architecture

The frontend is built using React with TypeScript and follows a component-based architecture:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: Uses React Query for server state and React Context for local state
- **UI Components**: Uses shadcn/ui, which is built on Radix UI primitives
- **Styling**: Uses Tailwind CSS for utility-first styling
- **Form Handling**: Uses React Hook Form with Zod for validation

Key frontend directories/files:
- `/client/src/components`: UI components including page-specific and shared components
- `/client/src/pages`: Page components for different routes
- `/client/src/hooks`: Custom React hooks
- `/client/src/lib`: Utility functions and configurations

### 3.2 Backend Architecture

The backend is built using Express.js with TypeScript and follows a RESTful API design:

- **API Routes**: Defined in `/server/routes.ts`
- **Data Access**: Uses a storage abstraction layer in `/server/storage.ts`
- **Middleware**: Custom middleware for logging and error handling

API endpoints follow RESTful conventions and include:
- User management: `/api/users`
- Cardinal management: `/api/cardinals`
- Voting: `/api/votes`
- News/gossip: `/api/news`
- Statistics: `/api/votes/stats`

### 3.3 Database Schema

The application uses PostgreSQL with Drizzle ORM for data persistence. The schema is defined in `/shared/schema.ts` and includes the following tables:

- **Users**: Stores registered users with username and title
- **Cardinals**: Stores cardinal candidates with name, title, age, description, and image URL
- **Votes**: Stores user votes for cardinals
- **News**: Stores anonymous news/gossip posts

The schema design supports the core features of the application:
- User registration and identification
- Cardinal candidate management
- Voting functionality
- Anonymous news posting

### 3.4 Authentication

The application uses a simple identifier-based authentication strategy:
- Users register with a username and title
- User information is stored in localStorage
- The user context is managed through React Context API
- No password authentication is implemented, making this a casual, low-security application

## 4. Data Flow

### 4.1 Client-Server Communication

1. Frontend components use React Query to fetch data from the backend API
2. API requests are made using the `apiRequest` utility function in `/client/src/lib/queryClient.ts`
3. Backend routes handle requests, validate inputs using Zod schemas, and interact with the storage layer
4. The storage layer interacts with the database and returns results to the API routes
5. API responses are sent back to the frontend as JSON
6. React Query caches responses and updates the UI

### 4.2 State Management

- **Server State**: Managed through React Query, handling caching, loading states, and refetching
- **User Authentication**: Managed through React Context and localStorage
- **UI State**: Managed through component state using React's useState and useReducer hooks

## 5. External Dependencies

### 5.1 Frontend Dependencies

- **React**: UI library
- **Wouter**: Lightweight routing library
- **@tanstack/react-query**: Data fetching and caching
- **shadcn/ui & Radix UI**: Component library
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Chart.js**: Data visualization
- **date-fns**: Date manipulation

### 5.2 Backend Dependencies

- **Express**: Web framework
- **Drizzle ORM**: Database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **Zod**: Schema validation

## 6. Deployment Strategy

The application is configured for deployment on Replit, as indicated by the `.replit` configuration file:

- **Development**: `npm run dev` runs both the frontend and backend in development mode
- **Production Build**: `npm run build` compiles both frontend and backend
- **Production Start**: `npm run start` serves the compiled application

The deployment process:
1. Frontend is built using Vite and outputs to `/dist/public`
2. Backend is bundled using esbuild and outputs to `/dist`
3. The bundled backend serves the static frontend assets

The application is configured to support auto-scaling and expose port 5000 internally, mapped to port 80 externally.

## 7. Development Workflow

The project supports the following development commands:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the application for production
- `npm run start`: Starts the production server
- `npm run check`: Runs TypeScript type checking
- `npm run db:push`: Updates the database schema

## 8. Future Considerations

1. **Security**: The current authentication is very basic. For a production application, proper authentication with passwords or OAuth would be needed.
2. **Scalability**: The current in-memory storage implementation would need to be replaced with a proper database connection for production use.
3. **Testing**: No testing infrastructure is currently implemented. Integration and unit tests would be valuable additions.
4. **Error Handling**: More robust error handling could be implemented, particularly for API interactions.