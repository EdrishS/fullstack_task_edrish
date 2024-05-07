# Fullstack To-Do List App
A simple to-do list application with WebSocket-based real-time updates, integrated with Redis and MongoDB for data storage. Built with Node.js for the backend, React.js for the frontend, and CSS/SCSS for styling.

# Features

1. Add new items to the to-do list via WebSocket messaging.
2. Store to-do items in a Redis cache with automatic migration to MongoDB when the cache exceeds 50 items.
3. Retrieve all items through a RESTful HTTP API endpoint.
4. Responsive design for desktop, tablet, and mobile screens.

# Technologies Used

# Backend
Node.js
WebSocket 
Redis
MongoDB
Express.js

# Frontend
React.js
Typescript
CSS/SCSS

# Setup
1. Clone the repository.
2. Navigate to the project directory.
3. Start the backend server.(websocket-server)
   `ts-node server.ts`
4. Start the frontend development server.
   `npm install`
   `npm run start`
6. Access the application at `http://localhost:3000`.
