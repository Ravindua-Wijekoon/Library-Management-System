# Library Management System

## Overview
The Library Management System is a comprehensive web application built using the MERN stack (MongoDB, Express, React, and Node.js). It streamlines library operations such as managing books, users, and transactions. The frontend is designed with Material-UI (MUI) for a modern and responsive user interface.

---

## Features
- **Book Management**: Add, update, delete, and search books.
- **User Management**: Handle librarian and borrower accounts.
- **Transaction Management**: Issue, return, and track books.
- **Authentication**: Secure login and signup for users with role-based access control.
- **QR Code Scanning**: Easily manage book check-ins and check-outs using QR codes for quick and efficient processing.
- **Responsive Design**: Optimized for desktops, tablets, and mobile devices.

---

## Tech Stack

### Frontend
- React.js
- Material-UI (MUI)
- Axios (for API requests)

### Backend
- Node.js
- Express.js

### Database
- MongoDB (Mongoose ORM)

### Others
- JWT (JSON Web Tokens) for authentication

---

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/library-management-system.git
   cd library-management-system
   ```

2. Install dependencies:
   ```bash
   # Backend dependencies
   cd backend
   npm install

   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the `backend` folder with the following variables:
     ```env
     MONGO_URI=your_mongo_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000

     ```

4. Start the application:
   ```bash
   # Start the backend server
   cd backend
   npm start

   # Start the frontend server
   cd ../frontend
   npm start
   ```

5. Open the application in your browser at `http://localhost:3000`.

---



