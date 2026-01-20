<<<<<<< HEAD
# order-management-service
A backend system for managing products, inventory, and orders with atomic order processing, concurrency safety, and inventory consistency.
=======
# Product and Order Management System

A full-stack application built with React, Node.js, Express, and SQLite for managing products and orders.

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend**: Node.js, Express, Prisma ORM
*   **Database**: SQLite

## Prerequisites
*   Node.js (v18 or higher)
*   Git

## Quick Start (Windows)
1.  Double-click `setup_and_run.bat` in the root directory.
    *   This will verify dependencies, set up the database, and start the application.

## Manual Setup

### 1. Install Dependencies
```bash
# Root
npm install

# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 2. Database Setup
```bash
cd server
# Generate Prisma Client and run migrations
npx prisma migrate dev --name init
```

### 3. Run Application
```bash
# Return to root
cd ..
npm run dev
```
*   **Frontend**: http://localhost:5173
*   **Backend**: http://localhost:3000

## Features
*   **Product Management**: Create products with stock tracking.
*   **Order System**: Add to cart, place orders, and view order history.
*   **Dashboard**: View key metrics (Revenue, Orders, Products).
*   **Architecture View**: Visual representation of the system architecture.
>>>>>>> 2a5faa9 (Initial commit: Order Management Service)
