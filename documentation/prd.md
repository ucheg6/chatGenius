# ChatGenius MVP PRD

## Project Overview
ChatGenius is a real-time team chat platform enabling instant messaging, threaded conversations, channel-based communication, and file sharing. The MVP focuses on core messaging functionality with essential user management features and search capabilities.

## Core Workflows
1. Users register/login with email/password to access the platform
2. Users join/create channels and see real-time message updates
3. Users send messages, share files, and add emoji reactions
4. Users search message history and access shared files
5. Users can see who's online and track message delivery status

## Technical Foundation

### Data Models

User {
id: ObjectId,
email: String,
username: String,
password: String(hashed),
status: String(online|offline),
lastActive: Date
}
Channel {
id: ObjectId,
name: String,
type: String(public|private),
members: [UserID],
createdAt: Date
}
Message {
id: ObjectId,
content: String,
sender: UserID,
channel: ChannelID,
parentMessage?: MessageID,
reactions: [{emoji: String, users: [UserID]}],
attachments: [{
type: String(image|document),
url: String,
filename: String,
size: Number
}],
createdAt: Date
}

### Core API Endpoints
Authentication:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

Channels:
GET /api/channels
POST /api/channels
GET /api/channels/:id/messages

Messages:
POST /api/channels/:id/messages
POST /api/messages/:id/thread
POST /api/messages/:id/reactions

Files:
POST /api/upload
GET /api/files/:fileId
Search:
GET /api/search?q=query
GET /api/channels/:id/search?q=query

### Key Components
Frontend:
AuthPages (Login/Register)
ChannelList
MessageList
MessageInput
ThreadView
UserPresence
FileUploader
SearchBar
FilePreview

Backend:
JWT Authentication
Socket.io Connection
Message Broadcasting
Presence Tracking
File Storage Service
Search Indexing

## MVP Launch Requirements

1. Authentication
   - Email/password registration and login
   - JWT-based session management
   - Basic password reset flow

2. Messaging
   - Real-time message delivery
   - Message persistence
   - Thread support
   - Basic emoji reactions
   - Delivery confirmations

3. File Sharing
   - Image and document uploads (max 10MB)
   - Image preview support
   - Progress indicators
   - Common file type support (.jpg, .png, .pdf, .doc)
   - Secure file storage

4. Search
   - Full-text message search
   - File name search
   - Search within channels
   - Recent search history
   - Result highlighting

5. Channels
   - Public channel creation
   - Channel joining/leaving
   - Member list visibility
   - Real-time updates

6. User Experience
   - Online/offline status
   - Unread message indicators
   - Basic error handling
   - Mobile-responsive design

7. Performance
   - Message pagination (50 per load)
   - Efficient WebSocket connections
   - < 2s initial load time
   - < 100ms message delivery
   - Search results < 500ms

8. Security
   - Input sanitization
   - Rate limiting
   - XSS protection
   - CORS configuration
   - File type validation
   - Virus scanning for uploads

## Not Included in MVP
- Private channels
- User profiles
- Message formatting
- Custom emojis
- Advanced search filters
- File versioning
