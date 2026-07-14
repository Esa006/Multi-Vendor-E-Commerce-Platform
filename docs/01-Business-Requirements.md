# Business Requirements
## Multi-Vendor E-Commerce Platform

---

## Overview

A production-ready Multi-Vendor E-Commerce Platform where multiple vendors can register, manage their stores, upload products, receive orders, and sell through a single marketplace. Customers can browse across all vendors, add items to cart, checkout, and track their orders — all in one place.

---

## 1. Roles

| Role | Description |
| :--- | :--- |
| **Super Admin** | Has complete control over the entire platform. Manages all users, vendors, products, categories, orders, reports, and coupons. |
| **Vendor** | A registered seller who manages their own store within the platform. Can add products, manage inventory, fulfill orders, and view their earnings. |
| **Customer** | An end-user who browses the platform, adds products to cart/wishlist, and purchases from any vendor. |

---

## 2. Features

---

### Super Admin Features

#### 2.1 Manage Vendors
- View all registered vendor applications
- Approve or reject vendor registrations
- Block / unblock active vendors
- View individual vendor store details and performance

#### 2.2 Manage Customers
- View all registered customers
- View customer order history
- Activate or deactivate customer accounts
- Search and filter customers

#### 2.3 Manage Categories
- Create top-level categories
- Create subcategories under any category
- Edit, activate, or deactivate categories
- Upload category images

#### 2.4 Manage Products
- View all products across all vendors
- Approve or reject products submitted by vendors
- Feature or unfeature products on the homepage
- Remove any product from the platform

#### 2.5 Manage Orders
- View all orders placed across the platform
- Filter orders by status, vendor, or date
- Update order status manually if required
- Process refunds on orders

#### 2.6 Reports
- View total sales and revenue over time
- View top-selling products and vendors
- View customer acquisition data
- Export reports to CSV / PDF

#### 2.7 Coupons
- Create platform-wide discount coupons
- Set coupon type: `percentage` or `fixed`
- Set minimum order amount and expiry date
- Activate or deactivate any coupon
- Track coupon usage count

---

### Vendor Features

#### 2.8 Dashboard
- Overview of total sales, revenue, and pending orders
- Low stock alerts for products
- Recent order summary
- Earnings chart (daily / weekly / monthly)

#### 2.9 Products
- Add new products with title, description, price, and images
- Edit or delete existing products
- Set product status: `active`, `inactive`
- Assign products to categories

#### 2.10 Inventory
- Update stock levels for individual products
- Manage product variants (e.g., Size: S/M/L, Color: Red/Blue)
- Track out-of-stock products

#### 2.11 Orders
- View all orders placed for their products
- Update individual order item status: `Processing`, `Shipped`, `Delivered`
- View buyer contact and shipping details

#### 2.12 Earnings
- View total gross revenue and platform commission breakdown
- View net earnings (after commission)
- Filter earnings by date range
- View payout status per order

#### 2.13 Store Settings
- Update store name, description, logo, and banner
- Manage store address and contact information
- View store public profile URL (slug)

---

### Customer Features

#### 2.14 Register / Login
- Register with name, email, and password
- Verify email via verification link
- Login with email and password
- Reset forgotten password via email link
- Social login *(Phase 2)*

#### 2.15 Browse Products
- View all products across all vendors
- Filter by category, price range, rating
- Search products by keyword
- View individual product detail page
- View vendor store page

#### 2.16 Cart
- Add products to cart (with variant selection)
- Update product quantity in cart
- Remove products from cart
- Apply coupon codes for discounts
- View cart summary with total amount

#### 2.17 Wishlist
- Save products to a personal wishlist
- Remove products from the wishlist
- Move products from wishlist to cart

#### 2.18 Checkout
- Enter or select a saved delivery address
- Choose payment method (Razorpay / COD)
- Review order summary before placing
- Place order and receive confirmation

#### 2.19 Order History
- View all past orders with current status
- View individual order details and invoice
- Download invoice as PDF
- Track order delivery status in real-time
- Request return or refund on delivered orders

#### 2.20 Reviews
- Submit a rating (1–5 stars) for a purchased product
- Write a review title and comment
- Edit or delete a submitted review
- View all reviews on a product detail page

---

## 3. Non-Functional Requirements

| Requirement | Detail |
| :--- | :--- |
| **Security** | All API endpoints protected via Laravel Sanctum. Role-based access via Spatie Permission. |
| **Scalability** | Background jobs via Laravel Queues. Redis caching in Phase 2. |
| **Performance** | Database indexing on foreign keys. Optimized Eloquent queries. |
| **Availability** | Deployed on VPS (DigitalOcean / Hostinger). Nginx web server. |
| **Responsiveness** | Fully responsive UI (Bootstrap 5.3) for mobile and desktop. |
| **Reliability** | Laravel Scheduler for automated tasks (e.g., payout processing). |

---

## 4. Constraints & Assumptions

- Vendors must be **approved by the Super Admin** before they can list products.
- Customers must have a **verified email** before placing an order.
- The platform takes a **commission percentage** from each vendor sale (configured by Admin).
- Payment is handled exclusively through **Razorpay** (Phase 1). Stripe is optional in Phase 2.
- Product images are stored on **Cloudinary**.

---

## 5. Future Scope (Phase 2)

- Redis Caching for faster product listing
- Real-time notifications via Laravel Broadcasting
- Live Chat between Customer and Vendor
- Multi-language support
- Social Login (Google / Facebook)
- Docker containerization
- GitHub Actions CI/CD Pipeline
- Elasticsearch for advanced product search
