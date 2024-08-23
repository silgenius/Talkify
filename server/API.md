# Talkify API Documentation

## 1. User Authentication APIs

### POST /api/auth/register

Description: Register a new user.

Request Body: email

Response: User ID, JWT token.

### POST /api/auth/login

Description: Authenticate a user.

Request Body: email

Response: JWT token, user profile.

### POST /api/auth/logout

Description: Log out the authenticated user.

Headers: Authorization: Bearer <JWT token>

Response: Success message.

### GET /api/auth/me

Description: Get the authenticated user's profile.

Headers: Authorization: Bearer <JWT token>, User ID

Response: User profile.

## 2. User Management APIs

### GET /api/users/{userId}

Description: Retrieve user profile by ID.

Headers: Authorization: Bearer <JWT token>

Response: User profile.

### GET /api/users/search?query={query}

Description: Search for users by username or email.

Headers: Authorization: Bearer <JWT token>

Response: Searched user ID (if found)

## 3. Messaging APIs

### POST /api/messages/send

Description: Send a new message.

Headers: Authorization: Bearer <JWT token>

Request Body: receiverId, content (text or file).

Response: Message ID, timestamp.

### GET /api/messages/{conversationId}

Description: Retrieve all messages in a conversation.

Headers: Authorization: Bearer <JWT token>

Response: List of messages.

### DELETE /api/messages/{messageId}

Description: Delete a specific message.

Headers: Authorization: Bearer <JWT token>

Response: Success message.

### GET /api/messages/unread

Description: Retrieve unread messages.

Headers: Authorization: Bearer <JWT token>

Response: List of unread messages.

## 4. Conversation Management APIs

### POST /api/conversations/create

Description: Create a new conversation (e.g., group or direct chat).

Headers: Authorization: Bearer <JWT token>

Request Body: participant (user IDs).

Response: Conversation ID.

### GET /api/conversations

Description: Retrieve all conversations for the authenticated user.

Headers: Authorization: Bearer <JWT token>

Response: List of conversations.

### POST /api/conversations/{conversationId}/leave ** optional **

Description: Leave a conversation.

Headers: Authorization: Bearer <JWT token>

Response: Success message.

### POST /api/conversations/{conversationId}/add ** optional <Group> **

Description: Add a participant to a conversation.

Headers: Authorization: Bearer <JWT token>

Request Body: userId.

Response: Success message.

## 5. Real-Time Communication (WebSocket)

Endpoint: /ws

Description: Establish a WebSocket connection for real-time messaging, typing indicators, and call signaling.

Authentication: Token-based (JWT).

Events:

- message (send/receive message)
- typing (send/receive typing indicators)
- call (initiate/join/leave video calls) ** optional **
- notification (receive real-time notifications) ** optional **

## OPTIONAL

## 6. File Sharing APIs ** if implemented**

### POST /api/files/upload

Description: Upload a file.

Headers: Authorization: Bearer <JWT token>

Request Body: File data.

Response: File URL.

### GET /api/files/{fileId}

Description: Retrieve a file by its ID.

Headers: Authorization: Bearer <JWT token>

Response: File data.

## 7. Video Call APIs ** if implemented**

### POST /api/calls/start

Description: Start a new video call.

Headers: Authorization: Bearer <JWT token>

Request Body: receiverId.

Response: Call ID, connection details.

### POST /api/calls/{callId}/join

Description: Join an ongoing video call.

Headers: Authorization: Bearer <JWT token>

Response: Success message, connection details.

### POST /api/calls/{callId}/end

Description: End a video call.

Headers: Authorization: Bearer <JWT token>

Response: Success message.

### GET /api/calls/history

Description: Retrieve call history.

Headers: Authorization: Bearer <JWT token>

Response: List of past calls.

## 8. Notification APIs

### GET /api/notifications

Description: Retrieve notifications for the authenticated user.

Headers: Authorization: Bearer <JWT token>

Response: List of notifications.

### POST /api/notifications/mark-as-read

Description: Mark a notification as read.

Headers: Authorization: Bearer <JWT token>

Request Body: notificationId.

Response: Success message.
