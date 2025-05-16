# Auth Backend API

A simple Node.js and Express backend for user authentication with:

- User Signup
- User Login
- JWT Access and Refresh Tokens
- Protected Routes (require valid access token)
- Refresh Token API to issue new access tokens
- Secure password hashing with bcrypt

---

## Features

- Password hashing with bcryptjs
- JWT authentication with access and refresh tokens
- Middleware to protect routes
- Token refresh endpoint
- Logout support (invalidate refresh tokens)

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (or any database of choice)
- bcryptjs
- jsonwebtoken
- dotenv

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB database connection

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/auth-backend.git
node server.js
