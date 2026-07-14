# Software Requirements Specification (SRS)
## Multi-Vendor E-Commerce Platform
**Version:** 1.0.0
**Date:** 2026-07-14
**Status:** Draft

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [User Roles](#3-user-roles)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Constraints & Assumptions](#6-constraints--assumptions)
7. [Future Scope](#7-future-scope)

---

## 1. Introduction

### 1.1 Purpose
This document defines the complete software requirements for the Multi-Vendor E-Commerce Platform. It is intended for developers, designers, QA engineers, and project stakeholders.

### 1.2 Project Overview
A web-based marketplace where:
- **Multiple vendors** can register, manage their stores, and list products.
- **Customers** can browse, purchase from multiple vendors in a single checkout.
- **A Super Admin** manages and oversees the entire platform.

### 1.3 Scope
The platform will be built as a REST API backend (Laravel 12) consumed by a React 19 frontend. It will support three user roles, 10+ modules, and integrate with Razorpay for payments and Cloudinary for image storage.

### 1.4 Definitions
| Term | Meaning |
| :--- | :--- |
| SRS | Software Requirements Specification |
| API | Application Programming Interface |
| ERD | Entity Relationship Diagram |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| OTP | One Time Password |

---

## 2. Overall Description

### 2.1 System Perspective
```
Customer / Vendor / Admin (Browser)
              ↓
       React 19 Frontend
              ↓
     REST API (Laravel 12)
              ↓
   Laravel Sanctum (Auth) + Spatie (RBAC)
              ↓
     Business Logic Layer
              ↓
    MySQL 8 Database
              ↓
  Cloudinary | Razorpay | SMTP
```

### 2.2 Operating Environment
| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, Vite, Bootstrap 5.3 |
| Backend | Laravel 12, PHP 8.4 |
| Database | MySQL 8 |
| Auth | Laravel Sanctum |
| RBAC | Spatie Laravel Permission |
| Storage | Cloudinary |
| Payment | Razorpay |
| Email | Mailtrap (Dev) / SMTP (Prod) |
| Server | Nginx on DigitalOcean VPS |

---

## 3. User Roles

### 3.1 Super Admin
Platform owner with full control over all data, users, and configurations.

### 3.2 Vendor
A registered and approved seller who manages their own store, products, and orders.

### 3.3 Customer
An end-user who browses the marketplace, shops from multiple vendors, and manages their account.

---

## 4. Functional Requirements

### Module 1: Authentication & Authorization

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-01 | User can register with name, email, password | High |
| FR-02 | Email verification link sent on registration | High |
| FR-03 | User can login with email and password | High |
| FR-04 | Forgot password via email reset link | High |
| FR-05 | Role assigned on registration (customer/vendor) | High |
| FR-06 | Sanctum token issued on login | High |
| FR-07 | Protected routes based on role (RBAC) | High |
| FR-08 | User can logout and token is revoked | High |

---

### Module 2: Vendor Management (Admin)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-09 | Admin can view all vendor applications | High |
| FR-10 | Admin can approve or reject vendor | High |
| FR-11 | Admin can block/unblock vendor account | High |
| FR-12 | Admin receives notification on new vendor signup | Medium |
| FR-13 | Admin can view vendor's store, products, and sales | High |

---

### Module 3: Category Management (Admin)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-14 | Admin can create parent categories | High |
| FR-15 | Admin can create subcategories under a parent | High |
| FR-16 | Admin can upload a category image | Medium |
| FR-17 | Admin can activate or deactivate categories | High |
| FR-18 | Category slug auto-generated from name | Medium |

---

### Module 4: Product Management

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-19 | Vendor can add a product with name, description, price | High |
| FR-20 | Vendor can upload multiple product images | High |
| FR-21 | Vendor can add product variants (Size, Color) | High |
| FR-22 | Vendor can update product stock | High |
| FR-23 | Vendor can set product status (active/inactive) | High |
| FR-24 | Admin must approve product before it goes live | High |
| FR-25 | Admin can feature a product on homepage | Medium |
| FR-26 | Product has a unique SKU | High |
| FR-27 | Product slug auto-generated from name | Medium |

---

### Module 5: Cart

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-28 | Customer can add product to cart | High |
| FR-29 | Customer can select a variant when adding to cart | High |
| FR-30 | Customer can update product quantity in cart | High |
| FR-31 | Customer can remove product from cart | High |
| FR-32 | Customer can apply a coupon code | Medium |
| FR-33 | Cart shows subtotal, discount, and grand total | High |

---

### Module 6: Wishlist

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-34 | Customer can save product to wishlist | Medium |
| FR-35 | Customer can remove product from wishlist | Medium |
| FR-36 | Customer can move product from wishlist to cart | Medium |

---

### Module 7: Order Management

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-37 | Customer can place order at checkout | High |
| FR-38 | Unique order number generated per order | High |
| FR-39 | Customer receives order confirmation email | High |
| FR-40 | Vendor can view orders for their products | High |
| FR-41 | Vendor can update order item status | High |
| FR-42 | Customer can view order history | High |
| FR-43 | Customer can download invoice as PDF | Medium |
| FR-44 | Customer can request return/refund | Medium |
| FR-45 | Admin can view and manage all orders | High |

---

### Module 8: Payment

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-46 | Customer can pay via Razorpay (card/UPI/wallet) | High |
| FR-47 | Payment status updated via webhook | High |
| FR-48 | COD payment option available | Medium |
| FR-49 | Payment transaction recorded in database | High |
| FR-50 | Refund initiated via Razorpay API | Medium |

---

### Module 9: Reviews & Ratings

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-51 | Customer can rate a purchased product (1–5 stars) | Medium |
| FR-52 | Customer can write a review title and comment | Medium |
| FR-53 | Review requires Admin approval before publishing | Medium |
| FR-54 | Average rating displayed on product page | Medium |

---

### Module 10: Coupon Management (Admin)

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-55 | Admin can create coupon with code, type, and value | Medium |
| FR-56 | Coupon type can be `percentage` or `fixed` | Medium |
| FR-57 | Admin can set min order amount and expiry date | Medium |
| FR-58 | Admin can activate or deactivate coupons | Medium |
| FR-59 | System validates coupon at checkout | Medium |

---

### Module 11: Dashboards

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-60 | Admin dashboard shows total sales, vendors, customers | High |
| FR-61 | Admin dashboard shows revenue chart | High |
| FR-62 | Vendor dashboard shows revenue and recent orders | High |
| FR-63 | Vendor dashboard shows low stock alerts | Medium |
| FR-64 | Customer dashboard shows order history and wishlist | High |

---

### Module 12: Vendor Earnings

| ID | Requirement | Priority |
| :--- | :--- | :--- |
| FR-65 | Platform deducts commission on each sale | High |
| FR-66 | Vendor can view gross, commission, and net earnings | High |
| FR-67 | Admin can configure commission rate globally | High |

---

## 5. Non-Functional Requirements

| ID | Requirement | Detail |
| :--- | :--- | :--- |
| NFR-01 | Security | API protected with Sanctum tokens. Passwords hashed with bcrypt. |
| NFR-02 | Authorization | Role-based access using Spatie Permission (admin/vendor/customer). |
| NFR-03 | Performance | API response < 500ms for standard queries. |
| NFR-04 | Scalability | Laravel Queues for emails and heavy tasks. Redis in Phase 2. |
| NFR-05 | Reliability | Laravel Scheduler for automated tasks (payout processing, reports). |
| NFR-06 | Availability | 99.9% uptime on production VPS. |
| NFR-07 | Responsiveness | UI works on mobile, tablet, and desktop (Bootstrap 5.3). |
| NFR-08 | Maintainability | Code follows PSR-12 (PHP) and Airbnb (JavaScript) standards. |
| NFR-09 | Testability | API endpoints tested with Postman collections. |
| NFR-10 | Data Integrity | Foreign key constraints enforced at database level. |

---

## 6. Constraints & Assumptions

- Vendors must be **approved by Super Admin** before listing any products.
- Customers must **verify email** before placing orders.
- Products must be **approved by Super Admin** before they appear publicly.
- The platform charges a **commission fee** (configurable) from each vendor sale.
- All product images are uploaded to **Cloudinary** (not local storage).
- Primary payment gateway is **Razorpay**. Stripe is optional for Phase 2.
- The system assumes a **single currency** (INR) in Phase 1.

---

## 7. Future Scope (Phase 2)

| Feature | Description |
| :--- | :--- |
| Redis Caching | Faster product listing and session management |
| Real-time Notifications | Laravel Broadcasting + Pusher |
| Live Chat | Customer ↔ Vendor messaging |
| Elasticsearch | Advanced product search |
| Social Login | Google / Facebook OAuth |
| Multi-currency | Support USD, EUR, GBP |
| Docker | Containerized deployment |
| GitHub Actions CI/CD | Automated testing and deployment pipeline |
| Microservices | Gradually split into independent services |
