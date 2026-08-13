# E-Commerce REST API Documentation

This document describes all available endpoints for the E-Commerce Backend REST API built with Node.js, Express.js, TypeScript, and Prisma ORM.

## Base URL

`http://localhost:5000/api`

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
```

### Success Response with Pagination
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

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 1. Health Check

### GET `/api/health`
- **Auth**: Public
- **Response**: `200 OK`

---

## 2. Authentication

### POST `/api/auth/register`
- **Auth**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: `201 Created`

### POST `/api/auth/login`
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!"
  }
  ```
- **Response**: `200 OK` (Returns JWT token)

### GET `/api/auth/me`
- **Auth**: Authenticated (`Authorization: Bearer <token>`)
- **Response**: `200 OK`

---

## 3. Users Management

### GET `/api/users`
- **Auth**: ADMIN (`Authorization: Bearer <adminToken>`)
- **Response**: `200 OK`

### GET `/api/users/:id`
- **Auth**: Authenticated (User can access own profile, Admin can access any profile)
- **Response**: `200 OK`

### PATCH `/api/users/:id`
- **Auth**: Authenticated (User can update own profile, Admin can update any profile)
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```
- **Response**: `200 OK`

### PATCH `/api/users/:id/role`
- **Auth**: ADMIN
- **Body**:
  ```json
  {
    "role": "ADMIN"
  }
  ```
- **Response**: `200 OK`

### DELETE `/api/users/:id`
- **Auth**: ADMIN
- **Response**: `200 OK` (Soft deletes user)

---

## 4. Category Management

### GET `/api/categories`
- **Auth**: Public
- **Response**: `200 OK`

### GET `/api/categories/:id`
- **Auth**: Public
- **Response**: `200 OK`

### POST `/api/categories`
- **Auth**: ADMIN
- **Body**:
  ```json
  {
    "name": "Electronics",
    "description": "Gadgets and electronic items"
  }
  ```
- **Response**: `201 Created`

### PATCH `/api/categories/:id`
- **Auth**: ADMIN
- **Body**:
  ```json
  {
    "name": "Consumer Electronics",
    "description": "Updated description"
  }
  ```
- **Response**: `200 OK`

### DELETE `/api/categories/:id`
- **Auth**: ADMIN
- **Response**: `200 OK` (Soft deletes category)

---

## 5. Product Management

### GET `/api/products`
- **Auth**: Public
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10, max: 50)
  - `search` (searches name & description)
  - `categoryId` (filter by category ID)
  - `status` (`ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`)
  - `minPrice` (minimum price filter)
  - `maxPrice` (maximum price filter)
- **Response**: `200 OK`

### GET `/api/products/:id`
- **Auth**: Public
- **Response**: `200 OK`

### POST `/api/products`
- **Auth**: ADMIN
- **Body**:
  ```json
  {
    "name": "Wireless Headphones",
    "description": "Bluetooth wireless headphones",
    "price": 59.99,
    "stock": 20,
    "image": "https://example.com/headphones.jpg",
    "categoryId": "CATEGORY_ID"
  }
  ```
- **Response**: `201 Created`

### PATCH `/api/products/:id`
- **Auth**: ADMIN
- **Body**:
  ```json
  {
    "price": 49.99,
    "stock": 15
  }
  ```
- **Response**: `200 OK`

### DELETE `/api/products/:id`
- **Auth**: ADMIN
- **Response**: `200 OK` (Soft deletes product)

---

## 6. Review Management

### POST `/api/products/:productId/reviews`
- **Auth**: Authenticated USER
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Outstanding audio quality and comfortable battery life!"
  }
  ```
- **Response**: `201 Created`

### GET `/api/products/:productId/reviews`
- **Auth**: Public
- **Query Parameters**: `page`, `limit`
- **Response**: `200 OK`

### PATCH `/api/reviews/:id`
- **Auth**: Review Owner or ADMIN
- **Body**:
  ```json
  {
    "rating": 4,
    "comment": "Updated comment: Still good!"
  }
  ```
- **Response**: `200 OK`

### DELETE `/api/reviews/:id`
- **Auth**: Review Owner or ADMIN
- **Response**: `200 OK` (Soft deletes review)

---

## 7. Order Management

### POST `/api/orders`
- **Auth**: Authenticated USER
- **Body**:
  ```json
  {
    "items": [
      {
        "productId": "PRODUCT_ID_1",
        "quantity": 2
      },
      {
        "productId": "PRODUCT_ID_2",
        "quantity": 1
      }
    ]
  }
  ```
- **Response**: `201 Created`

### GET `/api/orders`
- **Auth**: Authenticated (User receives own orders; Admin receives all orders)
- **Query Parameters**: `page`, `limit`
- **Response**: `200 OK`

### GET `/api/orders/:id`
- **Auth**: Authenticated (User receives own order; Admin receives any order)
- **Response**: `200 OK`

### PATCH `/api/orders/:id/status`
- **Auth**: ADMIN
- **Body**:
  ```json
  {
    "status": "SHIPPED"
  }
  ```
- **Status values**: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- **Note**: Canceling an order automatically restores product stock.
- **Response**: `200 OK`

### DELETE `/api/orders/:id`
- **Auth**: ADMIN
- **Response**: `200 OK` (Soft deletes order)
