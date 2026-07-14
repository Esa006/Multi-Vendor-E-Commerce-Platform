# API Documentation
## Multi-Vendor E-Commerce Platform
**Version:** 1.0.0
**Base URL:** `http://127.0.0.1:8000/api`
**Auth:** Bearer Token (Laravel Sanctum)
**Format:** JSON

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Vendor Management (Admin)](#2-vendor-management-admin)
3. [Category Management (Admin)](#3-category-management-admin)
4. [Product Management](#4-product-management)
5. [Cart](#5-cart)
6. [Wishlist](#6-wishlist)
7. [Orders](#7-orders)
8. [Payments](#8-payments)
9. [Reviews](#9-reviews)
10. [Coupons (Admin)](#10-coupons-admin)
11. [Dashboard](#11-dashboard)
12. [Addresses](#12-addresses)
13. [Response Format](#13-response-format)
14. [HTTP Status Codes](#14-http-status-codes)

---

## Legend
| Symbol | Meaning |
| :--- | :--- |
| 🔓 | Public — No authentication required |
| 🔐 | Protected — Requires Bearer token |
| 👑 | Admin only |
| 🏪 | Vendor only |
| 🛍️ | Customer only |

---

## 1. Authentication

### 1.1 Register
`POST /auth/register` 🔓

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "customer"
}
```
> `role` accepts: `customer` or `vendor`

**Response `201`:**
```json
{
    "success": true,
    "message": "Registration successful. Please verify your email.",
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
}
```

---

### 1.2 Login
`POST /auth/login` 🔓

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response `200`:**
```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "token": "1|abc123...",
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "customer"
        }
    }
}
```

---

### 1.3 Logout
`POST /auth/logout` 🔐

**Response `200`:**
```json
{
    "success": true,
    "message": "Logged out successfully."
}
```

---

### 1.4 Get Authenticated User
`GET /auth/me` 🔐

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer",
        "avatar": "https://res.cloudinary.com/..."
    }
}
```

---

### 1.5 Forgot Password
`POST /auth/forgot-password` 🔓

**Request Body:**
```json
{ "email": "john@example.com" }
```

**Response `200`:**
```json
{ "success": true, "message": "Password reset link sent to your email." }
```

---

### 1.6 Reset Password
`POST /auth/reset-password` 🔓

**Request Body:**
```json
{
    "token": "reset_token_from_email",
    "email": "john@example.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
}
```

---

### 1.7 Email Verification
`GET /auth/verify-email/{id}/{hash}` 🔓

---

## 2. Vendor Management (Admin)

### 2.1 List All Vendors
`GET /admin/vendors` 🔐 👑

**Query Params:** `?status=pending&page=1&per_page=15`

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "vendors": [
            {
                "id": 1,
                "store_name": "Nike Store",
                "store_slug": "nike-store",
                "status": "pending",
                "user": { "name": "Nike Admin", "email": "nike@example.com" }
            }
        ],
        "pagination": { "total": 50, "per_page": 15, "current_page": 1 }
    }
}
```

---

### 2.2 Approve Vendor
`PUT /admin/vendors/{id}/approve` 🔐 👑

**Response `200`:**
```json
{ "success": true, "message": "Vendor approved successfully." }
```

---

### 2.3 Reject Vendor
`PUT /admin/vendors/{id}/reject` 🔐 👑

---

### 2.4 Block / Unblock Vendor
`PUT /admin/vendors/{id}/toggle-status` 🔐 👑

---

### 2.5 Get Vendor Details
`GET /admin/vendors/{id}` 🔐 👑

---

## 3. Category Management (Admin)

### 3.1 List Categories
`GET /categories` 🔓

**Response `200`:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Electronics",
            "slug": "electronics",
            "image": "https://res.cloudinary.com/...",
            "status": "active",
            "children": [
                { "id": 2, "name": "Mobile Phones", "slug": "mobile-phones" }
            ]
        }
    ]
}
```

---

### 3.2 Create Category
`POST /admin/categories` 🔐 👑

**Request Body (multipart/form-data):**
```
name: Electronics
parent_id: (optional)
image: (file)
status: active
```

---

### 3.3 Update Category
`PUT /admin/categories/{id}` 🔐 👑

---

### 3.4 Delete Category
`DELETE /admin/categories/{id}` 🔐 👑

---

## 4. Product Management

### 4.1 List Products (Public)
`GET /products` 🔓

**Query Params:** `?category=electronics&min_price=100&max_price=5000&search=iphone&page=1`

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "products": [
            {
                "id": 1,
                "name": "iPhone 15 Pro",
                "slug": "iphone-15-pro",
                "price": "119999.00",
                "sale_price": "109999.00",
                "thumbnail": "https://res.cloudinary.com/...",
                "stock": 50,
                "average_rating": 4.7,
                "vendor": { "id": 1, "store_name": "Apple Store" },
                "category": { "id": 2, "name": "Mobile Phones" }
            }
        ],
        "pagination": { "total": 200, "per_page": 16, "current_page": 1 }
    }
}
```

---

### 4.2 Get Product Detail
`GET /products/{slug}` 🔓

---

### 4.3 Create Product (Vendor)
`POST /vendor/products` 🔐 🏪

**Request Body (multipart/form-data):**
```
name: iPhone 15 Pro
category_id: 2
description: Full product description...
short_description: Brief description
price: 119999
sale_price: 109999
stock: 50
sku: APPL-IP15P-128
thumbnail: (file)
images[]: (multiple files)
variants[0][name]: Storage
variants[0][value]: 128GB
variants[0][price]: 119999
variants[0][stock]: 30
```

**Response `201`:**
```json
{
    "success": true,
    "message": "Product submitted for approval.",
    "data": { "product": { "id": 1, "name": "iPhone 15 Pro", "status": "pending" } }
}
```

---

### 4.4 Update Product (Vendor)
`PUT /vendor/products/{id}` 🔐 🏪

---

### 4.5 Delete Product (Vendor)
`DELETE /vendor/products/{id}` 🔐 🏪

---

### 4.6 Vendor's Product List
`GET /vendor/products` 🔐 🏪

**Query Params:** `?status=active&page=1`

---

### 4.7 Approve Product (Admin)
`PUT /admin/products/{id}/approve` 🔐 👑

---

### 4.8 Feature Product (Admin)
`PUT /admin/products/{id}/feature` 🔐 👑

---

## 5. Cart

### 5.1 Get Cart
`GET /cart` 🔐 🛍️

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": 1,
                "product": { "id": 1, "name": "iPhone 15 Pro", "thumbnail": "..." },
                "variant": { "name": "Storage", "value": "128GB" },
                "quantity": 2,
                "unit_price": "109999.00",
                "subtotal": "219998.00"
            }
        ],
        "summary": {
            "subtotal": "219998.00",
            "discount": "0.00",
            "total": "219998.00"
        }
    }
}
```

---

### 5.2 Add to Cart
`POST /cart` 🔐 🛍️

**Request Body:**
```json
{
    "product_id": 1,
    "variant_id": 3,
    "quantity": 2
}
```

---

### 5.3 Update Cart Item
`PUT /cart/{id}` 🔐 🛍️

**Request Body:**
```json
{ "quantity": 3 }
```

---

### 5.4 Remove Cart Item
`DELETE /cart/{id}` 🔐 🛍️

---

### 5.5 Apply Coupon
`POST /cart/apply-coupon` 🔐 🛍️

**Request Body:**
```json
{ "code": "SAVE20" }
```

**Response `200`:**
```json
{
    "success": true,
    "message": "Coupon applied successfully.",
    "data": {
        "discount": "43999.60",
        "total": "175998.40"
    }
}
```

---

### 5.6 Remove Coupon
`DELETE /cart/remove-coupon` 🔐 🛍️

---

## 6. Wishlist

### 6.1 Get Wishlist
`GET /wishlist` 🔐 🛍️

---

### 6.2 Add to Wishlist
`POST /wishlist` 🔐 🛍️

**Request Body:**
```json
{ "product_id": 1 }
```

---

### 6.3 Remove from Wishlist
`DELETE /wishlist/{id}` 🔐 🛍️

---

### 6.4 Move to Cart
`POST /wishlist/{id}/move-to-cart` 🔐 🛍️

---

## 7. Orders

### 7.1 Place Order
`POST /orders` 🔐 🛍️

**Request Body:**
```json
{
    "address_id": 2,
    "payment_method": "razorpay",
    "coupon_code": "SAVE20"
}
```

**Response `201`:**
```json
{
    "success": true,
    "message": "Order placed successfully.",
    "data": {
        "order": {
            "id": 10,
            "order_number": "ORD-20260714-0010",
            "grand_total": "175998.40",
            "status": "pending",
            "payment_status": "pending",
            "razorpay_order_id": "order_xyz123"
        }
    }
}
```

---

### 7.2 Get Customer Orders
`GET /orders` 🔐 🛍️

---

### 7.3 Get Order Detail
`GET /orders/{orderNumber}` 🔐 🛍️

---

### 7.4 Download Invoice
`GET /orders/{orderNumber}/invoice` 🔐 🛍️

Returns PDF file.

---

### 7.5 Get Vendor Orders
`GET /vendor/orders` 🔐 🏪

---

### 7.6 Update Order Item Status (Vendor)
`PUT /vendor/orders/{orderItemId}/status` 🔐 🏪

**Request Body:**
```json
{ "status": "shipped" }
```

---

### 7.7 Get All Orders (Admin)
`GET /admin/orders` 🔐 👑

---

## 8. Payments

### 8.1 Create Razorpay Order
`POST /payments/razorpay/create-order` 🔐 🛍️

**Request Body:**
```json
{ "order_id": 10 }
```

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "razorpay_order_id": "order_xyz123",
        "amount": 17599840,
        "currency": "INR",
        "key": "rzp_test_xxxxxxxx"
    }
}
```

---

### 8.2 Verify Payment
`POST /payments/razorpay/verify` 🔐 🛍️

**Request Body:**
```json
{
    "razorpay_order_id": "order_xyz123",
    "razorpay_payment_id": "pay_abc456",
    "razorpay_signature": "signature_string"
}
```

**Response `200`:**
```json
{
    "success": true,
    "message": "Payment verified. Order confirmed.",
    "data": { "order_number": "ORD-20260714-0010" }
}
```

---

### 8.3 Razorpay Webhook
`POST /payments/razorpay/webhook` 🔓 *(Secured by webhook signature)*

Handles: `payment.captured`, `payment.failed`, `refund.processed`

---

## 9. Reviews

### 9.1 Get Product Reviews
`GET /products/{id}/reviews` 🔓

---

### 9.2 Submit Review
`POST /reviews` 🔐 🛍️

**Request Body:**
```json
{
    "product_id": 1,
    "order_item_id": 5,
    "rating": 5,
    "title": "Amazing product!",
    "comment": "Delivery was fast and product is great."
}
```

---

### 9.3 Approve Review (Admin)
`PUT /admin/reviews/{id}/approve` 🔐 👑

---

### 9.4 Reject Review (Admin)
`PUT /admin/reviews/{id}/reject` 🔐 👑

---

## 10. Coupons (Admin)

### 10.1 List Coupons
`GET /admin/coupons` 🔐 👑

---

### 10.2 Create Coupon
`POST /admin/coupons` 🔐 👑

**Request Body:**
```json
{
    "code": "SAVE20",
    "description": "20% off on all orders",
    "type": "percentage",
    "value": 20,
    "min_order_amount": 1000,
    "max_discount": 500,
    "usage_limit": 100,
    "expires_at": "2026-12-31",
    "is_active": true
}
```

---

### 10.3 Update Coupon
`PUT /admin/coupons/{id}` 🔐 👑

---

### 10.4 Delete Coupon
`DELETE /admin/coupons/{id}` 🔐 👑

---

## 11. Dashboard

### 11.1 Admin Dashboard Stats
`GET /admin/dashboard` 🔐 👑

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "total_sales": "5892340.00",
        "total_orders": 1240,
        "total_vendors": 48,
        "total_customers": 3521,
        "pending_vendors": 5,
        "pending_products": 18,
        "sales_chart": [
            { "date": "2026-07-01", "revenue": "48200.00" }
        ],
        "top_products": [],
        "top_vendors": []
    }
}
```

---

### 11.2 Vendor Dashboard Stats
`GET /vendor/dashboard` 🔐 🏪

**Response `200`:**
```json
{
    "success": true,
    "data": {
        "total_products": 25,
        "total_orders": 340,
        "total_revenue": "892340.00",
        "pending_orders": 12,
        "low_stock_products": 3,
        "earnings_chart": []
    }
}
```

---

### 11.3 Customer Dashboard
`GET /customer/dashboard` 🔐 🛍️

---

## 12. Addresses

### 12.1 List Addresses
`GET /addresses` 🔐 🛍️

---

### 12.2 Add Address
`POST /addresses` 🔐 🛍️

**Request Body:**
```json
{
    "name": "John Doe",
    "phone": "9876543210",
    "address": "123 Main Street",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "zip_code": "600001",
    "is_default": true
}
```

---

### 12.3 Update Address
`PUT /addresses/{id}` 🔐 🛍️

---

### 12.4 Delete Address
`DELETE /addresses/{id}` 🔐 🛍️

---

## 13. Response Format

### Success Response
```json
{
    "success": true,
    "message": "Descriptive success message.",
    "data": { },
    "status": 200
}
```

### Error Response
```json
{
    "success": false,
    "message": "Descriptive error message.",
    "errors": { "field": ["Validation error detail."] },
    "status": 422
}
```

### Paginated Response
```json
{
    "success": true,
    "data": {
        "items": [ ],
        "pagination": {
            "total": 100,
            "per_page": 15,
            "current_page": 1,
            "last_page": 7,
            "next_page_url": "http://localhost:8000/api/products?page=2",
            "prev_page_url": null
        }
    }
}
```

---

## 14. HTTP Status Codes

| Code | Meaning | When Used |
| :--- | :--- | :--- |
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE with no body |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | No or invalid token |
| 403 | Forbidden | Valid token but wrong role |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
