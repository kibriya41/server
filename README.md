# E-Commerce REST API Engine (SCIC / EJP-13)

A production-ready, scalable, and well-structured E-Commerce REST API built using **Node.js**, **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🔗 Submission Links

* **Live API URL**: `https://ecommerce-api-4z3n.onrender.com`
* **GitHub Repository**: [https://github.com/kibriya41/server](https://github.com/kibriya41/server)
* **API Documentation**: [`docs/API.md`](docs/API.md)
* **Postman Collection**: [`docs/postman-collection.json`](docs/postman-collection.json)

---

## 🛠️ Technology Stack

* **Core Runtime**: Node.js & Express.js
* **Language**: TypeScript (`strict` mode enabled)
* **Database & ORM**: PostgreSQL with Prisma ORM (v7)
* **Authentication**: JWT (`jsonwebtoken`) & Password Hashing (`bcrypt`)
* **Validation**: Zod schema validation
* **Environment Configuration**: `dotenv` & `cors`

---

## 📁 Project Architecture

```
server/
├── docs/                     # Full API Documentation & Postman Collection
│   ├── API.md
│   └── postman-collection.json
├── prisma/
│   ├── schema.prisma         # Database Schema, Models & Enums
│   ├── seed.ts               # Database Seed Script
│   └── migrations/           # Versioned SQL Migrations
├── src/
│   ├── app.ts                # Express app setup & middleware
│   ├── server.ts             # Entry point & DB connection
│   ├── controllers/          # Request & Response Handlers
│   ├── routes/               # Modular API Route definitions
│   ├── services/             # Core Business Logic & Database Queries
│   ├── middleware/           # Auth, Admin, and Error Middleware
│   ├── validators/           # Zod Input Validation Schemas
│   ├── lib/                  # Shared Singletons (Prisma, JWT, Slug)
│   └── utils/                # Helper functions
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema & Models

### Enums
* `UserRole`: `USER`, `ADMIN`
* `ProductStatus`: `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`
* `OrderStatus`: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### Models & Relations
* **`User`**: User profiles with hashed passwords, roles (`USER`/`ADMIN`), soft deletion (`isDeleted`), timestamps.
* **`Category`**: Product categories with unique names & auto-generated slugs.
* **`Product`**: E-commerce products linked to categories, stock tracking, price decimal validation, statuses.
* **`Review`**: User product reviews & 1-5 star ratings with unique `[userId, productId]` constraint.
* **`Order` & `OrderItem`**: Multi-item customer orders with order status workflows and auto-stock restoration on cancellation.

---

## 🌐 API Overview

### Standard Response Format

#### Success
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

#### Success with Pagination
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

---

### Endpoint Summary

#### 1. System Health
* `GET /api/health` - Check API status (Public)

#### 2. Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Authenticate user & receive JWT token
* `GET /api/auth/me` - Get current authenticated user profile

#### 3. Users Management (`/api/users`)
* `GET /api/users` - Get all users (Admin only)
* `GET /api/users/:id` - Get user by ID (User/Admin)
* `PATCH /api/users/:id` - Update user profile (User/Admin)
* `PATCH /api/users/:id/role` - Update user role (Admin only)
* `DELETE /api/users/:id` - Soft delete user (Admin only)

#### 4. Category Management (`/api/categories`)
* `GET /api/categories` - List categories (Public)
* `GET /api/categories/:id` - Get category by ID (Public)
* `POST /api/categories` - Create category (Admin only)
* `PATCH /api/categories/:id` - Update category (Admin only)
* `DELETE /api/categories/:id` - Soft delete category (Admin only)

#### 5. Product Management (`/api/products`)
* `GET /api/products` - List products with search, pagination, category & price filters (Public)
* `GET /api/products/:id` - Get product details (Public)
* `POST /api/products` - Create product (Admin only)
* `PATCH /api/products/:id` - Update product (Admin only)
* `DELETE /api/products/:id` - Soft delete product (Admin only)

#### 6. Reviews (`/api/reviews` & `/api/products/:productId/reviews`)
* `POST /api/products/:productId/reviews` - Add review for product (Authenticated User)
* `GET /api/products/:productId/reviews` - Get product reviews (Public)
* `PATCH /api/reviews/:id` - Update review (Owner/Admin)
* `DELETE /api/reviews/:id` - Soft delete review (Owner/Admin)

#### 7. Order Management (`/api/orders`)
* `POST /api/orders` - Place new order (Authenticated User)
* `GET /api/orders` - Get user's orders (User) or all orders (Admin)
* `GET /api/orders/:id` - Get order by ID (Owner/Admin)
* `PATCH /api/orders/:id/status` - Update order status (Admin only)
* `DELETE /api/orders/:id` - Soft delete order (Admin only)

---

## 💻 Local Development Setup

1. **Clone Repository**:
   ```bash
   git clone https://github.com/kibriya41/server.git
   cd server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/server"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   ```

4. **Run Database Migrations & Prisma Generate**:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 📜 License
This project is open-source and available under the ISC License.
