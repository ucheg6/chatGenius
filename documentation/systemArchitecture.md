# ChatGenius System Architecture

## API Routes

### Authentication Routes
1. POST /api/auth/register - Public
2. POST /api/auth/login - Public
3. POST /api/auth/logout - Protected
4. GET /api/auth/me - Protected
5. POST /api/auth/password-reset - Public
6. PUT /api/auth/password-reset/:token - Public

### User Routes
1. GET /api/users - Protected
2. GET /api/users/:id - Protected
3. PUT /api/users/:id - Protected (Self only)
4. PUT /api/users/status - Protected (Self only)

### Channel Routes
1. GET /api/channels - Protected
2. POST /api/channels - Protected
3. GET /api/channels/:id - Protected
4. PUT /api/channels/:id - Protected (Admin only)
5. DELETE /api/channels/:id - Protected (Admin only)
6. POST /api/channels/:id/members - Protected (Admin only)
7. DELETE /api/channels/:id/members/:userId - Protected (Admin only)

### Message Routes
1. GET /api/channels/:id/messages - Protected
2. POST /api/channels/:id/messages - Protected
3. PUT /api/messages/:id - Protected (Sender only)
4. DELETE /api/messages/:id - Protected (Sender only)
5. POST /api/messages/:id/thread - Protected
6. GET /api/messages/:id/thread - Protected
7. POST /api/messages/:id/reactions - Protected
8. DELETE /api/messages/:id/reactions/:emojiId - Protected

## Page Structure & Components

### Pages
1. /login - LoginPage
2. /register - RegisterPage
3. /chat - MainChatPage
4. /channels/:id - ChannelPage
5. /direct/:userId - DirectMessagePage
6. /profile - UserProfilePage

### Core Components
1. Layout/
   - Sidebar
   - Header
   - MainContent

2. Chat/
   - MessageList
   - MessageInput
   - MessageItem
   - ThreadView
   - ReactionPicker
   - ReactionList

3. Channel/
   - ChannelList
   - ChannelHeader
   - ChannelMembers
   - CreateChannel

4. User/
   - UserStatus
   - UserAvatar
   - UserProfile
   - UserList

5. Common/
   - Button
   - Input
   - Modal
   - Loader
   - ErrorBoundary

## Middleware Functions

### Authentication
1. authenticateToken - Validates JWT tokens
2. refreshToken - Handles token refresh
3. requireAuth - Protects routes requiring authentication
4. requireAdmin - Validates admin permissions

### Request Processing
1. validateRequest - Validates incoming request data
2. sanitizeInput - Sanitizes user input
3. rateLimiter - Implements rate limiting
4. errorHandler - Global error handling

### WebSocket
1. socketAuth - Authenticates WebSocket connections
2. socketMiddleware - Handles Socket.io events
3. presenceTracker - Tracks user online status

### Logging & Monitoring
1. requestLogger - Logs API requests
2. errorLogger - Logs errors and exceptions
3. performanceMonitor - Tracks response times

## Data Flow

1. Client-Server Communication
   - REST API for CRUD operations
   - WebSocket for real-time updates
   - JWT for authentication

2. Real-time Updates
   - Message broadcasting
   - User status changes
   - Typing indicators
   - Reaction updates

3. State Management
   - Redux for global state
   - Context for theme/auth
   - Local state for forms
